import React, { useEffect, useState } from "react";
import { fetchWebsiteInfo } from "../utils/fetchWebsiteInfo";
import "./Summary.css";

const Summary = () => {
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

  return (
    <div className="active-tab-container">
      <h2>Summary</h2>
      {loading ? (
        <img src="image/loading.gif" alt="Loading" className="loading"></img>
      ) : (
        <div className="info">
          <p>
            <span>
              <strong>Title</strong>
            </span>
            <span>:</span>
            <span> {info.title}</span>
          </p>
          <p>
            <span>
              <strong>Description</strong>
            </span>
            <span>:</span>
            <span> {info.description}</span>
          </p>
          <p>
            <span>
              <strong>Canonical</strong>
            </span>
            <span>:</span>
            <span> {info.canonical}</span>
          </p>
          <p>
            <span>
              <strong>URL</strong>
            </span>
            <span>:</span>
            <span> {info.url}</span>
          </p>
          <p>
            <span>
              <strong>Language</strong>
            </span>
            <span>:</span>
            <span> {info.lang}</span>
          </p>
          <p>
            <span>
              <strong>Robots Meta</strong>
            </span>
            <span>:</span>
            <span> {info.robots}</span>
          </p>
          <p>
            <span>
              <strong>X-Robots Meta</strong>
            </span>
            <span>:</span>
            <span> {info.xRobots}</span>
          </p>
        </div>
      )}
      {info.url && (
        <div className="buttons">
          <button
            onClick={() => window.open(`${info.url}/sitemap.xml`, "_blank")}
          >
            Sitemap
          </button>
          <button
            onClick={() => window.open(`${info.url}/robots.txt`, "_blank")}
          >
            Robots.txt
          </button>
        </div>
      )}
    </div>
  );
};

export default Summary;

// import React, { useEffect, useState } from "react";
// import "./Summary.css";

// const Summary = () => {
//   const [info, setInfo] = useState({});
//   const [loading, setLoading] = useState(true);

//   // Fetch website info
//   useEffect(() => {
//     const fetchWebsiteInfo = async () => {
//       const [tab] = await chrome.tabs.query({
//         active: true,
//         currentWindow: true,
//       });
//       const tabId = tab.id;

//       chrome.scripting.executeScript(
//         {
//           target: { tabId },
//           func: () => {
//             const meta = (name) =>
//               document.querySelector(`meta[name="${name}"]`)?.content;
//             const robotsMeta =
//               document.querySelector('meta[name="robots"]')?.content ||
//               "Not Available";
//             const xRobotsMeta =
//               document.querySelector('meta[http-equiv="X-Robots-Tag"]')
//                 ?.content || "Not Available";
//             const lang = document.documentElement.lang || "Not Available";

//             return {
//               title: document.title,
//               description: meta("description") || "Not Available",
//               canonical:
//                 document.querySelector('link[rel="canonical"]')?.href ||
//                 "Not Available",
//               robots: robotsMeta,
//               xRobots: xRobotsMeta,
//               lang: lang,
//               url: window.location.href,
//             };
//           },
//         },
//         ([result]) => {
//           const fetchedData = result.result;
//           setInfo(fetchedData);
//           setLoading(false);
//         }
//       );
//     };

//     fetchWebsiteInfo();
//   }, []);
//   const exportToPDF = async () => {
//     const jsPDF = (await import("jspdf")).jsPDF;
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Website Summary Report", 105, 10, { align: "center" });
//     const summaryData = [
//       { label: "Title", value: info.title },
//       { label: "Description", value: info.description },
//       { label: "Canonical", value: info.canonical },
//       { label: "URL", value: info.url },
//       { label: "Language", value: info.lang },
//       { label: "Robots Meta", value: info.robots },
//       { label: "X-Robots Meta", value: info.xRobots },
//     ];
//     let yPosition = 20;
//     summaryData.forEach((item) => {
//       if (yPosition > 280) {
//         doc.addPage();
//         yPosition = 10;
//       }
//       doc.setFontSize(12);
//       doc.text(`${item.label}`, 10, yPosition);
//       doc.text(":", 40, yPosition);
//       doc.setFontSize(10);
//       const pageWidth = 140;
//       const wrappedText = doc.splitTextToSize(
//         item.value || "Not Available",
//         pageWidth
//       );

//       wrappedText.forEach((line) => {
//         if (yPosition > 280) {
//           doc.addPage();
//           yPosition = 10;
//         }
//         doc.text(line, 45, yPosition);
//         yPosition += 7;
//       });
//     });
//     doc.save(`${info.title}` + " website-summary.pdf");
//   };

//   return (
//     <div className="active-tab-container">
//       <h2>Summary</h2>
//       {loading ? (
//         <img src="image/loading.gif" alt="Loading" className="loading"></img>
//       ) : (
//         <div className="info">
//           <p>
//             <span>
//               <strong>Title</strong>
//             </span>
//             <span>:</span>
//             <span> {info.title}</span>
//           </p>
//           <p>
//             <span>
//               <strong>Description</strong>
//             </span>
//             <span>:</span>
//             <span> {info.description}</span>
//           </p>
//           <p>
//             <span>
//               <strong>Canonical</strong>
//             </span>
//             <span>:</span>
//             <span> {info.canonical}</span>
//           </p>
//           <p>
//             <span>
//               <strong>URL</strong>
//             </span>
//             <span>:</span>
//             <span> {info.url}</span>
//           </p>
//           <p>
//             <span>
//               <strong>Language</strong>
//             </span>
//             <span>:</span>
//             <span> {info.lang}</span>
//           </p>
//           <p>
//             <span>
//               <strong>Robots Meta</strong>
//             </span>
//             <span>:</span>
//             <span> {info.robots}</span>
//           </p>
//           <p>
//             <span>
//               <strong>X-Robots Meta</strong>
//             </span>
//             <span>:</span>
//             <span> {info.xRobots}</span>
//           </p>
//         </div>
//       )}
//       {info.url && (
//         <div className="buttons">
//           <button
//             onClick={() => window.open(`${info.url}/sitemap.xml`, "_blank")}
//           >
//             Sitemap
//           </button>
//           <button
//             onClick={() => window.open(`${info.url}/robots.txt`, "_blank")}
//           >
//             Robots.txt
//           </button>
//           {/* <button onClick={exportToPDF}>Export PDF</button> */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Summary;

// import React, { useEffect, useState } from "react";
// import "./Summary.css";

// const Summary = () => {
//   const [info, setInfo] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchWebsiteInfo = async () => {
//       const [tab] = await chrome.tabs.query({
//         active: true,
//         currentWindow: true,
//       });
//       const tabId = tab.id;

//       chrome.scripting.executeScript(
//         {
//           target: { tabId },
//           func: () => {
//             const meta = (name) =>
//               document.querySelector(`meta[name="${name}"]`)?.content;
//             const robotsMeta =
//               document.querySelector('meta[name="robots"]')?.content ||
//               "Not Available";
//             const xRobotsMeta =
//               document.querySelector('meta[http-equiv="X-Robots-Tag"]')
//                 ?.content || "Not Available";
//             const lang = document.documentElement.lang || "Not Available";

//             return {
//               title: document.title,
//               description: meta("description") || "Not Available",
//               canonical:
//                 document.querySelector('link[rel="canonical"]')?.href ||
//                 "Not Available",
//               robots: robotsMeta,
//               xRobots: xRobotsMeta,
//               lang: lang,
//               url: window.location.href,
//             };
//           },
//         },
//         ([result]) => {
//           const fetchedData = result.result;
//           setInfo(fetchedData);
//           setLoading(false);
//         }
//       );
//     };

//     fetchWebsiteInfo();
//   }, []);

//   return (
//     <div className="active-tab-container">
//       <h2>Summary</h2>
//       {loading ? (
//         <img src="image/loading.gif" alt="Loading" className="loading"></img>
//       ) : (
//         <div className="info">
//           <p>
//             <span>
//               <strong>Title</strong>
//             </span>
//             <span>:</span>
//             <span> {info.title}</span>
//           </p>
//           <p>
//             <span>
//               <strong>Description</strong>
//             </span>
//             <span>:</span>
//             <span> {info.description}</span>
//           </p>
//           <p>
//             <span>
//               <strong>Canonical</strong>
//             </span>
//             <span>:</span>
//             <span> {info.canonical}</span>
//           </p>
//           <p>
//             <span>
//               <strong>URL</strong>
//             </span>
//             <span>:</span>
//             <span> {info.url}</span>
//           </p>
//           <p>
//             <span>
//               <strong>Language</strong>
//             </span>
//             <span>:</span>
//             <span> {info.lang}</span>
//           </p>
//           <p>
//             <span>
//               <strong>Robots Meta</strong>
//             </span>
//             <span>:</span>
//             <span> {info.robots}</span>
//           </p>
//           <p>
//             <span>
//               <strong>X-Robots Meta</strong>
//             </span>
//             <span>:</span>
//             <span> {info.xRobots}</span>
//           </p>
//         </div>
//       )}
//       {info.url && (
//         <div className="buttons">
//           <button
//             onClick={() => window.open(`${info.url}/sitemap.xml`, "_blank")}
//           >
//             Sitemap
//           </button>
//           <button
//             onClick={() => window.open(`${info.url}/robots.txt`, "_blank")}
//           >
//             Robots.txt
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Summary;

// USing Chrome Storage.
// import React, { useEffect, useState } from "react";
// import "./Summary.css";

// const Summary = ({ data, saveData }) => {
//   const [info, setInfo] = useState(data || {});
//   const [loading, setLoading] = useState(!data);

//   useEffect(() => {
//     if (!data) {
//       const fetchWebsiteInfo = async () => {
//         const [tab] = await chrome.tabs.query({
//           active: true,
//           currentWindow: true,
//         });
//         const tabId = tab.id;

//         chrome.scripting.executeScript(
//           {
//             target: { tabId },
//             func: () => {
//               const meta = (name) =>
//                 document.querySelector(`meta[name="${name}"]`)?.content;
//               const robotsMeta =
//                 document.querySelector('meta[name="robots"]')?.content ||
//                 "Not Available";
//               const xRobotsMeta =
//                 document.querySelector('meta[http-equiv="X-Robots-Tag"]')
//                   ?.content || "Not Available";
//               const lang = document.documentElement.lang || "Not Available";

//               return {
//                 title: document.title,
//                 description: meta("description") || "Not Available",
//                 canonical:
//                   document.querySelector('link[rel="canonical"]')?.href ||
//                   "Not Available",
//                 robots: robotsMeta,
//                 xRobots: xRobotsMeta,
//                 lang: lang,
//                 url: window.location.href,
//               };
//             },
//           },
//           ([result]) => {
//             const fetchedData = result.result;
//             setInfo(fetchedData);
//             saveData(fetchedData);
//             setLoading(false);
//           }
//         );
//       };

//       fetchWebsiteInfo();
//     }
//   }, [data, saveData]);

//   return (
//     <div className="active-tab-container">
//       <h2>Summary</h2>
//       {loading ? (
//         <img src="image/loading.gif" alt="Loading" className="loading"></img>
//       ) : (
//         <div className="info">
//           <p>
//             <span>
//               <strong>Title</strong>
//             </span>
//             <span>:</span>
//             <span> {info.title}</span>
//           </p>
//           <p>
//             <span>
//               <strong>Description</strong>
//             </span>
//             <span>:</span>
//             <span> {info.description}</span>
//           </p>
//           <p>
//             <span>
//               <strong>Canonical</strong>
//             </span>
//             <span>:</span>
//             <span> {info.canonical}</span>
//           </p>
//           <p>
//             <span>
//               <strong>URL</strong>
//             </span>
//             <span>:</span>
//             <span> {info.url}</span>
//           </p>
//           <p>
//             <span>
//               <strong>Language</strong>
//             </span>
//             <span>:</span>
//             <span> {info.lang}</span>
//           </p>
//           <p>
//             <span>
//               <strong>Robots Meta</strong>
//             </span>
//             <span>:</span>
//             <span> {info.robots}</span>
//           </p>
//           <p>
//             <span>
//               <strong>X-Robots Meta</strong>
//             </span>
//             <span>:</span>
//             <span> {info.xRobots}</span>
//           </p>
//         </div>
//       )}
//       {info.url && (
//         <div className="buttons">
//           <button
//             onClick={() => window.open(`${info.url}/sitemap.xml`, "_blank")}
//           >
//             Sitemap
//           </button>
//           <button
//             onClick={() => window.open(`${info.url}/robots.txt`, "_blank")}
//           >
//             Robots.txt
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Summary;
