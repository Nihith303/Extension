import React, { useEffect, useState } from "react";
import { fetchLinks } from "../utils/fetchLinks";
import "./Links.css";

const Links = () => {
  const [links, setLinks] = useState([]);
  const [view, setView] = useState("total");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLinks = async () => {
      try {
        const data = await fetchLinks();
        setLinks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getLinks();
  }, []);

  const exportToCSV = () => {
    const csvRows = [];
    csvRows.push("URL,Title,Category,Count");
    ["internal", "external", "withoutHref"].forEach((category) => {
      links[category]?.forEach(({ href, title }) => {
        const count =
          links.total?.filter((link) => link.href === href).length || 0;
        csvRows.push(
          `"${href || "No href"}","${title}","${category}","${count}"`
        );
      });
    });
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `links.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const renderLinkCount = (label, category) => (
    <div className="link-item">
      <span>{label}</span>
      <span>{links[category]?.length || 0}</span>
    </div>
  );
  const renderFilterButton = (label, category) => (
    <button
      className={view === category ? "active" : ""}
      onClick={() => setView(category)}
    >
      {label}
    </button>
  );

  return (
    <div className="active-tab-container">
      <h2>Links</h2>
      {loading ? (
        <i class="loader --1"></i>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="link-counts">
            {renderLinkCount("Total", "total")}
            {renderLinkCount("Internal", "internal")}
            {renderLinkCount("External", "external")}
            {renderLinkCount("Without href", "withoutHref")}
            {renderLinkCount("Unique", "unique")}
          </div>

          <div className="filter-buttons">
            {renderFilterButton("Total", "total")}
            {renderFilterButton("Internal", "internal")}
            {renderFilterButton("External", "external")}
            {renderFilterButton("No href", "withoutHref")}
            {renderFilterButton("Unique", "unique")}
            <button className="link-export-button" onClick={exportToCSV}>
              Export
            </button>
          </div>

          <div className="links-table">
            {links[view]?.length > 0 ? (
              links[view].map((link, index) => (
                <React.Fragment key={index}>
                  <div className="link-details">
                    <p>
                      <strong>URL:</strong>
                      {link.href ? (
                        <a
                          href={link.href}
                          className="link-url"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.href}
                        </a>
                      ) : (
                        "No href"
                      )}
                    </p>
                    <p>
                      <strong>Title:</strong> {link.title}
                    </p>
                  </div>
                  <div className="link-count">
                    <p>
                      <strong>Count:</strong>{" "}
                      {links.total?.filter((l) => l.href === link.href)
                        .length || 0}
                    </p>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className="no-items" id="no-links">
                <p>
                  No Links to show in this <br /> Category
                </p>
                <img src="image/notfound.svg" alt="Not Found" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Links;
