// import React, { useEffect, useState } from "react";
// import "./Schema.css";

// const Schema = () => {
//   const [schemaData, setSchemaData] = useState([]);

//   useEffect(() => {
//     const fetchSchemaData = async () => {
//       const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//       const tabId = tab.id;

//       chrome.scripting.executeScript(
//         {
//           target: { tabId },
//           func: () => {
//             const schemas = [];
//             const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');

//             scriptTags.forEach((script) => {
//               try {
//                 const json = JSON.parse(script.innerText);
//                 schemas.push(json);
//               } catch (e) {
//                 console.error("Error parsing JSON-LD:", e);
//               }
//             });

//             return schemas;
//           },
//         },
//         ([result]) => {
//           setSchemaData(result.result || []);
//         }
//       );
//     };

//     fetchSchemaData();
//   }, []);

//   // Recursive Function to Render Key-Value Pairs
//   const renderSchema = (data, level = 0) => {
//     if (typeof data === "object" && data !== null) {
//       return (
//         <div className="schema-object">
//           {Object.keys(data).map((key, index) => (
//             <details key={index} className={`schema-details schema-level-${level}`}>
//               <summary className="schema-key">
//                 <strong>{key}</strong>
//               </summary>
//               <div className="schema-value">{renderSchema(data[key], level + 1)}</div>
//             </details>
//           ))}
//         </div>
//       );
//     } else if (Array.isArray(data)) {
//       return (
//         <ul className="schema-array">
//           {data.map((item, index) => (
//             <li key={index}>{renderSchema(item, level)}</li>
//           ))}
//         </ul>
//       );
//     } else {
//       return <span className="schema-primitive">{data?.toString() || "null"}</span>;
//     }
//   };

//   return (
//     <div>
//       <h2>Schema</h2>
//       <div className="schema-summary">
//         <strong>Schema Types Found: {schemaData.length}</strong>
//       </div>
//       <div className="schema-list">
//         {schemaData.map((schema, index) => (
//           <div key={index} className="schema-item">
//             <h3>Schema {index + 1}: {schema["@type"] || "Unknown Type"}</h3>
//             <div className="schema-content">{renderSchema(schema)}</div>
//             <button
//               className="copy-button"
//               onClick={() => navigator.clipboard.writeText(JSON.stringify(schema, null, 2))}
//             >
//               Copy JSON
//             </button>
//             <a
//               className="validate-button"
//               href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(window.location.href)}`}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Validate
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Schema;










// import React, { useEffect, useState } from "react";
// import "./Schema.css";

// const SchemaViewer = () => {
//   const [schemas, setSchemas] = useState([]);

//   useEffect(() => {
//     const fetchSchemas = async () => {
//       const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//       const tabId = tab.id;

//       chrome.scripting.executeScript(
//         {
//           target: { tabId },
//           func: () => {
//             const schemaScripts = Array.from(
//               document.querySelectorAll('script[type="application/ld+json"]')
//             );
//             return schemaScripts.map((script) => JSON.parse(script.innerText));
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
//       <p>
//         Schema Markup is a semantic vocabulary of tags that helps search engines
//         understand your webpage and better represent it in the search results.
//       </p>
//       <div className="schema-container">
//         {schemas.map((schema, index) => (
//           <SchemaItem key={index} data={schema} title={`Schema ${index + 1}`} />
//         ))}
//       </div>
//     </div>
//   );
// };

// const SchemaItem = ({ data, title }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleOpen = () => setIsOpen(!isOpen);

//   const renderValue = (key, value) => {
//     if (typeof value === "object" && value !== null) {
//       return <SchemaItem data={value} title={key} />;
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








import React, { useEffect, useState } from "react";
import "./Schema.css";

const SchemaViewer = () => {
  const [schemas, setSchemas] = useState([]);

  useEffect(() => {
    const fetchSchemas = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const tabId = tab.id;

      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: () => {
            const schemaScripts = Array.from(
              document.querySelectorAll('script[type="application/ld+json"]')
            );
            return schemaScripts.map((script) => JSON.parse(script.innerText));
          },
        },
        ([result]) => {
          setSchemas(result.result || []);
        }
      );
    };

    fetchSchemas();
  }, []);

  return (
    <div>
      <h2>Schema</h2>
      <p className="schema-description"><strong>
        Schema Markup is a semantic vocabulary of tags that helps search engines
        understand your webpage and better represent it in the search results.</strong>
      </p>
      <div className="schema-container">
        {schemas.map((schema, index) => (
          <SchemaItem key={index} data={schema} title={schema["@type"] || `Schema ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

const SchemaItem = ({ data, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const renderValue = (key, value) => {
    if (typeof value === "object" && value !== null) {
      // Pass the type of the nested object as the title
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

export default SchemaViewer;
