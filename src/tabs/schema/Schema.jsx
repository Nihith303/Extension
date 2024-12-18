import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import "./Schema.css";

const SchemaViewer = () => {
  const [schemas, setSchemas] = useState([]);
  const [linkDistance, setLinkDistance] = useState(70);
  const [fontSize, setFontSize] = useState(12);
  const [nodeSize, setNodeSize] = useState(8);
  const [isDragEnabled, setIsDragEnabled] = useState(true);
  const graphRef = useRef(null);
  const simulationRef = useRef(null); // Reference to the simulation

  // Drag functionality
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

  useEffect(() => {
    const fetchSchemas = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tabId = tab.id;

      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: () => {
            const schemaScripts = Array.from(
              document.querySelectorAll('script[type="application/ld+json"]')
            );
            return schemaScripts
              .map((script) => {
                try {
                  return JSON.parse(script.innerText);
                } catch {
                  return null;
                }
              })
              .filter(Boolean);
          },
        },
        ([result]) => {
          setSchemas(result.result || []);
        }
      );
    };

    fetchSchemas();
  }, []);

  useEffect(() => {
    if (schemas.length > 0) {
      const graphData = buildGraphData(schemas);
      renderGraph(graphData);
    }
  }, [schemas]);

  useEffect(() => {
    updateLinkDistance();
  }, [linkDistance]);

  useEffect(() => {
    updateFontSize();
  }, [fontSize]);

  useEffect(() => {
    updateNodeSize();
  }, [nodeSize]);

  useEffect(() => {
    if (simulationRef.current && graphRef.current) {
      const nodes = d3.select(graphRef.current).selectAll("circle");
      if (isDragEnabled) {
        nodes.call(drag(simulationRef.current));
      } else {
        nodes.on(".drag", null); // Disable drag
      }
    }
  }, [isDragEnabled]);

  const buildGraphData = (schemas) => {
    const nodes = [];
    const links = [];
    const rootNode = { id: 0, name: "Schema" };
    nodes.push(rootNode);

    let nodeId = 1;

    const traverse = (data, parentId = 0, linkName = "") => {
      if (typeof data === "object" && data !== null) {
        const currentId = nodeId++;
        nodes.push({
          id: currentId,
          name: data["@type"] || "Object",
        });

        links.push({
          source: parentId,
          target: currentId,
          linkName: linkName,
        });

        Object.entries(data).forEach(([key, value]) => {
          if (key !== "@type") {
            traverse(value, currentId, key);
          }
        });
      }
    };

    schemas.forEach((schema) => traverse(schema));
    return { nodes, links };
  };

  const renderGraph = ({ nodes, links }) => {
    const width = 1000;
    const height = 1000;

    d3.select(graphRef.current).selectAll("*").remove();
    const svg = d3
      .select(graphRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(
        d3
          .zoom()
          .scaleExtent([0.01, 5])
          .on("zoom", (event) => {
            graphGroup.attr("transform", event.transform);
          })
      );

    const graphGroup = svg.append("g");

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#aaa");

    simulationRef.current = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(linkDistance)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = graphGroup
      .append("g")
      .attr("stroke", "#aaa")
      .attr("stroke-width", 2)
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("marker-end", "url(#arrow)");

    const linkLabel = graphGroup
      .append("g")
      .selectAll("text")
      .data(links)
      .enter()
      .append("text")
      .attr("font-size", `${fontSize * 0.8}px`)
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .text((d) => d.linkName);

    const node = graphGroup
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", nodeSize)
      .attr("fill", (d) => d3.schemeCategory10[d.id % 10])
      .call(isDragEnabled ? drag(simulationRef.current) : () => {});

    const label = graphGroup
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("dy", -10)
      .attr("text-anchor", "middle")
      .text((d) => d.name)
      .style("font-size", `${fontSize}px`)
      .style("font-weight", "bold");

    simulationRef.current.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      linkLabel
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      label.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });
  };

  const updateLinkDistance = () => {
    if (simulationRef.current) {
      const linkForce = simulationRef.current.force("link");
      if (linkForce) {
        linkForce.distance(linkDistance);
        simulationRef.current.alpha(1).restart();
      }
    }
  };

  const updateFontSize = () => {
    d3.select(graphRef.current)
      .selectAll("text")
      .style("font-size", `${fontSize}px`);
  };

  const updateNodeSize = () => {
    d3.select(graphRef.current).selectAll("circle").attr("r", nodeSize);
  };

  const downloadGraphAsPng = () => {
    const svgElement = graphRef.current.querySelector("svg");
    const clonedSvg = svgElement.cloneNode(true);
    const bbox = svgElement.getBBox();
    const padding = 0;
    const width = bbox.width + padding * 2;
    const height = bbox.height + padding * 2;
    clonedSvg.setAttribute(
      "viewBox",
      `${bbox.x - padding} ${bbox.y - padding} ${width} ${height}`
    );
    clonedSvg.setAttribute("width", width);
    clonedSvg.setAttribute("height", height);
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", bbox.x - padding);
    rect.setAttribute("y", bbox.y - padding);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", "white");
    clonedSvg.insertBefore(rect, clonedSvg.firstChild);
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleFactor = 4;
      canvas.width = width * scaleFactor;
      canvas.height = height * scaleFactor;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        padding * scaleFactor,
        padding * scaleFactor,
        width * scaleFactor,
        height * scaleFactor
      );
      const link = document.createElement("a");
      link.download = "schema-graph.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div>
      <div className="container">
        <h2>Schema Visualizer</h2>
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
        <button onClick={downloadGraphAsPng} id="download-btn">
          <img src="image/download.svg" alt="Download Graph" />
        </button>

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
      {schemas.length > 0 ? (
        <div ref={graphRef} className="graph-container"></div>
      ) : (
        <div className="no-items">
          <p>No Schema Found on this Website.</p>
        </div>
      )}
    </div>
  );
};

export default SchemaViewer;

// Using D3 With Scrollers with Single Root Nodec without tooltip.
// import React, { useEffect, useState, useRef } from "react";
// import * as d3 from "d3";
// import "./Schema.css";

// const SchemaViewer = () => {
//   const [schemas, setSchemas] = useState([]);
//   const [linkDistance, setLinkDistance] = useState(70);
//   const [fontSize, setFontSize] = useState(12);
//   const [nodeSize, setNodeSize] = useState(8);
//   const [isDragEnabled, setIsDragEnabled] = useState(true);
//   const graphRef = useRef(null);

//   useEffect(() => {
//     const fetchSchemas = async () => {
//       const [tab] = await chrome.tabs.query({
//         active: true,
//         currentWindow: true,
//       });
//       const tabId = tab.id;

//       chrome.scripting.executeScript(
//         {
//           target: { tabId },
//           func: () => {
//             const schemaScripts = Array.from(
//               document.querySelectorAll('script[type="application/ld+json"]')
//             );
//             return schemaScripts
//               .map((script) => {
//                 try {
//                   return JSON.parse(script.innerText);
//                 } catch {
//                   return null;
//                 }
//               })
//               .filter(Boolean);
//           },
//         },
//         ([result]) => {
//           setSchemas(result.result || []);
//         }
//       );
//     };

//     fetchSchemas();
//   }, []);

//   useEffect(() => {
//     if (schemas.length > 0) {
//       const graphData = buildGraphData(schemas);
//       renderGraph(graphData);
//     }
//   }, [schemas, linkDistance, fontSize, nodeSize, isDragEnabled]);

//   const buildGraphData = (schemas) => {
//     const nodes = [];
//     const links = [];
//     const rootNode = { id: 0, name: "Schema" };
//     nodes.push(rootNode);

//     let nodeId = 1;

//     const traverse = (data, parentId = 0, linkName = "") => {
//       if (typeof data === "object" && data !== null) {
//         const currentId = nodeId++;
//         nodes.push({
//           id: currentId,
//           name: data["@type"] || "Object",
//         });

//         links.push({
//           source: parentId,
//           target: currentId,
//           linkName: linkName,
//         });

//         Object.entries(data).forEach(([key, value]) => {
//           if (key !== "@type") {
//             traverse(value, currentId, key);
//           }
//         });
//       }
//     };

//     schemas.forEach((schema) => traverse(schema));
//     return { nodes, links };
//   };

//   const renderGraph = ({ nodes, links }) => {
//     const width = 1000;
//     const height = 1000;

//     d3.select(graphRef.current).selectAll("*").remove();
//     const svg = d3
//       .select(graphRef.current)
//       .append("svg")
//       .attr("width", width)
//       .attr("height", height)
//       .call(
//         d3
//           .zoom()
//           .scaleExtent([0.01, 5])
//           .on("zoom", (event) => {
//             graphGroup.attr("transform", event.transform);
//           })
//       );

//     const graphGroup = svg.append("g");

//     svg
//       .append("defs")
//       .append("marker")
//       .attr("id", "arrow")
//       .attr("viewBox", "0 -5 10 10")
//       .attr("refX", 25)
//       .attr("refY", 0)
//       .attr("markerWidth", 6)
//       .attr("markerHeight", 6)
//       .attr("orient", "auto")
//       .append("path")
//       .attr("d", "M0,-5L10,0L0,5")
//       .attr("fill", "#aaa");

//     const simulation = d3
//       .forceSimulation(nodes)
//       .force(
//         "link",
//         d3
//           .forceLink(links)
//           .id((d) => d.id)
//           .distance(linkDistance)
//       )
//       .force("charge", d3.forceManyBody().strength(-300))
//       .force("center", d3.forceCenter(width / 2, height / 2));

//     const link = graphGroup
//       .append("g")
//       .attr("stroke", "#aaa")
//       .attr("stroke-width", 2)
//       .selectAll("line")
//       .data(links)
//       .enter()
//       .append("line")
//       .attr("marker-end", "url(#arrow)");

//     const linkLabel = graphGroup
//       .append("g")
//       .selectAll("text")
//       .data(links)
//       .enter()
//       .append("text")
//       .attr("font-size", `${fontSize * 0.8}px`)
//       .attr("dy", 5)
//       .attr("text-anchor", "middle")
//       .text((d) => d.linkName);

//     const node = graphGroup
//       .append("g")
//       .attr("stroke", "#fff")
//       .attr("stroke-width", 1.5)
//       .selectAll("circle")
//       .data(nodes)
//       .enter()
//       .append("circle")
//       .attr("r", nodeSize)
//       .attr("fill", (d) => d3.schemeCategory10[d.id % 10])
//       .call(isDragEnabled ? drag(simulation) : () => {});

//     const label = graphGroup
//       .append("g")
//       .selectAll("text")
//       .data(nodes)
//       .enter()
//       .append("text")
//       .attr("dy", -10)
//       .attr("text-anchor", "middle")
//       .text((d) => d.name)
//       .style("font-size", `${fontSize}px`)
//       .style("font-weight", "bold");

//     simulation.on("tick", () => {
//       link
//         .attr("x1", (d) => d.source.x)
//         .attr("y1", (d) => d.source.y)
//         .attr("x2", (d) => d.target.x)
//         .attr("y2", (d) => d.target.y);

//       linkLabel
//         .attr("x", (d) => (d.source.x + d.target.x) / 2)
//         .attr("y", (d) => (d.source.y + d.target.y) / 2);

//       node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

//       label.attr("x", (d) => d.x).attr("y", (d) => d.y);
//     });

//     function drag(simulation) {
//       function dragstarted(event) {
//         if (!event.active) simulation.alphaTarget(0.3).restart();
//         event.subject.fx = event.subject.x;
//         event.subject.fy = event.subject.y;
//       }

//       function dragged(event) {
//         event.subject.fx = event.x;
//         event.subject.fy = event.y;
//       }

//       function dragended(event) {
//         if (!event.active) simulation.alphaTarget(0);
//         event.subject.fx = null;
//         event.subject.fy = null;
//       }

//       return d3
//         .drag()
//         .on("start", dragstarted)
//         .on("drag", dragged)
//         .on("end", dragended);
//     }
//   };

//   const downloadGraphAsPng = () => {
//     const svgElement = graphRef.current.querySelector("svg");
//     const clonedSvg = svgElement.cloneNode(true);
//     const bbox = svgElement.getBBox();
//     const padding = 0;
//     const width = bbox.width + padding * 2;
//     const height = bbox.height + padding * 2;
//     clonedSvg.setAttribute(
//       "viewBox",
//       `${bbox.x - padding} ${bbox.y - padding} ${width} ${height}`
//     );
//     clonedSvg.setAttribute("width", width);
//     clonedSvg.setAttribute("height", height);
//     const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
//     rect.setAttribute("x", bbox.x - padding);
//     rect.setAttribute("y", bbox.y - padding);
//     rect.setAttribute("width", width);
//     rect.setAttribute("height", height);
//     rect.setAttribute("fill", "white");
//     clonedSvg.insertBefore(rect, clonedSvg.firstChild);
//     const serializer = new XMLSerializer();
//     const svgString = serializer.serializeToString(clonedSvg);
//     const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const img = new Image();
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       const scaleFactor = 4;
//       canvas.width = width * scaleFactor;
//       canvas.height = height * scaleFactor;
//       const ctx = canvas.getContext("2d");
//       ctx.fillStyle = "white";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(
//         img,
//         padding * scaleFactor,
//         padding * scaleFactor,
//         width * scaleFactor,
//         height * scaleFactor
//       );
//       const link = document.createElement("a");
//       link.download = "schema-graph.png";
//       link.href = canvas.toDataURL("image/png");
//       link.click();
//       URL.revokeObjectURL(url);
//     };
//     img.src = url;
//   };

//   return (
//     <div>
//       <div className="container">
//         <h2>Schema Visualizer</h2>
//         <button
//           onClick={() => setIsDragEnabled((prev) => !prev)}
//           id="pause-play"
//         >
//           {isDragEnabled ? (
//             <img src="image/pause.svg" alt="Pause button" />
//           ) : (
//             <img src="image/play.svg" alt="Play button" />
//           )}
//         </button>
//         <button onClick={downloadGraphAsPng} id="download-btn">
//           <img src="image/download.svg" alt="Download Graph" />
//         </button>
//         <div className="controls">
//           <div className="control-item">
//             <label>Font Size</label>
//             <input
//               type="range"
//               min="8"
//               max="30"
//               value={fontSize}
//               onChange={(e) => setFontSize(Number(e.target.value))}
//             />
//             <span>{fontSize}</span>
//           </div>
//           <div className="control-item">
//             <label>Node Size</label>
//             <input
//               type="range"
//               min="5"
//               max="20"
//               value={nodeSize}
//               onChange={(e) => setNodeSize(Number(e.target.value))}
//             />
//             <span>{nodeSize}</span>
//           </div>
//           <div className="control-item">
//             <label>Link Distance</label>
//             <input
//               type="range"
//               min="20"
//               max="200"
//               value={linkDistance}
//               onChange={(e) => setLinkDistance(Number(e.target.value))}
//             />
//             <span>{linkDistance}</span>
//           </div>
//         </div>
//       </div>

//       {schemas.length > 0 ? (
//         <div ref={graphRef} className="graph-container"></div>
//       ) : (
//         <div className="no-items">
//           <p>No Schema Found on this Website.</p>
//           <img src="image/notfound.svg" alt="Not Found" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default SchemaViewer;

// Without D3 Framework.
// import React, { useEffect, useState } from "react";
// import "./Schema.css";

// const SchemaViewer = () => {
//   const [schemas, setSchemas] = useState([]);

//   useEffect(() => {
//     const fetchSchemas = async () => {
//       const [tab] = await chrome.tabs.query({
//         active: true,
//         currentWindow: true,
//       });
//       const tabId = tab.id;

//       chrome.scripting.executeScript(
//         {
//           target: { tabId },
//           func: () => {
//             const schemaScripts = Array.from(
//               document.querySelectorAll('script[type="application/ld+json"]')
//             );
//             return schemaScripts
//               .map((script) => {
//                 try {
//                   return JSON.parse(script.innerText);
//                 } catch {
//                   return null;
//                 }
//               })
//               .filter(Boolean);
//           },
//         },
//         ([result]) => {
//           setSchemas(result.result || []);
//         }
//       );
//     };

//     fetchSchemas();
//   }, []);

//   return (
//     <div>
//       <h2>Schema</h2>
//       <p className="schema-description">
//         <strong>
//           Schema Markup is a semantic vocabulary of tags that helps search
//           engines understand your webpage and better represent it in the search
//           results.
//         </strong>
//       </p>
//       <div className="schema-container">
//         {schemas.length > 0 ? (
//           schemas.map((schema, index) => (
//             <SchemaItem
//               key={index}
//               data={schema}
//               title={schema["@type"] || `Schema ${index + 1}`}
//             />
//           ))
//         ) : (
//           <div className="no-items" id="no-schema">
//             <p>No Schema Found on this Website.</p>
//             <img src="notfound.svg" alt="Not Found" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const SchemaItem = ({ data, title }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleOpen = () => setIsOpen(!isOpen);

//   const renderValue = (key, value) => {
//     if (typeof value === "object" && value !== null) {
//       return <SchemaItem data={value} title={value["@type"] || key} />;
//     }
//     return (
//       <div className="schema-value">
//         <strong>{key}:</strong> {value}
//       </div>
//     );
//   };

//   return (
//     <div className="schema-item">
//       <div className="schema-header" onClick={toggleOpen}>
//         <span>{title}</span>
//         <button>{isOpen ? "▲" : "▼"}</button>
//       </div>
//       {isOpen && (
//         <div className="schema-content">
//           {Object.entries(data).map(([key, value], index) => (
//             <div key={index} className="schema-entry">
//               {renderValue(key, value)}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SchemaViewer;
