import React, { useEffect, useState } from "react";
import "./Summary.css";

const Summary = () => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsiteInfo = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tabId = tab.id;

      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: () => {
            const meta = (name) =>
              document.querySelector(`meta[name="${name}"]`)?.content;
            const robotsMeta =
              document.querySelector('meta[name="robots"]')?.content ||
              "Not Available";
            const xRobotsMeta =
              document.querySelector('meta[http-equiv="X-Robots-Tag"]')
                ?.content || "Not Available";
            const lang = document.documentElement.lang || "Not Available";

            return {
              title: document.title,
              description: meta("description") || "Not Available",
              canonical:
                document.querySelector('link[rel="canonical"]')?.href ||
                "Not Available",
              robots: robotsMeta,
              xRobots: xRobotsMeta,
              lang: lang,
              url: window.location.href,
            };
          },
        },
        ([result]) => {
          const fetchedData = result.result;
          setInfo(fetchedData);
          setLoading(false);
        }
      );
    };

    fetchWebsiteInfo();
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
