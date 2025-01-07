import { AlertTriangle, Image, Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ImageData } from '../../types/seo';

interface ImagesPanelProps {
  images: ImageData;
}

export function ImagesPanel({ images }: ImagesPanelProps) {
  const [activeTab, setActiveTab] = useState('All Images');

  const sortedImages = useMemo(() => {
    return [...images.images].sort((a, b) => {
      // Sort by issues count first
      if (b.issues.length !== a.issues.length) {
        return b.issues.length - a.issues.length;
      }
      // Then by status (error > warning > ok)
      const statusPriority = { error: 2, warning: 1, ok: 0 };
      return statusPriority[b.status] - statusPriority[a.status];
    });
  }, [images.images]);

  const issuesSummary = useMemo(() => {
    const summary = {
      missingAlt: 0,
      missingSrc: 0,
      missingDimensions: 0,
    };

    images.images.forEach(img => {
      if (!img.src) summary.missingSrc++;
      img.issues.forEach(issue => {
        if (issue.includes('Missing alt text')) summary.missingAlt++;
        else if (issue.includes('Missing dimensions')) summary.missingDimensions++;
      });
    });

    return summary;
  }, [images.images]);

  const filteredImages = useMemo(() => {
    switch (activeTab) {
      case 'Missing ALT':
        return sortedImages.filter(image => image.issues.includes('Missing alt text'));
      case 'Missing SRC':
        return sortedImages.filter(image => !image.src);
      case 'Missing Dimensions':
        return sortedImages.filter(image => image.issues.includes('Missing dimensions'));
      default:
        return sortedImages;
    }
  }, [activeTab, sortedImages]);

  return (
    <div className="p-4 space-y-1">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Images"
          value={images.analysis.totalCount}
          icon={<Image className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Missing ALT"
          value={issuesSummary.missingAlt}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="red"
        />
        <StatCard
          title="Missing SRC"
          value={issuesSummary.missingSrc}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="yellow"
        />
        <StatCard
          title="Missing Dimensions"
          value={issuesSummary.missingDimensions}
          icon={<Info className="h-5 w-5" />}
          color="orange"
        />
      </div>

      {/* Issues Summary */}
      {(issuesSummary.missingAlt > 0 || issuesSummary.missingDimensions > 0) && (
        <div className="bg-white rounded-lg shadow p-4 mt-0">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Critical Issues & Warnings</h2>
          <div className="space-y-4">
            {images.analysis.missingAlt > 0 && (
              <IssueAlert
                type="error"
                title="Missing Alt Text"
                description={`${images.analysis.missingAlt} images are missing alt text. This affects accessibility and SEO.`}
              />
            )}
            {images.analysis.missingDimensions > 0 && (
              <IssueAlert
                type="warning"
                title="Missing Dimensions"
                description={`${images.analysis.missingDimensions} images don't have explicit dimensions. This can cause layout shifts.`}
              />
            )}
            {images.analysis.oversized > 0 && (
              <IssueAlert
                type="warning"
                title="Oversized Images"
                description={`${images.analysis.oversized} images are larger than necessary. Consider optimizing them.`}
              />
            )}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow mt-0">
        <div className="border-b border-gray-200">
          <nav className="flex" aria-label="Tabs">
            {['All Images', 'Missing ALT', 'Missing SRC', 'Missing Dimensions'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 
                  ${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Images Table */}
        <div className="overflow-x-hidden">
          <table className="w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Image
                </th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                  Details
                </th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Status
                </th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Issues
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredImages.map((image, index) => (
                <tr key={index} className={image.issues.length > 0 ? 'bg-red-50' : ''}>
                  <td className="px-1 py-1 whitespace-normal">
                    <div className="flex items-center justify-center">
                      <div className="flex-shrink-0 h-20 w-20 bg-gray-100 rounded relative">
                        <img
                          src={image.src}
                          alt={image.alt || 'Preview not available'}
                          className="h-20 w-20 object-cover rounded transition-transform duration-200 transform hover:scale-150 hover:z-10 hover:absolute"
                          onError={(e) => {
                            e.currentTarget.src = 'placeholder.png';
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-1 py-1 whitespace-normal">
                    <div className="text-sm text-gray-900 font-medium truncate max-w-xs">
                      {image.src.split('/').pop()}
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Alt: {image.alt || 'Missing!'}</p>
                      <p>Size: {image.width && image.height ? `${image.width}x${image.height}` : 'Not specified'}</p>
                      <p>Format: {['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(image.format.toLowerCase()) ? image.format : 'Unknown'}</p>
                    </div>
                  </td>
                  <td className="px-1 py-1 whitespace-normal">
                    <StatusBadge status={image.status} />
                  </td>
                  <td className="px-1 py-1 whitespace-normal">
                    {image.issues.length > 0 ? (
                      <ul className="text-sm text-gray-500 list-disc list-inside">
                        {image.issues.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-green-500 text-sm">No issues</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    orange: 'bg-orange-50 text-orange-700',
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div className={`rounded-full p-2 ${colorClasses[color as keyof typeof colorClasses]}`}>{icon}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
      <div className="mt-2 text-sm text-gray-500">{title}</div>
    </div>
  );
}

function IssueAlert({ type, title, description }: { type: 'error' | 'warning'; title: string; description: string }) {
  const styles = {
    error: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  return (
    <div className={`${styles[type]} p-4 rounded-lg border`}>
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="mt-1 text-sm">{description}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: 'ok' | 'warning' | 'error' }) {
  const styles = {
    ok: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`${styles[status]} px-2 py-1 text-xs font-medium rounded-full`}>
      {status.toUpperCase()}
    </span>
  );
}