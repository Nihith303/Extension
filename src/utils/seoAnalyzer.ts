import { BaseLink, ExternalLink, HeadingData, ImageElement, InternalLink, SchemaElement, SEOAnalysis, SEOOverview, SocialData, LinkData} from "../types/seo";

function isChromeExtension(): boolean {
  return Boolean(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id);
}

export async function analyzePage(): Promise<SEOAnalysis> {

  console.log('Starting page analysis');

  try {
    if (!isChromeExtension()) {
      throw new Error('This function must be run in a Chrome extension context');
    }

    // Get current tab
    const [tab] = await chrome.tabs.query({ 
      active: true, 
      currentWindow: true 
    });
    
    if (!tab?.id) {
      console.error('No active tab found');
      throw new Error('No active tab found');
    }

    // Add error handling for URL check
    if (!tab.url?.startsWith('http')) {
      console.error('Can only analyze HTTP/HTTPS pages');
      throw new Error('Can only analyze HTTP/HTTPS pages');
    }

    // Execute the analysis in the context of the webpage
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: analyzePageContent,
      args: [],
      world: 'ISOLATED' // Change to ISOLATED world for better security
    });

    console.log('Script execution results:', results);

    if (!results?.[0]?.result) {
      console.error('Analysis failed: No results returned');
      throw new Error('Analysis failed: No results returned');
    }

    return results[0].result;
  } catch (error) {
    console.error('SEO Analysis failed:', error);
    throw error;
  }
}

// This function runs in the context of the web page
async function analyzePageContent(): Promise<SEOAnalysis> {
  try {
    console.log('Starting page content analysis');
    
    // Define helper functions inside to make them available in the execution context
    function analyzeRobotsMeta() {
      const robotsMeta = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
      const robotsContent = robotsMeta.toLowerCase();
      
      return {
        index: !robotsContent.includes('noindex'),
        follow: !robotsContent.includes('nofollow'),
        imageIndex: !robotsContent.includes('noimageindex'),
        archive: !robotsContent.includes('noarchive'),
        snippet: !robotsContent.includes('nosnippet'),
        rawContent: robotsMeta
      };
    }

    function analyzeHeadings(): HeadingData {
      console.log('Analyzing headings');
      const headingData: HeadingData = {
        structure: {
          h1: [],
          h2: [],
          h3: [],
          h4: [],
          h5: [],
          h6: []
        },
        analysis: {
          hasValidHierarchy: true,
          multipleH1: false,
          issues: []
        }
      };

      // Collect all headings in one go
      const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));

      // Sort headings based on their order in the DOM
      allHeadings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1)); // Get the heading level (1-6)
        headingData.structure[`h${level}` as keyof typeof headingData.structure].push({
          content: heading.textContent?.trim() || '',
          position: index + 1,
          wordCount: (heading.textContent?.trim().split(/\s+/).length || 0),
          containsKeywords: false // To be implemented with keyword analysis
        });
      });

      // Validate hierarchy
      const headerOrder = ["h1", "h2", "h3", "h4", "h5", "h6"];
      let lastIndex = -1;

      for (const heading of allHeadings) {
        const currentIndex = headerOrder.indexOf(heading.tagName.toLowerCase());
        if (currentIndex < lastIndex) {
          headingData.analysis.hasValidHierarchy = false;
          headingData.analysis.issues.push('Invalid heading order detected');
          break;
        }
        lastIndex = currentIndex;
      }

      // Check for valid hierarchy
      if (headingData.analysis.hasValidHierarchy) {
        headingData.analysis.hasValidHierarchy = true; // Hierarchy is valid
      } else {
        headingData.analysis.hasValidHierarchy = false; // Set to false if issues were found
      }

      if (headingData.structure.h1.length === 0) {
        headingData.analysis.issues.push('Missing H1 heading');
      }
      if (headingData.structure.h2.length === 0) {
        headingData.analysis.issues.push('Missing H2 heading');
      }
      if (headingData.structure.h1.length > 1) {
        headingData.analysis.multipleH1 = true;
        headingData.analysis.issues.push('Multiple H1 headings detected');
      }

      return headingData;
    }

    function analyzeLinks() {
      console.log('Analyzing links');
      const links = Array.from(document.querySelectorAll('a'));
      const origin = window.location.origin;
      
      const internalLinks: InternalLink[] = [];
      const externalLinks: ExternalLink[] = [];
      const otherLinks: BaseLink[] = [];
      
      links.forEach(link => {
        console.log('Analyzing link:', link);
        const href = link.href;
        
        const baseLink: BaseLink = {
          href,
          text: link.textContent?.trim() || 'No Text',
          status: 'ok',
          attributes: {
            rel: link.rel ? link.rel.split(' ') : [],
            target: link.target || undefined,
            title: link.title || undefined
          }
        };

        // Check if the URL is a valid HTTP/HTTPS URL
        try {
          const url = new URL(href);
          
          if (!['http:', 'https:'].includes(url.protocol)) {
            // Handle non-HTTP/HTTPS protocols (tel:, mailto:, etc.)
            otherLinks.push({
              ...baseLink,
              protocol: url.protocol
            });
          } else if (url.origin === origin) {
            // Handle internal links
            internalLinks.push({
              ...baseLink,
              depth: (href.match(/\//g) || []).length - 3,
              inSitemap: false
            });
          } else {
            // Handle external links
            externalLinks.push({
              ...baseLink,
              domain: url.hostname,
              isSecure: url.protocol === 'https:'
            });
          }
        } catch (error) {
          // Handle invalid URLs
          otherLinks.push({
            ...baseLink,
            status: 'invalid_url'
          });
        }
      });

      return {
        internal: internalLinks,
        external: externalLinks,
        otherLinks,
        analysis: {
          totalCount: links.length,
          internalCount: internalLinks.length,
          externalCount: externalLinks.length,
          otherCount: otherLinks.length,
          brokenCount: 0
        },
        issues: []
      };
    }

    function analyzeImages() {
      console.log('Analyzing images');
      const images = Array.from(document.querySelectorAll('img'));
      const imageElements: ImageElement[] = [];
      let missingAlt = 0;
      let missingDimensions = 0;
      
      images.forEach(img => {
        const issues: string[] = [];
        if (!img.alt) {
          issues.push('Missing alt text');
          missingAlt++;
        }
        if (!img.width || !img.height) {
          issues.push('Missing dimensions');
          missingDimensions++;
        }

        const rect = img.getBoundingClientRect();
        
        imageElements.push({
          src: img.src,
          alt: img.alt,
          width: img.width || null,
          height: img.height || null,
          fileSize: null, // To be implemented with resource timing API
          format: img.src.split('.').pop()?.split('?')[0] || 'unknown',
          status: issues.length ? 'warning' : 'ok',
          lazyLoaded: img.loading === 'lazy',
          inViewport: rect.top < window.innerHeight && rect.bottom > 0,
          issues
        });
      });

      return {
        images: imageElements,
        analysis: {
          totalCount: images.length,
          missingAlt,
          missingDimensions,
          oversized: 0, // To be implemented with image size analysis
          issues: []
        }
      };
    }

    function analyzeSocialTags() {
      console.log('Analyzing social tags');
      const getMetaContent = (property: string) => 
        document.querySelector(`meta[property="${property}"], meta[name="${property}"]`)?.getAttribute('content') || '';

      const ogImage = getMetaContent('og:image');
      const twitterImage = getMetaContent('twitter:image');

      const social: SocialData = {
        openGraph: {
          title: getMetaContent('og:title'),
          description: getMetaContent('og:description'),
          image: {
            url: ogImage,
            width: parseInt(getMetaContent('og:image:width')) || null,
            height: parseInt(getMetaContent('og:image:height')) || null,
            alt: getMetaContent('og:image:alt'),
            type: getMetaContent('og:image:type')
          },
          url: getMetaContent('og:url'),
          type: getMetaContent('og:type'),
          locale: getMetaContent('og:locale'),
          site_name: getMetaContent('og:site_name')
        },
        twitter: {
          card: getMetaContent('twitter:card'),
          title: getMetaContent('twitter:title'),
          description: getMetaContent('twitter:description'),
          image: {
            url: twitterImage,
            width: null,
            height: null,
            alt: getMetaContent('twitter:image:alt'),
            type: ''
          },
          creator: getMetaContent('twitter:creator'),
          site: getMetaContent('twitter:site')
        },
        analysis: {
          hasRequiredTags: Boolean(getMetaContent('og:title') && getMetaContent('og:description')),
          imagesOptimized: Boolean(ogImage || twitterImage),
          issues: []
        }
      };

      return social;
    }

    function analyzeSchema() {
      console.log('Analyzing schema');
      const schemas = Array.from(document.querySelectorAll('script[type="application/ld+json"], [itemscope]'));
      const schemaElements: SchemaElement[] = [];
      
      schemas.forEach(schema => {
        if (schema.tagName === 'SCRIPT') {
          try {
            const content = JSON.parse(schema.textContent || '');
            schemaElements.push({
              type: content['@type'] || 'Unknown',
              content,
              isvalid: true,
              location: schema.closest('head') ? 'head' : 'body',
              format: 'json-ld',
              errors: []
            });
          } catch (e) {
            schemaElements.push({
              type: 'Invalid Schema',
              content: schema.textContent,
              isvalid: false,
              location: schema.closest('head') ? 'head' : 'body',
              format: 'json-ld',
              errors: []
            });
          }
        }
      });

      return {
        schemas: schemaElements,
        analysis: {
          totalCount: schemas.length,
          validCount: schemaElements.filter(s => s.isvalid).length,
          issues: []
        }
      };
    }

    // Add check for document access
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      throw new Error('Cannot access page content');
    }

    const analyzeViewport = () => {
      const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
      const issues: string[] = [];
      
      if (!viewport) {
        issues.push('No viewport meta tag found');
      } else {
        if (!viewport.includes('width=device-width')) {
          issues.push('Viewport should include width=device-width');
        }
        if (!viewport.includes('initial-scale=1')) {
          issues.push('Viewport should include initial-scale=1');
        }
      }

      return {
        content: viewport,
        isMobileOptimized: viewport.includes('width=device-width') && viewport.includes('initial-scale=1'),
        issues
      };
    };

    // Add logic to check robots.txt
    const checkRobotsTxt = async (url: string): Promise<{
      hasRobotsTxt: boolean;
      allowsCrawling: 'allowed' | 'restricted' | 'disallowed';
      content: string;
    }> => {
      const robotsUrl = new URL('/robots.txt', url).href;
      try {
        const response = await fetch(robotsUrl);
        if (response.ok) {
          const text = await response.text();
          const lines = text.split('\n').map(line => line.trim().toLowerCase());
          const disallowLines = lines.filter(line => line.startsWith('disallow:'));
          const allowLines = lines.filter(line => line.startsWith('allow:'));
          
          let crawlingStatus: 'allowed' | 'restricted' | 'disallowed' = 'allowed';
          if (disallowLines.includes('disallow: /')) {
            crawlingStatus = allowLines.length > 0 ? 'restricted' : 'disallowed';
          } else if (disallowLines.length > 0) {
            crawlingStatus = 'restricted';
          }

          return {
            hasRobotsTxt: true,
            allowsCrawling: crawlingStatus,
            content: text
          };
        }
      } catch (error) {
        console.error('Error fetching robots.txt:', error);
      }
      return {
        hasRobotsTxt: false,
        allowsCrawling: 'allowed',
        content: ''
      };
    };

    // Call the checkRobotsTxt function
    const robotsTxtData = await checkRobotsTxt(window.location.href);
    
    const overview: SEOOverview = {
      title: {
        content: document.title || '',
        length: document.title.length || 0,
        status: document.title.length < 10 ? 'error' : 
                document.title.length > 60 ? 'warning' : 'ok',
        issues: document.title.length < 10 ? ['Title too short (min 10 characters)'] : 
                document.title.length > 60 ? ['Title too long (max 60 characters)'] : []
      },
      description: {
        content: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        length: (document.querySelector('meta[name="description"]')?.getAttribute('content') || '').length,
        status: !document.querySelector('meta[name="description"]') ? 'error' : 
                (document.querySelector('meta[name="description"]')?.getAttribute('content') || '').length < 50 ? 'warning' : 
                (document.querySelector('meta[name="description"]')?.getAttribute('content') || '').length > 160 ? 'warning' : 'ok',
        issues: !document.querySelector('meta[name="description"]') ? ['Missing meta description'] :
                (document.querySelector('meta[name="description"]')?.getAttribute('content') || '').length < 50 ? ['Description too short (min 50 characters)'] :
                (document.querySelector('meta[name="description"]')?.getAttribute('content') || '').length > 160 ? ['Description too long (max 160 characters)'] : []
      },
      keywords: (document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '')
        .split(',')
        .map(k => k.trim())
        .filter(Boolean),
      url: {
        raw: window.location.href,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || window.location.href,
        isCanonicalValid: true // You might want to add more validation logic here
      },
      language: {
        declared: document.documentElement.lang,
        detected: document.documentElement.lang, // You might want to add language detection logic
        isValid: Boolean(document.documentElement.lang)
      },
      charset: document.characterSet,
      viewport: analyzeViewport(),
      robotsMeta: analyzeRobotsMeta(),
      robotsTxt: robotsTxtData,
      sitemapXml: {
        hasSitemap: true, // This should be determined by checking sitemap.xml
        locations: [] // This should be populated with actual sitemap locations
      }
    };

    return {
      overview,
      headings: analyzeHeadings(),
      links: analyzeLinks(),
      images: analyzeImages(),
      social: analyzeSocialTags(),
      schema: analyzeSchema(),
      timestamp: new Date().toISOString().split('T').map((s, i) => i === 1 ? s.split('.')[0] : s).join(', '),
      toolVersion: '1.0.0'
    };
  } catch (error) {
    console.error('Page Content Analysis failed:', error);
    throw error;
  }
}

// New function to check for broken links
export async function checkLinks(links: LinkData) {
  const linkChecks: { [key: string]: boolean } = {};
  const allLinks = [...links.internal, ...links.external, ...links.otherLinks];

  await Promise.all(allLinks.map(async (link) => {
    try {
      const url = new URL(link.href);
      if (['http:', 'https:'].includes(url.protocol)) {
        const response = await fetch(link.href, { method: 'HEAD' });
        if ([403, 404].includes(response.status)) {
          linkChecks[link.href] = true; // Mark as broken if response is 403 or 404
        } else if (response.status === 500) {
          linkChecks[link.href] = false; // Do not mark as broken, just log the error
        } else {
          linkChecks[link.href] = false; // Not broken
        }
      } else {
        linkChecks[link.href] = false; // Mark as not broken if not HTTP/HTTPS
      }
    } catch (error) {
      linkChecks[link.href] = false; // Mark as not broken if URL is invalid
    }
  }));

  return linkChecks;
}
