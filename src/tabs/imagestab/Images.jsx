import React, { useEffect, useState } from "react";
import { fetchImages } from "../utils/fetchImages";
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        const tabId = tab.id;
        const imagesData = await fetchImages(tabId);
        setImages(imagesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImageData();
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
          <a href="${imgSrc}" download="${imgSrc.split("/").pop()}" 
            style="display: inline-block; padding: 10px 20px; background-color: #0056b3; color: white; text-decoration: none; border-radius: 5px;">
            Download
          </a>
        </div>
      `;
    }
  };

  const renderImageItem = (label, count, category) => {
    return (
      <div className="image-item">
        <span>{label}</span>
        <span id={category !== "total" && count > 0 ? "red-text" : ""}>
          {count || 0}
        </span>
      </div>
    );
  };

  return (
    <div className="active-tab-container">
      {loading ? (
        <i class="loader --1"></i>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="image-counts">
            {renderImageItem("Total Images", images.total?.length, "total")}
            {renderImageItem("Without ALT", images.noAlt?.length, "noAlt")}
            {renderImageItem(
              "Without Description",
              images.noLongDesc?.length,
              "noLongDesc"
            )}
            {renderImageItem("Without SRC", images.noSrc?.length, "noSrc")}
          </div>
          <div className="image-nav">
            <button onClick={() => setView("total")}>Total</button>
            <button onClick={() => setView("noAlt")}>No ALT</button>
            <button onClick={() => setView("noLongDesc")}>
              No Description
            </button>
            <button onClick={() => setView("noSrc")}>No SRC</button>
            <button className="export-button" onClick={exportCSV}>
              Export
            </button>
          </div>
          <div className="images-table">
            {images[view].length === 0 ? (
              <div className="no-items">
                <p>No Images to show in this Category</p>
                <img src="image/notfound.svg" alt="Not Found" />
              </div>
            ) : (
              images[view].map((img, index) => (
                <React.Fragment key={index}>
                  <div className="image-details">
                    <p>
                      <strong>URL:</strong>{" "}
                      <span
                        onClick={() => handleImageClick(img.src)}
                        className="image-url"
                        id={img.src === "No SRC" ? "red-text" : "image-url"}
                      >
                        {img.src || "No SRC"}
                      </span>
                    </p>
                    <p>
                      <strong>ALT:</strong>{" "}
                      <span id={img.alt === "No ALT" ? "red-text" : ""}>
                        {img.alt}
                      </span>
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      <span
                        id={img.longDesc === "No Description" ? "red-text" : ""}
                      >
                        {img.longDesc}
                      </span>
                    </p>
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
                    <p>
                      {img.width}x{img.height}
                    </p>
                  </div>
                </React.Fragment>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Image;
