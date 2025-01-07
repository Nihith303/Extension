import { AlertTriangle, CheckCircle, Heading, XCircle } from 'lucide-react';
import { HeadingData, HeadingElement } from '../../types/seo';

interface HeadingPanelProps {
  data: HeadingData;
}

const HeadingRow = ({ heading, level }: { heading: HeadingElement; level: number }) => {
  return (
    <div className={`ml-8 py-2 hover:bg-gray-50`}>
      <div className="flex items-start">
        <span className="text-gray-500 font-mono text-sm mr-2">{`<H${level}>`}</span>
        <div className="flex-1">
          <p className="text-gray-800">
            {heading.content}
            {heading.containsKeywords && (
              <span className="ml-2 text-xs text-green-600 font-normal">
                (contains keywords)
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Position: {heading.position} • Words: {heading.wordCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export function HeadingPanel({ data }: HeadingPanelProps) {
  const allHeadings = [
    ...data.structure.h1.map(h => ({ ...h, level: 1 })),
    ...data.structure.h2.map(h => ({ ...h, level: 2 })),
    ...data.structure.h3.map(h => ({ ...h, level: 3 })),
    ...data.structure.h4.map(h => ({ ...h, level: 4 })),
    ...data.structure.h5.map(h => ({ ...h, level: 5 })),
    ...data.structure.h6.map(h => ({ ...h, level: 6 })),
  ].sort((a, b) => a.position - b.position);

  return (
    <div className="p-4">
      {/* Analysis Summary */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Heading className="h-5 w-5 text-blue-500 mr-2" />
          Heading Structure Analysis
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            {data.analysis.hasValidHierarchy ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <div>
              <p className="text-sm font-medium">Heading Hierarchy</p>
              <p className="text-xs text-gray-500">
                {data.analysis.hasValidHierarchy ? 'Valid structure' : 'Invalid structure'}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {!data.analysis.multipleH1 ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <div>
              <p className="text-sm font-medium">H1 Usage</p>
              <p className="text-xs text-gray-500">
                {!data.analysis.multipleH1 ? 'Single H1 tag' : 'Multiple H1 tags found'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-bold text-black">Header Tags Count</h3>
          <div className="flex justify-between text-xl text-black w-full">
            <span>H1: {data.structure.h1.length}</span>
            <span>H2: {data.structure.h2.length}</span>
            <span>H3: {data.structure.h3.length}</span>
            <span>H4: {data.structure.h4.length}</span>
            <span>H5: {data.structure.h5.length}</span>
            <span>H6: {data.structure.h6.length}</span>
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

      {/* Heading Structure */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Heading Structure</h3>
          <p className="text-sm text-gray-500">
            Headings in order of appearance on the page
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {allHeadings.map((heading, index) => (
            <HeadingRow 
              key={index} 
              heading={heading} 
              level={heading.level} 
            />
          ))}
        </div>
      </div>
    </div>
  );
} 