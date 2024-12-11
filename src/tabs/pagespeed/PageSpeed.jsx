import React, { useState } from "react";
import "./PageSpeed.css";

const PageSpeedTest = () => {
  const [url, setUrl] = useState("");
  const [desktopResult, setDesktopResult] = useState(null);
  const [mobileResult, setMobileResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getActiveTabUrl = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab.url;
  };

  const API_KEY = "AIzaSyCdskX2l4jTGn8RXH9zjDqnV31aHdhxTEU";

  const fetchPageSpeedData = async (url, strategy) => {
    const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=${strategy}&key=${API_KEY}`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Failed to fetch PageSpeed data");
    return response.json();
  };

  const runTest = async () => {
    setError("");
    setIsLoading(true);

    try {
      const activeUrl = await getActiveTabUrl();
      setUrl(activeUrl);

      const [desktop, mobile] = await Promise.all([
        fetchPageSpeedData(activeUrl, "desktop"),
        fetchPageSpeedData(activeUrl, "mobile"),
      ]);

      setDesktopResult(desktop.lighthouseResult);
      setMobileResult(mobile.lighthouseResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "#4caf50";
    if (score >= 50) return "#ffc107";
    return "#f44336";
  };

  const renderMetrics = (result) => {
    const audits = result.audits;
    return (
      <div className="metrics">
        <p><strong>First Contentful Paint:</strong> {audits["first-contentful-paint"].displayValue}</p>
        <p><strong>Largest Contentful Paint:</strong> {audits["largest-contentful-paint"].displayValue}</p>
        <p><strong>Total Blocking Time:</strong> {audits["total-blocking-time"].displayValue}</p>
        <p><strong>Cumulative Layout Shift:</strong> {audits["cumulative-layout-shift"].displayValue}</p>
      </div>
    );
  };

  const renderScoreCard = (result, strategy) => {
    const score = result.categories.performance.score * 100;
    const scoreColor = getScoreColor(score);

    return (
      <div className="score-card">
        <div
          className="score-circle"
          style={{
            background: `conic-gradient(${scoreColor} ${score}%, #f3f3f3 ${score}%)`,
          }}
        >
          <span>{score}</span>
        </div>
        <p className="circle-label">{strategy} PageSpeed</p>
        <p className="url-text">
          Google PageSpeed Insights for <br /> <span className="url">{url}</span>
        </p>
        {renderMetrics(result)} 
      </div>
    );
  };

  return (
    <div className="pagespeed-container">
      <h2>Page Speed Test</h2>
      <button onClick={runTest} disabled={isLoading}>
        {isLoading ? "Running Test..." : "Run Speed Test"}
      </button>
      {error && <p className="error">{error}</p>}

      <div className="score-container">
        {mobileResult && renderScoreCard(mobileResult, "Mobile")}
        {desktopResult && renderScoreCard(desktopResult, "Desktop")}
      </div>

      {desktopResult && mobileResult && (
        <div className="legend">
          <div>
            <span className="legend-color green"></span><strong>Good</strong>
          </div>
          <div>
            <span className="legend-color yellow"></span><strong>Can Be Better</strong>
          </div>
          <div>
            <span className="legend-color red"></span><strong>Need to Be Updated</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageSpeedTest;
