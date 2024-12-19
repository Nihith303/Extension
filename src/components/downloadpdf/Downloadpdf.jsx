import React, { useEffect, useState } from "react";
import "./Download.css";
import { fetchWebsiteInfo } from "../../tabs/utils/fetchWebsiteInfo";
import { fetchLinks } from "../../tabs/utils/fetchLinks";
import { fetchImages } from "../../tabs/utils/fetchImages";
import { fetchHeaders } from "../../tabs/utils/fetchHeaders";

const DownloadPdf = () => {
  const [info, setInfo] = useState({});
  const [links, setLinks] = useState({});
  const [images, setImages] = useState({});
  const [headers, setHeaders] = useState({ headers: [], counts: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        const tabId = tab.id;

        const [websiteInfo, linksData, imagesData, headersData] =
          await Promise.all([
            fetchWebsiteInfo(),
            fetchLinks(),
            fetchImages(tabId),
            fetchHeaders(tabId),
          ]);

        setInfo(websiteInfo);
        setLinks(linksData);
        setImages(imagesData);
        setHeaders(headersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const addMetaLinksDetails = (doc, metaLinks, startPosition) => {
    doc.setFontSize(14);
    doc.text("Meta Links Data", 10, startPosition);
    let yPosition = startPosition + 10;
    metaLinks.forEach((item) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 10;
      }
      doc.setFontSize(12);
      doc.text(`${item.label}`, 10, yPosition);
      doc.text(":", 40, yPosition);
      doc.setFontSize(10);
      const pageWidth = 140;
      const wrappedText = doc.splitTextToSize(
        item.value || "Not Available",
        pageWidth
      );

      wrappedText.forEach((line) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 10;
        }
        doc.text(line, 45, yPosition);
        yPosition += 7;
      });
    });
    return yPosition;
  };

  const addLinksDetails = (doc, links, startPosition) => {
    const categories = ["internal", "external"];
    let yPosition = startPosition;
    doc.setFontSize(14);
    doc.text("Links Summary", 10, yPosition);
    yPosition += 10;

    const linkCounts = [
      { label: "Total Links", value: links.total?.length || 0 },
      { label: "Internal Links", value: links.internal?.length || 0 },
      { label: "External Links", value: links.external?.length || 0 },
      { label: "Unique Links", value: links.unique?.length || 0 },
    ];

    linkCounts.forEach(({ label, value }) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 10;
      }
      doc.setFontSize(12);
      doc.text(`${label}`, 10, yPosition);
      doc.text(":", 40, yPosition);
      doc.setFontSize(10);
      doc.text(`${value}`, 50, yPosition);
      yPosition += 7;
    });

    yPosition += 10;
    doc.setFontSize(14);
    doc.text("Links Information by Category", 10, yPosition);

    categories.forEach((category) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 10;
      }

      yPosition += 10;
      doc.setFontSize(14);
      doc.text(
        `${category.charAt(0).toUpperCase() + category.slice(1)} Links`,
        10,
        yPosition
      );
      yPosition += 10;

      links[category]?.forEach(({ href, title }, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 10;
        }
        doc.setFontSize(10);
        doc.text(`${index + 1}.`, 10, yPosition);
        doc.text("URL:", 20, yPosition);
        const urlText = doc.splitTextToSize(href, 170);
        urlText.forEach((line) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 10;
          }
          doc.text(line, 30, yPosition);
          yPosition += 7;
        });
        doc.text("Title:", 20, yPosition);
        const titleText = doc.splitTextToSize(title || "No title", 170);
        titleText.forEach((line) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 10;
          }
          doc.text(line, 30, yPosition);
          yPosition += 7;
        });
        yPosition += 5;
      });

      if (!links[category]?.length) {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 10;
        }
        doc.setFontSize(10);
        doc.text("No links available.", 10, yPosition);
        yPosition += 10;
      }
    });
    return yPosition;
  };

  const addImageDetails = (doc, images, startPosition) => {
    let yPosition = startPosition;

    doc.setFontSize(14);
    doc.text("Image Information", 10, yPosition);
    yPosition += 10;

    const imageCounts = [
      { label: "Total Images", value: images.total?.length || 0 },
      { label: "Without ALT", value: images.noAlt?.length || 0 },
      { label: "Without Desc", value: images.noLongDesc?.length || 0 },
      { label: "Without SRC", value: images.noSrc?.length || 0 },
    ];

    imageCounts.forEach(({ label, value }) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 10;
      }
      doc.setFontSize(12);
      doc.text(`${label}`, 10, yPosition);
      doc.text(":", 40, yPosition);
      doc.setFontSize(10);
      doc.text(`${value}`, 50, yPosition);
      yPosition += 7;
    });
    yPosition += 10;
    doc.setFontSize(14);
    doc.text("Image Information by Category", 10, yPosition);
    yPosition += 10;

    // Define categories and their corresponding image sets
    const categories = [
      { label: "Without ALT", data: images.noAlt || [] },
      { label: "Without SRC", data: images.noSrc || [] },
      { label: "Without Description", data: images.noLongDesc || [] },
    ];

    categories.forEach(({ label, data }) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 10;
      }

      doc.setFontSize(12);
      doc.text(label, 10, yPosition);
      yPosition += 7;

      if (data.length === 0) {
        doc.setFontSize(10);
        doc.text("No images in this category.", 20, yPosition);
        yPosition += 10;
        return;
      }

      data.forEach(({ src, alt, longDesc }, index) => {
        if (yPosition > 271) {
          doc.addPage();
          yPosition = 10;
        }

        yPosition += 5;
        doc.setFontSize(10);
        doc.text(`${index + 1}.`, 10, yPosition);
        doc.text("SRC", 20, yPosition);
        doc.text(":", 38, yPosition);
        const srcText = doc.splitTextToSize(src || "No SRC", 160);
        srcText.forEach((line) => {
          if (yPosition > 271) {
            doc.addPage();
            yPosition = 10;
          }
          doc.text(line, 40, yPosition);
          yPosition += 7;
        });

        doc.text("ALT", 20, yPosition);
        doc.text(":", 38, yPosition);
        const altText = doc.splitTextToSize(alt || "No ALT", 160);
        altText.forEach((line) => {
          if (yPosition > 271) {
            doc.addPage();
            yPosition = 10;
          }
          doc.text(line, 40, yPosition);
          yPosition += 7;
        });

        doc.text("Description", 20, yPosition);
        doc.text(":", 38, yPosition);
        const descText = doc.splitTextToSize(longDesc || "No Description", 160);
        descText.forEach((line) => {
          if (yPosition > 271) {
            doc.addPage();
            yPosition = 10;
          }
          doc.text(line, 40, yPosition);
          yPosition += 7;
        });
      });
    });

    return yPosition;
  };

  const addHeaderDetails = (doc, headersData, startPosition) => {
    let yPosition = startPosition;

    doc.setFontSize(14);
    doc.text("Headers Information", 10, yPosition);
    yPosition += 10;

    const headerCounts = headersData.counts;

    // Add header counts
    Object.entries(headerCounts).forEach(([header, count]) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 10;
      }
      doc.setFontSize(12);
      doc.text(`${header.toUpperCase()}:`, 10, yPosition);
      doc.setFontSize(10);
      doc.text(`${count}`, 40, yPosition);
      yPosition += 7;
    });

    yPosition += 10;

    // Add detailed header content with hierarchy
    doc.setFontSize(14);
    doc.text("Header Details", 10, yPosition);
    yPosition += 10;

    headersData.headers.forEach(({ tag, text }, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 10;
      }

      // Define font size based on header level
      const fontSizeMap = {
        h1: 18,
        h2: 14,
        h3: 12,
        h4: 11,
        h5: 10,
        h6: 9,
      };
      const fontSize = fontSizeMap[tag] || 10;

      doc.setFontSize(fontSize);
      doc.text(`${tag.toUpperCase()}:  `, (28 - fontSize) * 1.5, yPosition);

      const wrappedText = doc.splitTextToSize(text || "No Content", 170);
      wrappedText.forEach((line) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 10;
        }
        doc.text(line, 30, yPosition);
        yPosition += 7;
      });
      yPosition += 5;
    });

    return yPosition;
  };

  const downloadPdf = async () => {
    const jsPDF = (await import("jspdf")).jsPDF;
    const doc = new jsPDF();

    // Title of the Report.
    doc.setFontSize(16);
    doc.text("Website SEO Report", 105, 10, { align: "center" });

    let yPosition = 20;

    const metaLinks = [
      { label: "Title", value: info.title },
      { label: "Description", value: info.description },
      { label: "Canonical", value: info.canonical },
      { label: "URL", value: info.url },
      { label: "Language", value: info.lang },
      { label: "Robots Meta", value: info.robots },
      { label: "X-Robots Meta", value: info.xRobots },
    ];
    yPosition = addMetaLinksDetails(doc, metaLinks, yPosition);

    yPosition += 10;
    yPosition = addLinksDetails(doc, links, yPosition);

    yPosition += 10;
    yPosition = addImageDetails(doc, images, yPosition);

    yPosition += 10;
    yPosition = addHeaderDetails(doc, headers, yPosition);

    doc.save(`Digispot.AI SEOAudit report-${info.title || "Website"}.pdf`);
  };

  return (
    <div className="tabs" id="downloadpdf">
      <button className="tab-button" onClick={downloadPdf} id="downloadbutton">
        Download as PDF
      </button>
    </div>
  );
};

export default DownloadPdf;
