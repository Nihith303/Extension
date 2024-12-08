import React, { useEffect, useState } from "react";
import "./Images.css";

const Images = () => {
  const [images, setImages] = useState([]);
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
              title: img.title || "No Title",
              width: img.naturalWidth,
              height: img.naturalHeight,
            }));

            const withoutAlt = images.filter((img) => img.alt === "No ALT").length;
            const withoutSrc = images.filter((img) => img.src === "No SRC").length;
            const withoutTitle = images.filter((img) => img.title === "No Title").length;

            return {
              images,
              stats: {
                total: images.length,
                withoutAlt,
                withoutSrc,
                withoutTitle,
              },
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

  return (
    <div>
      <h2>Images</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="image-counts">
            <p>Total: {images.stats?.total}</p>
            <p>Without ALT: {images.stats?.withoutAlt}</p>
            <p>Without SRC: {images.stats?.withoutSrc}</p>
            <p>Without Title: {images.stats?.withoutTitle}</p>
          </div>
          <div className="image-grid">
            {images.images?.map((img, index) => (
              <div key={index} className="image-item">
                <div className="image-preview">
                  {img.src !== "No SRC" ? (
                    <img src={img.src} alt={img.alt} width="70px" height="70px"/>
                  ) : (
                    <div className="no-image">No Preview</div>
                  )}
                  <p>
                    {img.width} x {img.height}px
                  </p>
                </div>
                <div className="image-details">
                  <p>
                    <strong>URL:</strong> {img.src}
                  </p>
                  <p>
                    <strong>ALT:</strong> {img.alt}
                  </p>
                  <p>
                    <strong>Title:</strong> {img.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Images;
