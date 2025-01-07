import {
  Code2,
  Download,
  Heading,
  Image,
  LayoutDashboard,
  Link2,
  Share2
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { HeadingPanel } from './components/TabPanels/HeadingPanel';
import { ImagesPanel } from './components/TabPanels/ImagesPanel';
import { LinksPanel } from './components/TabPanels/LinksPanel';
import { SchemaPanel } from './components/TabPanels/SchemaPanel';
import { SocialPanel } from './components/TabPanels/SocialPanel';
import { SummaryPanel } from './components/TabPanels/SummaryPanel';
import { Tabs } from './components/Tabs';
import { SEOAnalysis } from './types/seo';
import { exportSEOReportToPDF } from './utils/pdfExport';
import { analyzePage } from './utils/seoAnalyzer';
import { buildGraphData } from './utils/buildGraph';
import { renderGraph } from './utils/renderGraph';

const tabs = [
  { id: 'summary', label: 'Summary', icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: 'headings', label: 'Headings', icon: <Heading className="h-4 w-4" /> },
  { id: 'links', label: 'Links', icon: <Link2 className="h-4 w-4" /> },
  { id: 'images', label: 'Images', icon: <Image className="h-4 w-4" /> },
  { id: 'social', label: 'Social', icon: <Share2 className="h-4 w-4" /> },
  { id: 'schema', label: 'Schema', icon: <Code2 className="h-4 w-4" /> },
];

function App() {
  const [activeTab, setActiveTab] = useState('summary');
  const [data, setData] = useState<SEOAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const graphRef = useRef(null);
  const simulationRef = useRef<any>(null);

  useEffect(() => {
    const analyzeCurrentPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current tab
        const [tab] = await chrome.tabs.query({ 
          active: true, 
          currentWindow: true 
        });
  
        if (!tab?.url?.startsWith('http')) {
          throw new Error('This extension only works on web pages.');
        }
  
        const results = await analyzePage();
        setData(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to analyze page');
        console.error('Analysis failed:', err);
      } finally {
        setLoading(false);
      }
    };
  
    analyzeCurrentPage();
  }, []);

  useEffect(() => {
    if (data?.schema.schemas && data?.schema.schemas.length > 0) {
      const graphData = buildGraphData(data?.schema.schemas);
      renderGraph(
        graphRef,
        graphData,
        100,
        12,
        10,
        false,
        simulationRef,
        40,
        40
      );
    }
  }, [data?.schema.schemas]);

  const handleExport = async () => {
    if (!data) return;
    
    try {
      exportSEOReportToPDF(data, graphRef);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="w-[800px] h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[800px] h-[600px] flex items-center justify-center">
        <div className="text-red-600">
          <h2 className="font-bold mb-2">Error:</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[800px] h-[600px] bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-xl font-bold text-gray-900">Digispot AI - SEO Insights</h1>
        <div ref={graphRef} className="opacity-0"></div>
        <button
          onClick={handleExport}
          disabled={!data}
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="overflow-y-auto panel-height">
        {activeTab === 'summary' && data && <SummaryPanel data={data.overview} />}
        {activeTab === 'headings' && data && <HeadingPanel data={data.headings} />}
        {activeTab === 'links' && data && <LinksPanel links={data.links} />}
        {activeTab === 'images' && data && <ImagesPanel images={data.images} />}
        {activeTab === 'social' && data && <SocialPanel data={data.social} />}
        {activeTab === 'schema' && data && <SchemaPanel schemas={data.schema} />}
      </div>
    </div>
  );
}

export default App;