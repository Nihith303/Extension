import * as d3 from "d3";
import React, { useEffect, useState, useRef } from "react";
import { fetchSchemas } from "../utils/fetchSchema";
import { renderGraph } from "../utils/renderGraph";
import { downloadGraphAsPng } from "../utils/downloadGraphAsPng";
import { buildGraphData } from "../utils/buildGraph";
import "./Schema.css";

const Schema = () => {
  const [schemas, setSchemas] = useState([]);
  const [linkDistance, setLinkDistance] = useState(70);
  const [fontSize, setFontSize] = useState(12);
  const [nodeSize, setNodeSize] = useState(8);
  const [isDragEnabled, setIsDragEnabled] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGraphView, setIsGraphView] = useState(true); // State to toggle views
  const graphRef = useRef(null);
  const simulationRef = useRef(null);

  // Fetch schema data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSchemas();
        setSchemas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Render graph when schemas change
  useEffect(() => {
    if (schemas.length > 0) {
      try {
        const graphData = buildGraphData(schemas);
        renderGraph(
          graphRef,
          graphData,
          linkDistance,
          fontSize,
          nodeSize,
          isDragEnabled,
          simulationRef,
          1000,
          1000
        );
      } catch (err) {
        setError(`Failed to render graph: ${err.message}`);
      }
    }
  }, [schemas, isGraphView]);

  // Update link distance
  useEffect(() => {
    if (simulationRef.current) {
      const linkForce = simulationRef.current.force("link");
      if (linkForce) {
        linkForce.distance(linkDistance);
        simulationRef.current.alpha(1).restart();
      }
    }
  }, [linkDistance]);

  // Update font size
  useEffect(() => {
    d3.select(graphRef.current)
      .selectAll("text")
      .style("font-size", `${fontSize}px`);
  }, [fontSize]);

  // Update node size
  useEffect(() => {
    d3.select(graphRef.current).selectAll("circle").attr("r", nodeSize);
  }, [nodeSize]);

  // Update drag functionality
  useEffect(() => {
    if (simulationRef.current && graphRef.current) {
      const nodes = d3.select(graphRef.current).selectAll("circle");
      if (isDragEnabled) {
        nodes.call(drag(simulationRef.current));
      } else {
        nodes.on(".drag", null);
      }
    }
  }, [isDragEnabled]);

  const drag = (simulation) => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  const SchemaItem = ({ data, title }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const renderValue = (key, value) => {
      if (typeof value === "object" && value !== null) {
        return <SchemaItem data={value} title={value["@type"] || key} />;
      }
      return (
        <div className="schema-value">
          <strong>{key}:</strong> {value}
        </div>
      );
    };

    return (
      <div className="schema-item">
        <div className="schema-header" onClick={toggleOpen}>
          <span>{title}</span>
          <button>{isOpen ? "▲" : "▼"}</button>
        </div>
        {isOpen && (
          <div className="schema-content">
            {Object.entries(data).map(([key, value], index) => (
              <div key={index} className="schema-entry">
                {renderValue(key, value)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsGraphView((prev) => !prev)}
        className="toggle-view-btn"
      >
        {isGraphView ? "Switch to List View" : "Switch to Graph View"}
      </button>
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      {isLoading && <i className="loader --1"></i>}
      {!isLoading && !error && schemas.length > 0 && (
        <div>
          {isGraphView ? (
            <div>
              <div className="container">
                <div className="container-but">
                  <button
                    onClick={() => setIsDragEnabled((prev) => !prev)}
                    id="pause-play"
                  >
                    {isDragEnabled ? (
                      <img src="image/pause.svg" alt="Pause button" />
                    ) : (
                      <img src="image/play.svg" alt="Play button" />
                    )}
                  </button>
                  <button
                    onClick={() => downloadGraphAsPng(graphRef)}
                    id="download-btn"
                  >
                    <img src="image/download.svg" alt="Download Graph" />
                  </button>
                </div>

                <div className="controls">
                  <div className="control-item">
                    <label>Font Size</label>
                    <input
                      type="range"
                      min="8"
                      max="30"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                    />
                    <span>{fontSize}</span>
                  </div>
                  <div className="control-item">
                    <label>Node Size</label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={nodeSize}
                      onChange={(e) => setNodeSize(Number(e.target.value))}
                    />
                    <span>{nodeSize}</span>
                  </div>
                  <div className="control-item">
                    <label>Link Distance</label>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={linkDistance}
                      onChange={(e) => setLinkDistance(Number(e.target.value))}
                    />
                    <span>{linkDistance}</span>
                  </div>
                </div>
              </div>
              <div ref={graphRef} className="graph-container"></div>
            </div>
          ) : (
            <div>
              <h2 id="markup">Schema Markup</h2>
              <p className="schema-description">
                <strong>
                  Schema Markup is a semantic vocabulary of tags that helps
                  search engines understand your webpage and better represent it
                  in the search results.
                </strong>
              </p>
              <div className="schema-scrolling">
                <div className="schema-container">
                  {schemas.map((schema, index) => (
                    <SchemaItem
                      key={index}
                      data={schema}
                      title={schema["@type"] || `Schema ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {!isLoading && !error && schemas.length === 0 && (
        <div className="no-items">
          <p>
            No Schema Found on this Website.{" "}
            <img src="image/notfound.svg" alt="Not Found" />
          </p>
        </div>
      )}
    </>
  );
};

export default Schema;
