import React, { useEffect, useState } from "react";
import './Summary.css';

const Summary = () => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsiteInfo = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const tabId = tab.id;

      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: () => {
            const meta = (name) => document.querySelector(`meta[name="${name}"]`)?.content;
            const robotsMeta = document.querySelector('meta[name="robots"]')?.content || "N/A";
            const xRobotsMeta = document.querySelector('meta[http-equiv="X-Robots-Tag"]')?.content || "N/A";
            const lang = document.documentElement.lang || "N/A";

            return {
              title: document.title,
              description: meta("description") || "N/A",
              canonical: document.querySelector('link[rel="canonical"]')?.href || "N/A",
              robots: robotsMeta,
              xRobots: xRobotsMeta,
              lang: lang,
              url: window.location.href,
            };
          },
        },
        ([result]) => {
          setInfo(result.result);
          setLoading(false);
        }
      );
    };

    fetchWebsiteInfo();
  }, []);

  return (
    <div>
      <h2>Summary</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="info">
          <p><strong>Title:</strong> {info.title}</p>
          <p><strong>Description:</strong> {info.description}</p>
          <p><strong>Canonical:</strong> {info.canonical}</p>
          <p><strong>URL:</strong> {info.url}</p>
          <p><strong>Language:</strong> {info.lang}</p>
          <p><strong>Robots Meta:</strong> {info.robots}</p>
          <p><strong>X-Robots Meta:</strong> {info.xRobots}</p>
        </div>
      )}
      {info.url && (
        <div className="buttons">
          <button onClick={() => window.open(`${info.url}/sitemap.xml`, "_blank")}>
            Sitemap
          </button>
          <button onClick={() => window.open(`${info.url}/robots.txt`, "_blank")}>
            Robots.txt
          </button>
        </div>
      )}
    </div>
  );
};

export default Summary;
