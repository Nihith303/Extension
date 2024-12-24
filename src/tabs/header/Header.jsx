import React, { useEffect, useState } from "react";
import { fetchHeaders } from "../utils/fetchHeaders";
import "./Header.css";

const Headers = () => {
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [headerCounts, setHeaderCounts] = useState({
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0,
    h6: 0,
  });

  useEffect(() => {
    const getHeaders = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        const tabId = tab.id;

        const { headers: fetchedHeaders, counts } = await fetchHeaders(tabId);
        setHeaders(fetchedHeaders);
        setHeaderCounts(counts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getHeaders();
  }, []);

  const isEmpty = Object.values(headerCounts).every((count) => count === 0);

  return (
    <div>
      <h2>Headers</h2>
      {loading ? (
        <img src="image/loading.gif" alt="Loading" className="loading" />
      ) : error ? (
        // Display error message
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="header-counts">
            {Object.keys(headerCounts).map((key) => (
              <div className="header-item" key={key}>
                <span>{key.toUpperCase()}</span>
                <span>{headerCounts[key] || 0}</span>
              </div>
            ))}
          </div>
          {isEmpty ? (
            <div className="no-items" id="no-headers">
              <p>No Headers Found on this Website.</p>
              <img src="image/notfound.svg" alt="Not Found" />
            </div>
          ) : (
            <div className="header-structure">
              {headers.map((header, index) => (
                <div
                  key={index}
                  className={`header-content header-${header.tag}`}
                >
                  <span className="dashed-line"></span>
                  <strong>
                    <span className="header-tag">{header.tag}</span>
                  </strong>
                  <span className="header-text">{header.text}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Headers;
