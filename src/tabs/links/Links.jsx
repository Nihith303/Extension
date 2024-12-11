import React, { useEffect, useState } from "react";
import "./Links.css";

const Links = () => {
  const [links, setLinks] = useState([]);
  const [view, setView] = useState("total");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const tabId = tab.id;

      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: () => {
            const links = Array.from(document.querySelectorAll("a"))
              .map((a) => ({
                href: a.href,
                title: a.textContent.trim() || "No title",
              }))
              .filter((link) => link.href);

            const url = window.location.origin;

            const internal = links.filter((link) => link.href.startsWith(url));
            const external = links.filter((link) => !link.href.startsWith(url));
            const unique = [...new Set(links.map((link) => link.href))].map((href) => ({
              href,
              title: links.find((link) => link.href === href)?.title || "No title",
            }));

            return {
              total: links,
              internal,
              external,
              unique,
            };
          },
        },
        ([result]) => {
          setLinks(result.result);
          setLoading(false);
        }
      );
    };

    fetchLinks();
  }, []);

  const exportToCSV = () => {
    const csvRows = [];
    csvRows.push("URL,Title"); 
    links[view]?.forEach(({ href, title }) => {
      csvRows.push(`"${href}","${title}"`);
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${view}-links.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="active-tab-container">
      <h2>Links</h2>
      {loading ? (
        <img className="loading" src='loading.gif' alt='Loading'></img>
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
              onClick={() => setView("total")}>
              Total
            </button>
            <button
              className={view === "internal" ? "active" : ""}
              onClick={() => setView("internal")}>
              Internal
            </button>
            <button
              className={view === "external" ? "active" : ""}
              onClick={() => setView("external")}>
              External
            </button>
            <button
              className={view === "unique" ? "active" : ""}
              onClick={() => setView("unique")}>
              Unique
            </button>
            <button className="link-export-button" onClick={exportToCSV}>Export</button>
          </div>

          <div className="links-table">
            {links[view]?.map((link, index) => (
              <React.Fragment key={index}>
                <div className="link-details">
                  <p>
                    <strong>URL:</strong> 
                    <a href={link.href} className="link-url" target="_blank" rel="noopener noreferrer">
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
                  {
                    links.total?.filter((l) => l.href === link.href).length || 0
                  }
                </p>
                </div>
                </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Links;













