import React, { useEffect, useState } from "react";
import { fetchLinks } from "../utils/fetchLinks";
import "./Links.css";

const Links = () => {
  const [links, setLinks] = useState([]);
  const [view, setView] = useState("total");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLinks = async () => {
      try {
        const data = await fetchLinks();
        setLinks(data);
      } catch (error) {
        console.error("Error fetching links:", error);
      } finally {
        setLoading(false);
      }
    };

    getLinks();
  }, []);

  const exportToCSV = () => {
    const csvRows = [];
    csvRows.push("URL,Title,Category,Count");
    ["internal", "external"].forEach((category) => {
      links[category]?.forEach(({ href, title }) => {
        const count =
          links.total?.filter((link) => link.href === href).length || 0;
        csvRows.push(`"${href}","${title}","${category}","${count}"`);
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

  return (
    <div className="active-tab-container">
      <h2>Links</h2>
      {loading ? (
        <img className="loading" src="image/loading.gif" alt="Loading"></img>
      ) : (
        <>
          <div className="link-counts">
            <div className="link-item">
              <span>Total Links</span>
              <span>{links.total?.length || 0}</span>
            </div>
            <div className="link-item">
              <span>Internal Links</span>
              <span>{links.internal?.length || 0}</span>
            </div>
            <div className="link-item">
              <span>External Links</span>
              <span>{links.external?.length || 0}</span>
            </div>
            <div className="link-item">
              <span>Unique Links</span>
              <span>{links.unique?.length || 0}</span>
            </div>
          </div>

          <div className="filter-buttons">
            <button
              className={view === "total" ? "active" : ""}
              onClick={() => setView("total")}
            >
              Total
            </button>
            <button
              className={view === "internal" ? "active" : ""}
              onClick={() => setView("internal")}
            >
              Internal
            </button>
            <button
              className={view === "external" ? "active" : ""}
              onClick={() => setView("external")}
            >
              External
            </button>
            <button
              className={view === "unique" ? "active" : ""}
              onClick={() => setView("unique")}
            >
              Unique
            </button>
            <button className="link-export-button" onClick={exportToCSV}>
              Export Links
            </button>
          </div>

          <div className="links-table">
            {links[view]?.length > 0 ? (
              links[view].map((link, index) => (
                <React.Fragment key={index}>
                  <div className="link-details">
                    <p>
                      <strong>URL:</strong>
                      <a
                        href={link.href}
                        className="link-url"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.href}
                      </a>
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
