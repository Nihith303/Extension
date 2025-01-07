export interface SEOOverview {
  // Basic Meta Information
  title: {
    content: string;
    length: number;
    status: 'ok' | 'warning' | 'error';
    issues?: string[];
  };
  description: {
    content: string;
    length: number;
    status: 'ok' | 'warning' | 'error';
    issues?: string[];
  };
  keywords: string[];
  url: {
    raw: string;
    canonical: string;
    isCanonicalValid: boolean;
  };
  
  // Technical Setup
  language: {
    declared: string;
    detected: string;
    isValid: boolean;
  };
  charset: string;
  
  // Mobile & Responsiveness
  viewport: {
    content: string;
    isMobileOptimized: boolean;
    issues?: string[];
  };
  
  // Crawlability & Indexing
  robotsMeta: {
    index: boolean;
    follow: boolean;
    imageIndex: boolean;
    archive: boolean;
    snippet: boolean;
    rawContent: string;
  };
  robotsTxt: {
    hasRobotsTxt: boolean;
    allowsCrawling: 'allowed' | 'restricted' | 'disallowed';
    content?: string;
  };
  sitemapXml: {
    hasSitemap: boolean;
    locations: string[];
  };
}

export interface HeadingData {
  structure: {
    h1: HeadingElement[];
    h2: HeadingElement[];
    h3: HeadingElement[];
    h4: HeadingElement[];
    h5: HeadingElement[];
    h6: HeadingElement[];
  };
  analysis: {
    hasValidHierarchy: boolean;
    multipleH1: boolean;
    issues: string[];
  };
}

export interface HeadingElement {
  content: string;
  position: number;
  wordCount: number;
  containsKeywords: boolean;
}

export interface LinkData {
  internal: InternalLink[];
  external: ExternalLink[];
  otherLinks: BaseLink[];
  issues: string[];
  analysis: {
    totalCount: number;
    internalCount: number;
    externalCount: number;
    otherCount: number;
    brokenCount: number;
  };
}

export interface BaseLink {
  href: string;
  text: string;
  status: 'ok' | 'invalid_url' | 'broken';
  attributes: {
    rel: string[];
    target?: string;
    title?: string;
  };
  protocol?: string;
  issues?: string[];
}

export interface InternalLink extends BaseLink {
  depth: number;
  inSitemap: boolean;
}

export interface ExternalLink extends BaseLink {
  domain: string;
  isSecure: boolean;
}

export interface ImageData {
  images: ImageElement[];
  analysis: {
    totalCount: number;
    missingAlt: number;
    missingDimensions: number;
    oversized: number;
    issues: string[];
  };
}

export interface ImageElement {
  src: string;
  alt: string;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  format: string;
  status: 'ok' | 'warning' | 'error';
  lazyLoaded: boolean;
  inViewport: boolean;
  issues: string[];
}

export interface SocialData {
  openGraph: {
    title: string;
    description: string;
    image: SocialImage;
    url: string;
    type: string;
    locale: string;
    site_name: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: SocialImage;
    creator: string;
    site: string;
  };
  analysis: {
    hasRequiredTags: boolean;
    imagesOptimized: boolean;
    issues: string[];
  };
}

export interface SocialImage {
  url: string;
  width: number | null;
  height: number | null;
  alt: string;
  type: string;
}

export interface SchemaData {
  schemas: SchemaElement[];
  analysis: {
    totalCount: number;
    validCount: number;
    issues: string[];
  };
}

export interface SchemaElement {
  type: string;
  content: any;
  isvalid: boolean;
  location: 'head' | 'body';
  format: 'json-ld' | 'microdata';
  errors: string[];
}


export interface GraphNode {
  id: number;
  name: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: GraphNode;
  target: GraphNode;
  linkName: string;
}

export interface ResourceMetrics {
  requests: number;
  size: number;
  compressed: boolean;
}

export interface SEOAnalysis {
  overview: SEOOverview;
  headings: HeadingData;
  links: LinkData;
  images: ImageData;
  social: SocialData;
  schema: SchemaData;
  timestamp: string;
  toolVersion: string;
}