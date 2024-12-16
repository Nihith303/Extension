// Using D3 With Scrollers with Single Root Nodec without tooltip.
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import "./Schema.css";

const SchemaViewer = () => {
  const [schemas, setSchemas] = useState([]);
  const [linkDistance, setLinkDistance] = useState(100);
  const [fontSize, setFontSize] = useState(12);
  const graphRef = useRef(null);

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
  }, [schemas, linkDistance, fontSize]);

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
    const width = 800;
    const height = 600;

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

    const simulation = d3
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
      .attr("font-size", "10px")
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
      .attr("r", 8)
      .attr("fill", (d) => d3.schemeCategory10[d.id % 10])
      .call(drag(simulation));

    const label = graphGroup
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("dy", -10)
      .attr("text-anchor", "middle")
      .text((d) => d.name)
      .style("font-size", `${fontSize}px`);

    simulation.on("tick", () => {
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

    function drag(simulation) {
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
    }
  };

  return (
    <div>
      <h2>Schema Viewer</h2>

      <div className="controls">
        <div>
          <label>Link Distance: {linkDistance}</label>
          <input
            type="range"
            min="50"
            max="300"
            value={linkDistance}
            onChange={(e) => setLinkDistance(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Font Size: {fontSize}px</label>
          <input
            type="range"
            min="6"
            max="20"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </div>
      </div>

      {schemas.length > 0 ? (
        <div ref={graphRef} className="graph-container"></div>
      ) : (
        <div className="no-items" id="no-schema">
          <p>No Schema Found on this Website.</p>
          <img src="image/notfound.svg" alt="Not Found" />
        </div>
      )}
    </div>
  );
};

export default SchemaViewer;

// Using D3 for Visualization with Scrollers without Single Root Node.
// import React, { useEffect, useState, useRef } from "react";
// import * as d3 from "d3";
// import "./Schema.css";

// const SchemaViewer = () => {
//   const [schemas, setSchemas] = useState([]);
//   const [linkDistance, setLinkDistance] = useState(100);
//   const [fontSize, setFontSize] = useState(12);
//   const graphRef = useRef(null);
//   const simulationRef = useRef(null);

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
//   }, [schemas, linkDistance, fontSize]);

//   const buildGraphData = (schemas) => {
//     const nodes = [];
//     const links = [];

//     const traverse = (data, parentId = null) => {
//       if (typeof data === "object" && data !== null) {
//         const currentId = nodes.length;
//         nodes.push({
//           id: currentId,
//           name: data["@type"] || data["@name"],
//         });

//         if (parentId !== null) {
//           links.push({ source: parentId, target: currentId });
//         }

//         Object.entries(data).forEach(([key, value]) => {
//           if (key !== "@type") {
//             traverse(value, currentId);
//           }
//         });
//       }
//     };

//     schemas.forEach((schema) => traverse(schema));
//     return { nodes, links };
//   };

//   const renderGraph = ({ nodes, links }) => {
//     const width = 800;
//     const height = 600;

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

//     simulationRef.current = simulation;

//     const link = graphGroup
//       .append("g")
//       .attr("stroke", "#aaa")
//       .attr("stroke-width", 2)
//       .selectAll("line")
//       .data(links)
//       .enter()
//       .append("line");

//     const node = graphGroup
//       .append("g")
//       .attr("stroke", "#fff")
//       .attr("stroke-width", 1.5)
//       .selectAll("circle")
//       .data(nodes)
//       .enter()
//       .append("circle")
//       .attr("r", 8)
//       .attr("fill", (d) => d3.schemeCategory10[d.id % 10])
//       .call(drag(simulation));

//     const label = graphGroup
//       .append("g")
//       .selectAll("text")
//       .data(nodes)
//       .enter()
//       .append("text")
//       .attr("dy", -10)
//       .attr("text-anchor", "middle")
//       .text((d) => d.name)
//       .style("font-size", `${fontSize}px`);

//     simulation.on("tick", () => {
//       link
//         .attr("x1", (d) => d.source.x)
//         .attr("y1", (d) => d.source.y)
//         .attr("x2", (d) => d.target.x)
//         .attr("y2", (d) => d.target.y);

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

//   return (
//     <div>
//       <h2>Schema Viewer</h2>

//       <div className="controls">
//         <div>
//           <label>Link Distance: {linkDistance}</label>
//           <input
//             type="range"
//             min="50"
//             max="300"
//             value={linkDistance}
//             onChange={(e) => setLinkDistance(Number(e.target.value))}
//           />
//         </div>
//         <div>
//           <label>Font Size: {fontSize}px</label>
//           <input
//             type="range"
//             min="6"
//             max="20"
//             value={fontSize}
//             onChange={(e) => setFontSize(Number(e.target.value))}
//           />
//         </div>
//       </div>

//       {schemas.length > 0 ? (
//         <div ref={graphRef} className="graph-container"></div>
//       ) : (
//         <div className="no-items" id="no-schema">
//           <p>No Schema Found on this Website.</p>
//           <img src="image/notfound.svg" alt="Not Found" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default SchemaViewer;

// Using D3 for Visualization without Scrollers.
// import React, { useEffect, useState, useRef } from "react";
// import * as d3 from "d3";
// import "./Schema.css";

// const SchemaViewer = () => {
//   const [schemas, setSchemas] = useState([]);
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
//   }, [schemas]);

//   const buildGraphData = (schemas) => {
//     const nodes = [];
//     const links = [];

//     const traverse = (data, parentId = null) => {
//       if (typeof data === "object" && data !== null) {
//         const currentId = nodes.length;
//         nodes.push({ id: currentId, name: data["@type"] || "Object" });

//         if (parentId !== null) {
//           links.push({ source: parentId, target: currentId });
//         }

//         Object.entries(data).forEach(([key, value]) => {
//           if (key !== "@type") {
//             traverse(value, currentId);
//           }
//         });
//       }
//     };

//     schemas.forEach((schema) => traverse(schema));
//     return { nodes, links };
//   };

//   const renderGraph = ({ nodes, links }) => {
//     // const width = 800;
//     // const height = 600;

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
//     const simulation = d3
//       .forceSimulation(nodes)
//       .force(
//         "link",
//         d3
//           .forceLink(links)
//           .id((d) => d.id)
//           .distance(100)
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
//       .append("line");

//     const node = graphGroup
//       .append("g")
//       .attr("stroke", "#fff")
//       .attr("stroke-width", 1.5)
//       .selectAll("circle")
//       .data(nodes)
//       .enter()
//       .append("circle")
//       .attr("r", 8)
//       .attr("fill", (d) => d3.schemeCategory10[d.id % 10])
//       .call(drag(simulation));

//     const label = graphGroup
//       .append("g")
//       .selectAll("text")
//       .data(nodes)
//       .enter()
//       .append("text")
//       .attr("dy", -10)
//       .attr("text-anchor", "middle")
//       .text((d) => d.name)
//       .style("font-size", "10px");

//     simulation.on("tick", () => {
//       link
//         .attr("x1", (d) => d.source.x)
//         .attr("y1", (d) => d.source.y)
//         .attr("x2", (d) => d.target.x)
//         .attr("y2", (d) => d.target.y);

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

//   return (
//     <div>
//       <h2>Schema Viewer</h2>
//       {schemas.length > 0 ? (
//         <div ref={graphRef} className="graph-container"></div>
//       ) : (
//         <div className="no-items" id="no-schema">
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
