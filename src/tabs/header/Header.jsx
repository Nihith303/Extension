import React, { useEffect, useState } from "react";
import "./Header.css";

const Header = () => {
  const [headings, setHeadings] = useState({
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeadings = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const tabId = tab.id;

      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: () => {
            const tags = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map(
              (tag) => ({
                tagName: tag.tagName,
                textContent: tag.textContent.trim(),
                parent: tag.parentElement.tagName,
              })
            );

            return tags.reduce(
              (acc, tag) => {
                acc[tag.tagName.toLowerCase()].push(tag);
                return acc;
              },
              { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] }
            );
          },
        },
        ([result]) => {
          setHeadings(result.result);
          setLoading(false);
        }
      );
    };

    fetchHeadings();
  }, []);

  const renderHeadingStructure = (headings) => {
    const levels = Object.entries(headings);
    const renderLevel = (tags, level = 1) =>
      tags.map((tag, index) => (
        <div key={`${level}-${index}`} style={{ paddingLeft: `${level * 15}px` }}>
          <strong>{tag.tagName}</strong>: {tag.textContent || "No Content"}
          <br />
        </div>
      ));

    return levels.map(([key, tags], index) => renderLevel(tags, index));
  };

  return (
    <div>
      <h2>Headers</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="header-counts">
            <div>H1: {headings.h1.length}</div>
            <div>H2: {headings.h2.length}</div>
            <div>H3: {headings.h3.length}</div>
            <div>H4: {headings.h4.length}</div>
            <div>H5: {headings.h5.length}</div>
            <div>H6: {headings.h6.length}</div>
          </div>
          <div className="header-structure">
            <h3>Content in Tags:</h3>
            <div>{renderHeadingStructure(headings)}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
