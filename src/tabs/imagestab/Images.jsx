import React, { useEffect, useState } from "react";
import "./Images.css";

const Image = () => {
  const [images, setImages] = useState({
    total: [],
    noAlt: [],
    noLongDesc: [],
    noSrc: [],
  });
  const [view, setView] = useState("total");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const tabId = tab.id;

      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: () => {
            const images = Array.from(document.querySelectorAll("img")).map((img) => ({
              src: img.src || "No SRC",
              alt: img.alt || "No ALT",
              longDesc: img.longdesc || "No Description",
              width: img.naturalWidth || "N/A",
              height: img.naturalHeight || "N/A",
            }));

            const noAlt = images.filter((img) => img.alt === "No ALT");
            const noLongDesc = images.filter((img) => img.longDesc === "No Description");
            const noSrc = images.filter((img) => img.src === "No SRC");

            return {
              total: images,
              noAlt,
              noLongDesc,
              noSrc,
            };
          },
        },
        ([result]) => {
          setImages(result.result);
          setLoading(false);
        }
      );
    };

    fetchImages();
  }, []);

  const exportCSV = () => {
    const csvData = images[view]
      .map(
        (img) =>
          `${img.src},${img.alt},${img.longDesc},${img.width}x${img.height}`
      )
      .join("\n");
    const blob = new Blob([`URL,ALT,LongDesc,Size\n${csvData}`], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "images.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImageClick = (imgSrc) => {
    const newTab = window.open();
    if (newTab) {
      newTab.document.body.innerHTML = `
        <div style="text-align: center; margin: 20px;">
          <img src="${imgSrc}" alt="Full Image" style="max-width: 100%; height: auto; margin-bottom: 20px;"/><br/>
          <a href="${imgSrc}" download="${imgSrc.split('/').pop()}" 
            style="display: inline-block; padding: 10px 20px; background-color: #0056b3; color: white; text-decoration: none; border-radius: 5px;">
            Download
          </a>
        </div>
      `;
    }
  };

  return (
    <div>
      <h2>Images</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="image-counts">
            <div className="image-item">
              <span>Total Images</span>
              <span>{images.total?.length || 0}</span>
            </div>
            <div className="image-item">
              <span>Without ALT</span>
              <span>{images.noAlt?.length || 0}</span>
            </div>
            <div className="image-item">
              <span>Without Description</span>
              <span>{images.noLongDesc?.length || 0}</span>
            </div>
            <div className="image-item">
              <span>Without SRC</span>
              <span>{images.noSrc?.length || 0}</span>
            </div>
          </div>
          <div className="image-nav">
            <button onClick={() => setView("total")}>Total</button>
            <button onClick={() => setView("noAlt")}>No ALT</button>
            <button onClick={() => setView("noLongDesc")}>No Description</button>
            <button onClick={() => setView("noSrc")}>No SRC</button>
            <button className="export-button" onClick={exportCSV}>
              Export
            </button>
          </div>
          <div className="images-table">
            {images[view].map((img, index) => (
              <React.Fragment key={index}>
                <div className="image-details">
                  <p><strong>URL:</strong> {img.src}</p>
                  <p><strong>ALT:</strong> {img.alt}</p>
                  <p><strong>Description:</strong> {img.longDesc}</p>
                </div>
                <div className="image-preview">
                  {img.src !== "No SRC" ? (
                    <img
                      src={img.src}
                      alt="Preview"
                      onClick={() => handleImageClick(img.src)}
                    />
                  ) : (
                    <p>No SRC</p>
                  )}
                  <p>{img.width}x{img.height}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Image;
