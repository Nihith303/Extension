import React, { useEffect, useState } from "react";
import { fetchWebsiteInfo } from "../utils/fetchWebsiteInfo";
import "./Summary.css";

const InfoRow = ({ label, value, valid, message }) => (
  <p className={valid ? "valid" : "invalid"}>
    <span>
      <strong>{label}</strong>
    </span>
    <span>:</span>
    <span> {value}</span>
    {valid ? (
      <span className="status green">✔️</span>
    ) : (
      <span className="status red" title={message}>
        ❌
      </span>
    )}
  </p>
);

const content_val = {
  Title: "Have a title tag of optimal length (between 50 and 60 characters).",
  Description:
    "Have a description tag of optimal length (150 to 160 characters).",
  Canonical:
    "Search engines have a limited budget for crawling and indexing websites, Canonical tags help save time by indicating which URL to index.",
  Language:
    "This HTML attribute is used by various programs, search engines included, to help figure out what language the page is written in. This is helpful when trying to match the right content to the right user.",
  "Robots Meta":
    "A robots meta tag is an HTML snippet that tells search engines how to interact with a page, including how to index and display it in search results.",
  "X-Robots Meta":
    "X-robots meta tag is useful for controlling how search engines index and crawl non-HTML files, like images, PDFs, and other multimedia content.",
};

const Summary = () => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const data = await fetchWebsiteInfo();
        setInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getInfo();
  }, []);

  const checkValidity = (label, value) => {
    switch (label) {
      case "Title":
        return {
          valid: value && value.length >= 50 && value.length <= 60,
          message: content_val.Title,
        };
      case "Description":
        return {
          valid: value && value.length >= 150 && value.length <= 160,
          message: content_val.Description,
        };
      default:
        return {
          valid: value && value !== "Not Available",
          message: content_val[label] || "No information available.",
        };
    }
  };

  return (
    <div className="active-tab-container">
      {loading ? (
        <i className="loader --1"></i>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        <div className="info">
          {Object.entries({
            Title: info.title,
            Description: info.description,
            Canonical: info.canonical,
            URL: info.url,
            Language: info.lang,
            "Robots Meta": info.robots,
            "X-Robots Meta": info.xRobots,
          }).map(([label, value]) => {
            const { valid, message } = checkValidity(label, value);
            return (
              <InfoRow
                key={label}
                label={label}
                value={value}
                valid={valid}
                message={message}
              />
            );
          })}
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

// Using Chrome Storage.
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
