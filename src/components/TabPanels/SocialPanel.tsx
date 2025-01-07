import { AlertTriangle, CheckCircle, Facebook, Globe, Twitter, XCircle } from 'lucide-react';
import { SocialData } from '../../types/seo';

interface SocialPanelProps {
  data: SocialData;
}

export const isOGImageSizeValid = (image: SocialData['openGraph']['image']): boolean => {
  if (!image.width || !image.height) return false;
  return image.width >= 600 && image.height >= 315;
};

export const isTwitterImageSizeValid = (image: SocialData['twitter']['image']): boolean => {
  if (!image.width || !image.height) return false;
  return (image.width >= 240 && image.height >= 240) || 
         (image.width >= 1200 && image.height >= 628);
};

export function SocialPanel({ data }: SocialPanelProps) {
  return (
    <div className="p-4">
      {/* Analysis Summary */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Globe className="h-5 w-5 text-blue-500 mr-2" />
          Social Media Analysis
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            {data.analysis.hasRequiredTags ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <div>
              <p className="text-sm font-medium">Required Tags</p>
              <p className="text-xs text-gray-500">
                {data.analysis.hasRequiredTags ? 'All required tags present' : 'Missing required tags'}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {data.analysis.imagesOptimized ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <div>
              <p className="text-sm font-medium">Images Optimization</p>
              <p className="text-xs text-gray-500">
                {data.analysis.imagesOptimized ? 'Images properly optimized' : 'Images need optimization'}
              </p>
            </div>
          </div>
        </div>
        {data.analysis.issues.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center space-x-1">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-700">Issues:</span>
            </div>
            <ul className="mt-1 text-sm text-yellow-600 list-disc list-inside">
              {data.analysis.issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Open Graph */}
      <div className="mb-4 bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Facebook className="h-5 w-5 text-[#1877F2]" />
          <h3 className="text-lg font-medium">Facebook / Open Graph</h3>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Title</p>
              <p className="text-sm">{data.openGraph.title || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Site Name</p>
              <p className="text-sm">{data.openGraph.site_name || 'Not set'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-sm">{data.openGraph.description || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="text-sm">{data.openGraph.type || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Locale</p>
              <p className="text-sm">{data.openGraph.locale || 'Not set'}</p>
            </div>
          </div>
          {data.openGraph.image.url && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-500 mb-2">Image</p>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={data.openGraph.image.url}
                    alt={data.openGraph.image.alt || 'Open Graph image'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Dimensions:</span>{' '}
                    {data.openGraph.image.width && data.openGraph.image.height
                      ? `${data.openGraph.image.width}x${data.openGraph.image.height}`
                      : 'Not specified'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Alt Text:</span>{' '}
                    {data.openGraph.image.alt || 'Not set'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Type:</span>{' '}
                    {data.openGraph.image.type || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Twitter Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Twitter className="h-5 w-5 text-[#1DA1F2]" />
          <h3 className="text-lg font-medium">Twitter Card</h3>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Card Type</p>
              <p className="text-sm">{data.twitter.card || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Creator</p>
              <p className="text-sm">{data.twitter.creator || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Site</p>
              <p className="text-sm">{data.twitter.site || 'Not set'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Title</p>
              <p className="text-sm">{data.twitter.title || 'Not set'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-sm">{data.twitter.description || 'Not set'}</p>
            </div>
          </div>
          {data.twitter.image.url && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-500 mb-2">Image</p>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={data.twitter.image.url}
                    alt={data.twitter.image.alt || 'Twitter card image'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Dimensions:</span>{' '}
                    {data.twitter.image.width && data.twitter.image.height
                      ? `${data.twitter.image.width}x${data.twitter.image.height}`
                      : 'Not specified'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Alt Text:</span>{' '}
                    {data.twitter.image.alt || 'Not set'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Type:</span>{' '}
                    {data.twitter.image.type || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Size Recommendations */}
      <div className="mt-4 bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-3">Image Size Recommendations</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Facebook / Open Graph</p>
            <ul className="text-gray-500 mt-1">
              <li>• Recommended: 1200 x 630 pixels</li>
              <li>• Minimum: 600 x 315 pixels</li>
              <li className="text-xs mt-1">
                Status: {isOGImageSizeValid(data.openGraph.image) ? 
                  <span className="text-green-500">Optimal</span> : 
                  <span className="text-yellow-500">Needs review</span>}
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Twitter Card</p>
            <ul className="text-gray-500 mt-1">
              <li>• Large Card: 1200 x 628 pixels</li>
              <li>• Summary Card: 240 x 240 pixels</li>
              <li className="text-xs mt-1">
                Status: {isTwitterImageSizeValid(data.twitter.image) ? 
                  <span className="text-green-500">Optimal</span> : 
                  <span className="text-yellow-500">Needs review</span>}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}