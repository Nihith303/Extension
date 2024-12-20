// import React, { useEffect, useState, useRef } from "react";
// import { fetchWebsiteInfo } from "../../tabs/utils/fetchWebsiteInfo";
// import { fetchLinks } from "../../tabs/utils/fetchLinks";
// import { fetchImages } from "../../tabs/utils/fetchImages";
// import { fetchHeaders } from "../../tabs/utils/fetchHeaders";
// import { fetchSchemas } from "../../tabs/utils/fetchSchema";
// import { renderGraph } from "../../tabs/utils/renderGraph";
// import { buildGraphData } from "../../tabs/utils/buildGraph";
// // import { downloadGraphAsPng } from "../../tabs/utils/downloadGraphAsPng";
// import { addMetaLinksDetails } from "./utils/addMetaLinksDetails";
// import { addLinksDetails } from "./utils/addLinksDetails";
// import { addImageDetails } from "./utils/addImageDetails";
// import { addHeaderDetails } from "./utils/addHeaderDetails";
// import { Canvg } from "canvg";
// import "./Download.css";

// const DownloadPdf = () => {
//   const [info, setInfo] = useState({});
//   const [links, setLinks] = useState({});
//   const [images, setImages] = useState({});
//   const [headers, setHeaders] = useState({ headers: [], counts: {} });
//   const [schemas, setSchemas] = useState([]);
//   const [isDragEnabled, setIsDragEnabled] = useState(true);
//   const graphRef = useRef(null);
//   const simulationRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [dataLoaded, setDataLoaded] = useState(false); // Track data loading state

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const [tab] = await chrome.tabs.query({
//           active: true,
//           currentWindow: true,
//         });
//         const tabId = tab.id;

//         const [websiteInfo, linksData, imagesData, headersData] =
//           await Promise.all([
//             fetchWebsiteInfo(),
//             fetchLinks(),
//             fetchImages(tabId),
//             fetchHeaders(tabId),
//             fetchSchemas(setSchemas),
//           ]);
//         setInfo(websiteInfo);
//         setLinks(linksData);
//         setImages(imagesData);
//         setHeaders(headersData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//         //console.log(schemas);
//         setDataLoaded(true); // Set dataLoaded to true after the data is fetched
//       }
//     };
//     getData();
//   }, []);

//   useEffect(() => {
//     if (dataLoaded && schemas && Array.isArray(schemas) && schemas.length > 0) {
//       //console.log(schemas);
//       const graphData = buildGraphData(schemas);
//       //console.log(graphData);
//       renderGraph(
//         graphRef,
//         graphData,
//         100,
//         12,
//         10,
//         isDragEnabled,
//         simulationRef,
//         40,
//         40
//       );
//       console.log(graphRef.current);
//     }
//   }, [dataLoaded, schemas]); // Only run this effect when dataLoaded and schemas are ready

//   const downloadPdf = async () => {
//     console.log("Running Download PDF");
//     const jsPDF = (await import("jspdf")).jsPDF;
//     const doc = new jsPDF();

//     // Title of the Report
//     doc.setFontSize(16);
//     doc.text("Website SEO Report", 105, 10, { align: "center" });

//     let yPosition = 20;

//     const metaLinks = [
//       { label: "Title", value: info.title },
//       { label: "Description", value: info.description },
//       { label: "Canonical", value: info.canonical },
//       { label: "URL", value: info.url },
//       { label: "Language", value: info.lang },
//       { label: "Robots Meta", value: info.robots },
//       { label: "X-Robots Meta", value: info.xRobots },
//     ];
//     yPosition = addMetaLinksDetails(doc, metaLinks, yPosition);

//     yPosition += 10;
//     yPosition = addLinksDetails(doc, links, yPosition);

//     yPosition += 10;
//     yPosition = addImageDetails(doc, images, yPosition);

//     yPosition += 10;
//     yPosition = addHeaderDetails(doc, headers, yPosition);

//     // Add the graph image (SVG) to the PDF
//     console.log(graphRef.current);
//     // Using Canvas
//     if (graphRef.current) {
//       const svgElement = graphRef.current;
//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");

//       // Initialize Canvg with the canvas and SVG content
//       const v = await Canvg.from(canvas, svgElement.outerHTML);
//       await v.render(); // Render the SVG content onto the canvas

//       canvas.toBlob((blob) => {
//         const img = new Image();
//         img.src = URL.createObjectURL(blob);

//         img.onload = () => {
//           doc.addImage(img, "PNG", 10, yPosition, 180, 100);
//           doc.save(
//             `Digispot.AI SEOAudit report-${info.title || "Website"}.pdf`
//           );
//         };
//       });
//     }
//     // Using Xml.
//     // if (graphRef) {
//     //   const svgElement = graphRef.current;
//     //   const svgData = new XMLSerializer().serializeToString(svgElement);
//     //   console.log(svgData);
//     //   const img = new Image();
//     //   const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
//     //   const url = URL.createObjectURL(svgBlob);
//     //   img.src = url;
//     //   console.log(img);
//     //   console.log("In side svg to img");
//     //   img.onload = () => {
//     //     doc.addImage(img, "PNG", 10, yPosition, 180, 100);
//     //     doc.save(`Digispot.AI SEOAudit report-${info.title || "Website"}.pdf`);
//     //     // console.log("Complete Download");
//     //   };
//     //   img.onerror = (error) => {
//     //     console.error("Error loading the SVG as an image:", error);
//     //     doc.save(`Digispot.AI SEOAudit report-${info.title || "Website"}.pdf`);
//     //   };
//     // }
//     else {
//       doc.save(`Digispot.AI SEOAudit report-${info.title || "Website"}.pdf`);
//     }
//   };

//   return (
//     <div className="tabs" id="downloadpdf">
//       <div ref={graphRef} id="noref"></div>
//       <button className="tab-button" onClick={downloadPdf} id="downloadbutton">
//         Download as PDF
//       </button>
//     </div>
//   );
// };

// export default DownloadPdf;

// import React, { useEffect, useState, useRef } from "react";
// import { fetchWebsiteInfo } from "../../tabs/utils/fetchWebsiteInfo";
// import { fetchLinks } from "../../tabs/utils/fetchLinks";
// import { fetchImages } from "../../tabs/utils/fetchImages";
// import { fetchHeaders } from "../../tabs/utils/fetchHeaders";
// import { fetchSchemas } from "../../tabs/utils/fetchSchema";
// import { renderGraph } from "../../tabs/utils/renderGraph";
// import { buildGraphData } from "../../tabs/utils/buildGraph";
// // import { downloadGraphAsPng } from "../../tabs/utils/downloadGraphAsPng";
// import { addMetaLinksDetails } from "./utils/addMetaLinksDetails";
// import { addLinksDetails } from "./utils/addLinksDetails";
// import { addImageDetails } from "./utils/addImageDetails";
// import { addHeaderDetails } from "./utils/addHeaderDetails";
// import "./Download.css";

// const DownloadPdf = () => {
//   const [info, setInfo] = useState({});
//   const [links, setLinks] = useState({});
//   const [images, setImages] = useState({});
//   const [headers, setHeaders] = useState({ headers: [], counts: {} });
//   const [schemas, setSchemas] = useState([]);
//   const [isDragEnabled, setIsDragEnabled] = useState(true);
//   const graphRef = useRef(null);
//   const simulationRef = useRef(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const [tab] = await chrome.tabs.query({
//           active: true,
//           currentWindow: true,
//         });
//         const tabId = tab.id;

//         const [websiteInfo, linksData, imagesData, headersData, SchemaData] =
//           await Promise.all([
//             fetchWebsiteInfo(),
//             fetchLinks(),
//             fetchImages(tabId),
//             fetchHeaders(tabId),
//             fetchSchemas(),
//           ]);
//         setSchemas(SchemaData);
//         setInfo(websiteInfo);
//         setLinks(linksData);
//         setImages(imagesData);
//         setHeaders(headersData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getData();
//   }, []);

//   useEffect(() => {
//     if (schemas && Array.isArray(schemas) && schemas.length > 0) {
//       const graphData = buildGraphData(schemas);
//       renderGraph(
//         graphRef,
//         graphData,
//         100,
//         12,
//         10,
//         isDragEnabled,
//         simulationRef
//       );
//     }
//   }, [schemas]);

//   const downloadPdf = async () => {
//     const jsPDF = (await import("jspdf")).jsPDF;
//     const doc = new jsPDF();

//     // Title of the Report
//     doc.setFontSize(16);
//     doc.text("Website SEO Report", 105, 10, { align: "center" });

//     let yPosition = 20;

//     const metaLinks = [
//       { label: "Title", value: info.title },
//       { label: "Description", value: info.description },
//       { label: "Canonical", value: info.canonical },
//       { label: "URL", value: info.url },
//       { label: "Language", value: info.lang },
//       { label: "Robots Meta", value: info.robots },
//       { label: "X-Robots Meta", value: info.xRobots },
//     ];
//     yPosition = addMetaLinksDetails(doc, metaLinks, yPosition);

//     yPosition += 10;
//     yPosition = addLinksDetails(doc, links, yPosition);

//     yPosition += 10;
//     yPosition = addImageDetails(doc, images, yPosition);

//     yPosition += 10;
//     yPosition = addHeaderDetails(doc, headers, yPosition);

//     // Add the graph image (SVG) to the PDF
//     if (graphRef.current) {
//       const svgElement = graphRef.current;
//       const svgData = new XMLSerializer().serializeToString(svgElement);
//       const img = new Image();
//       const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
//       const url = URL.createObjectURL(svgBlob);
//       img.src = url;

//       img.onload = () => {
//         doc.addImage(img, "PNG", 10, yPosition, 180, 100);
//         doc.save(`Digispot.AI SEOAudit report-${info.title || "Website"}.pdf`);
//       };
//     } else {
//       doc.save(`Digispot.AI SEOAudit report-${info.title || "Website"}.pdf`);
//     }
//   };

//   return (
//     <div className="tabs" id="downloadpdf">
//       <button className="tab-button" onClick={downloadPdf} id="downloadbutton">
//         Download as PDF
//       </button>
//     </div>
//   );
// };

// export default DownloadPdf;

import React, { useEffect, useState } from "react";
import { fetchWebsiteInfo } from "../../tabs/utils/fetchWebsiteInfo";
import { fetchLinks } from "../../tabs/utils/fetchLinks";
import { fetchImages } from "../../tabs/utils/fetchImages";
import { fetchHeaders } from "../../tabs/utils/fetchHeaders";
import { addMetaLinksDetails } from "./utils/addMetaLinksDetails";
import { addLinksDetails } from "./utils/addLinksDetails";
import { addImageDetails } from "./utils/addImageDetails";
import { addHeaderDetails } from "./utils/addHeaderDetails";
import "./Download.css";

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
