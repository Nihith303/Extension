import React, { useEffect, useState, useRef } from "react";
import { fetchWebsiteInfo } from "../../tabs/utils/fetchWebsiteInfo";
import { fetchLinks } from "../../tabs/utils/fetchLinks";
import { fetchImages } from "../../tabs/utils/fetchImages";
import { fetchHeaders } from "../../tabs/utils/fetchHeaders";
import { fetchSchemas } from "../../tabs/utils/fetchSchema";
import { renderGraph } from "../../tabs/utils/renderGraph";
import { buildGraphData } from "../../tabs/utils/buildGraph";
import { downloadGraphAsPdf } from "./utils/downloadGraphAspdf";
import { addMetaLinksDetails } from "./utils/addMetaLinksDetails";
import { addLinksSummary } from "./utils/addLinksDetails";
import { addLinksTable } from "./utils/addLinksTable";
import { addImageSummary } from "./utils/addImageDetails";
import { addImageTable } from "./utils/addImageTable";
import { addHeaderDetails } from "./utils/addHeaderDetails";
import "./Download.css";

const DownloadPdf = () => {
  const [info, setInfo] = useState({});
  const [links, setLinks] = useState({});
  const [images, setImages] = useState({});
  const [headers, setHeaders] = useState({ headers: [], counts: {} });
  const [schemas, setSchemas] = useState([]);
  const [isDragEnabled, setIsDragEnabled] = useState(true);
  const graphRef = useRef(null);
  const simulationRef = useRef(null);
  const [loading, setLoading] = useState(false); // Track loading state

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
            fetchSchemas(setSchemas),
          ]);
        setInfo(websiteInfo);
        setLinks(linksData);
        setImages(imagesData);
        setHeaders(headersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (schemas && Array.isArray(schemas) && schemas.length > 0) {
      const graphData = buildGraphData(schemas);
      renderGraph(
        graphRef,
        graphData,
        100,
        12,
        10,
        isDragEnabled,
        simulationRef,
        40,
        40
      );
    }
  }, [schemas]);

  const downloadPdf = async () => {
    setLoading(true); // Show loader when downloading starts
    const jsPDF = (await import("jspdf")).jsPDF;
    const doc = new jsPDF();

    let yPosition = 35;
    let pageNumber = 1;
    //doc.save("Schema.pdf");

    [yPosition, pageNumber] = addMetaLinksDetails(
      doc,
      info,
      yPosition,
      pageNumber
    );
    [yPosition, pageNumber] = addLinksSummary(
      doc,
      links,
      yPosition,
      pageNumber
    );
    [yPosition, pageNumber] = addImageSummary(
      doc,
      images,
      yPosition,
      pageNumber
    );
    [yPosition, pageNumber] = addHeaderDetails(
      doc,
      headers,
      yPosition,
      pageNumber
    );
    [yPosition, pageNumber] = addImageTable(doc, images, yPosition, pageNumber);
    [yPosition, pageNumber] = addLinksTable(doc, links, yPosition, pageNumber);
    setLoading(false);
    downloadGraphAsPdf(doc, graphRef, yPosition, info.title, pageNumber);
    // Hide loader once the download is complete
  };

  return (
    <div className="tabs" id="downloadpdf">
      <div ref={graphRef} className="noref"></div>
      <button className="tab-button" onClick={downloadPdf} id="downloadbutton">
        Download as PDF
      </button>
      <div className="noref">
        {loading && <img src="image/loading.gif" alt="Loader" />}
      </div>
    </div>
  );
};

export default DownloadPdf;
