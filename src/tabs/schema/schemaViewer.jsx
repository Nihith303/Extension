//SchemaViewer.jsx
import React, { useEffect, useState } from "react";
import "./Schema.css";
import { fetchSchemas } from "./fetchschema";

const SchemaViewer = () => {
  const [schemas, setSchemas] = useState([]);

  useEffect(() => {
    const loadSchemas = async () => {
      try {
        const fetchedSchemas = await fetchSchemas();
        setSchemas(fetchedSchemas);
      } catch (error) {
        console.error("Error loading schemas:", error);
      }
    };

    loadSchemas();
  }, []);

  return (
    <div>
      <h2>Schema</h2>
      <p className="schema-description">
        <strong>
          Schema Markup is a semantic vocabulary of tags that helps search
          engines understand your webpage and better represent it in the search
          results.
        </strong>
      </p>
      <div className="schema-container">
        {schemas.length > 0 ? (
          schemas.map((schema, index) => (
            <SchemaItem
              key={index}
              data={schema}
              title={schema["@type"] || `Schema ${index + 1}`}
            />
          ))
        ) : (
          <div className="no-items" id="no-schema">
            <p>No Schema Found on this Website.</p>
            <img src="notfound.svg" alt="Not Found" />
          </div>
        )}
      </div>
    </div>
  );
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

export default SchemaViewer;
