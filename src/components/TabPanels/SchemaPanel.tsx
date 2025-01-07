// This is the ListView of the Schema.
import { AlertTriangle, ChevronUp, ChevronDown, Play, Pause } from 'lucide-react';
import { SchemaData } from '../../types/seo';
import { useState, useEffect, useRef } from 'react';
import { buildGraphData } from '../../utils/buildGraph';
import { renderGraph } from '../../utils/renderGraph';

interface SchemaPanelProps {
  schemas: SchemaData;
}

interface SchemaItemProps {
  data: Record<string, any>;
  title: string;
}

const SchemaItem = ({ data, title }: SchemaItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const renderValue = (key: string, value: unknown) => {
    if (typeof value === "object" && value !== null) {
      const schemaObj = value as { '@type'?: string };
      return <SchemaItem data={value as Record<string, any>} title={schemaObj['@type'] || key} />;
    }
    return (
      <div className="flex gap-2 line-height-1.5">
        <strong>{key}:</strong> {String(value)}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden p-2">
      <div className="flex justify-between items-center p-2 cursor-pointer" onClick={toggleOpen}>
        <span className="flex-grow text-left text-gray-900 font-bold">{title}</span>
        <button className="bg-transparent border-none text-gray-900 text-lg cursor-pointer">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
      {isOpen && (
        <div className="bg-gray-100 text-gray-800 p-2 border border-gray-300 rounded-lg">
          {Object.entries(data).map(([key, value], index) => (
            <div key={index} className="mb-1">
              {renderValue(key, value)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export function SchemaPanel({ schemas }: SchemaPanelProps) {
  const [isGraphView, setIsGraphView] = useState(false);
  const [fontSize, setFontSize] = useState(12);
  const [nodeSize, setNodeSize] = useState(8);
  const [linkDistance, setLinkDistance] = useState(70);
  const [isDraggable, setIsDraggable] = useState(true);
  const graphRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<any>(null);

  const handleToggleView = () => {
    setIsGraphView(!isGraphView);
    if (simulationRef.current) {
      simulationRef.current.stop();
    }
  };

  useEffect(() => {
    if (isGraphView && graphRef.current) {
      const { nodes, links } = buildGraphData(schemas.schemas);
      const width = graphRef.current.clientWidth;
      const height = graphRef.current.clientHeight;
      renderGraph(graphRef, { nodes, links }, linkDistance, fontSize, nodeSize, isDraggable, simulationRef, width, height);
    } else if (graphRef.current) {
      graphRef.current.innerHTML = '';
    }
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [isGraphView, schemas.schemas]);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(e.target.value);
    setFontSize(newSize);
    if (simulationRef.current?.updateFontSize) {
      simulationRef.current.updateFontSize(newSize);
    }
  };

  const handleNodeSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(e.target.value);
    setNodeSize(newSize);
    if (simulationRef.current?.updateNodeSize) {
      simulationRef.current.updateNodeSize(newSize);
    }
  };

  const handleLinkDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDistance = Number(e.target.value);
    setLinkDistance(newDistance);
    if (simulationRef.current?.updateLinkDistance) {
      simulationRef.current.updateLinkDistance(newDistance);
    }
  };

  const handleDraggableToggle = () => {
    const newDraggable = !isDraggable;
    setIsDraggable(newDraggable);
    if (simulationRef.current?.toggleDrag) {
      simulationRef.current.toggleDrag(newDraggable);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-sm">List View</span>
        <div
          className={`view-switch ${isGraphView ? 'active' : ''}`}
          onClick={handleToggleView}
          role="switch"
          aria-checked="false"
          aria-label="Toggle view mode"
          data-checked={isGraphView}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggleView();
            }
          }}
        >
          <div className="view-switch-handle" />
        </div>
        <span className="text-sm">Graph View</span>
      </div>

      {isGraphView && (
        <div className="relative">
          <div ref={graphRef} className="w-full h-[calc(100vh-120px)] relative" />
          <div className="absolute top-1 left-2 p-2 rounded-lg z-10 w-72">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm">Font Size:</label>
                <input
                  type="range"
                  min="8"
                  max="20"
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  className="flex-1"
                  aria-label="Adjust font size"
                />
                <span className="w-8 text-sm">{fontSize}</span>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm">Node Size:</label>
                <input
                  type="range"
                  min="4"
                  max="30"
                  value={nodeSize}
                  onChange={handleNodeSizeChange}
                  className="flex-1"
                  aria-label="Adjust node size"
                />
                <span className="w-8 text-sm">{nodeSize}</span>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm">Link Distance:</label>
                <input
                  type="range"
                  min="30"
                  max="200"
                  value={linkDistance}
                  onChange={handleLinkDistanceChange}
                  className="flex-1"
                  aria-label="Adjust link distance"
                />
                <span className="w-8 text-sm">{linkDistance}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleDraggableToggle}
            className="absolute top-2 right-2 p-2 rounded-lg shadow-md z-10"
            aria-label={isDraggable ? 'Pause dragging' : 'Enable dragging'}
          >
            {isDraggable ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      )}

      {!isGraphView && (
        <div className="space-y-4">
          {/* Analysis Summary */}
          <div className="mb-4 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Schema Markup Analysis</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Schemas: {schemas.analysis.totalCount}</p>
                <p className="text-gray-500">Valid Schemas: {schemas.analysis.validCount}</p>
              </div>
              <div>
                <p className="text-gray-500">Invalid Schemas: {schemas.analysis.totalCount - schemas.analysis.validCount}</p>
              </div>
            </div>
            {schemas.analysis.issues.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-700">General Issues:</span>
                </div>
                <ul className="mt-1 text-sm text-yellow-600 list-disc list-inside">
                  {schemas.analysis.issues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {schemas.schemas.map((schema, index) => (
            <SchemaItem key={index} data={schema.content} title={schema.type} />
          ))}
        </div>
      )}
    </div>
  );
}