import React, { useEffect, useState } from "react";
import "./Download.css";
import { fetchWebsiteInfo } from "../../tabs/utils/fetchWebsiteInfo";

const DownloadPdf = () => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const data = await fetchWebsiteInfo();
        setInfo(data);
      } catch (error) {
        console.error("Error fetching website info:", error);
      } finally {
        setLoading(false);
      }
    };

    getInfo();
  }, []);

  // Function to download the data as PDF
  const downloadPdf = async () => {
    const jsPDF = (await import("jspdf")).jsPDF;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Website Summary Report", 105, 10, { align: "center" });
    const summaryData = [
      { label: "Title", value: info.title },
      { label: "Description", value: info.description },
      { label: "Canonical", value: info.canonical },
      { label: "URL", value: info.url },
      { label: "Language", value: info.lang },
      { label: "Robots Meta", value: info.robots },
      { label: "X-Robots Meta", value: info.xRobots },
    ];
    let yPosition = 20;
    summaryData.forEach((item) => {
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
    doc.save(`${info.title}` + " website-summary.pdf");
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
