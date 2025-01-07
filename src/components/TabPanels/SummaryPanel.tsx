import { AlertTriangle, Bot, CheckCircle, ExternalLink, MapPin } from 'lucide-react';
import { SEOOverview } from '../../types/seo';

interface SummaryPanelProps {
  data: SEOOverview;  
}

export function SummaryPanel({ data }: SummaryPanelProps) {
  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Basic Meta Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Basic Meta Information</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {data.title.status !== 'ok' ? (
                <AlertTriangle className={`h-5 w-5 ${data.title.status === 'warning' ? 'text-yellow-500' : 'text-red-500'}`} />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Title</h3>
              <p className="text-sm text-gray-500">{data.title.content}</p>
              {data.title.issues?.map((issue, index) => (
                <p key={index} className="text-sm text-yellow-600">
                  {issue}
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              {data.description.status !== 'ok' ? (
                <AlertTriangle className={`h-5 w-5 ${data.description.status === 'warning' ? 'text-yellow-500' : 'text-red-500'}`} />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Meta Description</h3>
              <p className="text-sm text-gray-500">{data.description.content}</p>
              {data.description.issues?.map((issue, index) => (
                <p key={index} className="text-sm text-yellow-600">
                  {issue}
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              {data.url.isCanonicalValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">URL</h3>
              <p className="text-sm text-gray-500">{data.url.raw}</p>
              {data.url.canonical && (
                <p className="text-sm text-gray-500">
                  <strong>Canonical:</strong> {data.url.canonical}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              {data.language.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Language</h3>
              <p className="text-sm text-gray-500">
                Declared: {data.language.declared}, Detected: {data.language.detected}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className={`h-5 w-5 ${data.keywords.length ? 'text-green-500' : 'text-yellow-500'}`} />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Keywords</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.keywords.map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Setup Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Technical Setup</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Character Set</h3>
              <p className="text-sm text-gray-500">{data.charset}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              {data.viewport.isMobileOptimized ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Mobile Optimization</h3>
              <p className="text-sm text-gray-500">{data.viewport.content}</p>
              {data.viewport.issues?.map((issue, index) => (
                <p key={index} className="text-sm text-yellow-600">{issue}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Crawlability Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Crawlability & Indexing</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Bot className={`h-5 w-5 ${data.robotsMeta.index && data.robotsMeta.follow ? 'text-green-500' : 'text-yellow-500'}`} />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Robots Meta</h3>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <span className={`text-sm ${data.robotsMeta.index ? 'text-green-600' : 'text-red-600'}`}>
                  Index: {data.robotsMeta.index ? 'Yes' : 'No'}
                </span>
                <span className={`text-sm ${data.robotsMeta.follow ? 'text-green-600' : 'text-red-600'}`}>
                  Follow: {data.robotsMeta.follow ? 'Yes' : 'No'}
                </span>
                <span className={`text-sm ${data.robotsMeta.imageIndex ? 'text-green-600' : 'text-red-600'}`}>
                  Image Index: {data.robotsMeta.imageIndex ? 'Yes' : 'No'}
                </span>
                <span className={`text-sm ${data.robotsMeta.snippet ? 'text-green-600' : 'text-red-600'}`}>
                  Snippet: {data.robotsMeta.snippet ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => openInNewTab(`${new URL(data.url.raw).origin}/robots.txt`)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Bot className="h-4 w-4 mr-2" />
              View robots.txt
              <ExternalLink className="h-4 w-4 ml-2" />
            </button>
            
            <button
              onClick={() => openInNewTab(`${new URL(data.url.raw).origin}/sitemap.xml`)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <MapPin className="h-4 w-4 mr-2" />
              View Sitemap
              <ExternalLink className="h-4 w-4 ml-2" />
            </button>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              {data.robotsTxt.hasRobotsTxt && data.robotsTxt.allowsCrawling ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Robots.txt Status</h3>
              <p className="text-sm text-gray-500">
                {data.robotsTxt.hasRobotsTxt ? 'File exists' : 'File not found'} - 
                Crawling {data.robotsTxt.allowsCrawling === 'allowed' ? 'allowed' : 
                         data.robotsTxt.allowsCrawling === 'restricted' ? 'partially allowed' : 'disallowed'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}