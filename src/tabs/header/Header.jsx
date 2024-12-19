import React, { useEffect, useState } from "react";
import "./Header.css";
import { fetchHeaders } from "../utils/fetchHeaders";

const Headers = () => {
  const [headers, setHeaders] = useState([]);
  const [headerCounts, setHeaderCounts] = useState({
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0,
    h6: 0,
  });

  useEffect(() => {
    const getHeaders = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        const tabId = tab.id;

        const { headers: fetchedHeaders, counts } = await fetchHeaders(tabId);
        setHeaders(fetchedHeaders);
        setHeaderCounts(counts);
      } catch (error) {
        console.error("Error fetching headers:", error);
      }
    };

    getHeaders();
  }, []);

  const isEmpty = Object.values(headerCounts).every((count) => count === 0);

  return (
    <div>
      <h2>Headers</h2>
      <div className="header-counts">
        {Object.keys(headerCounts).map((key) => (
          <div className="header-item" key={key}>
            <span>{key.toUpperCase()}</span>
            <span>{headerCounts[key] || 0}</span>
          </div>
        ))}
      </div>
      {isEmpty ? (
        <div className="no-items" id="no-headers">
          <p>No Headers Found on this Website.</p>
          <img src="image/notfound.svg" alt="Not Found" />
        </div>
      ) : (
        <div className="header-structure">
          {headers.map((header, index) => (
            <div key={index} className={`header-content header-${header.tag}`}>
              <span className="dashed-line"></span>
              <strong>
                <span className="header-tag">{header.tag}</span>
              </strong>
              <span className="header-text">{header.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Headers;

// import React, { useEffect, useState } from "react";
// import "./Header.css";

// const Headers = () => {
//   const [headers, setHeaders] = useState([]);
//   const [headerCounts, setHeaderCounts] = useState({
//     h1: 0,
//     h2: 0,
//     h3: 0,
//     h4: 0,
//     h5: 0,
//     h6: 0,
//   });

//   useEffect(() => {
//     const fetchHeaders = async () => {
//       const [tab] = await chrome.tabs.query({
//         active: true,
//         currentWindow: true,
//       });
//       const tabId = tab.id;

//       chrome.scripting.executeScript(
//         {
//           target: { tabId },
//           func: () => {
//             const headers = [];
//             const headerTags = Array.from(
//               document.querySelectorAll("h1, h2, h3, h4, h5, h6")
//             );
//             headerTags.forEach((header) => {
//               headers.push({
//                 tag: header.tagName.toLowerCase(),
//                 text: header.textContent.trim(),
//               });
//             });
//             return headers;
//           },
//         },
//         ([result]) => {
//           const fetchedHeaders = result.result || [];
//           const counts = {
//             h1: fetchedHeaders.filter((h) => h.tag === "h1").length,
//             h2: fetchedHeaders.filter((h) => h.tag === "h2").length,
//             h3: fetchedHeaders.filter((h) => h.tag === "h3").length,
//             h4: fetchedHeaders.filter((h) => h.tag === "h4").length,
//             h5: fetchedHeaders.filter((h) => h.tag === "h5").length,
//             h6: fetchedHeaders.filter((h) => h.tag === "h6").length,
//           };

//           setHeaders(fetchedHeaders);
//           setHeaderCounts(counts);
//         }
//       );
//     };

//     fetchHeaders();
//   }, []);

//   const isEmpty = Object.values(headerCounts).every((count) => count === 0);

//   return (
//     <div>
//       <h2>Headers</h2>
//       <div className="header-counts">
//         {Object.keys(headerCounts).map((key) => (
//           <div className="header-item" key={key}>
//             <span>{key.toUpperCase()}</span>
//             <span>{headerCounts[key] || 0}</span>
//           </div>
//         ))}
//       </div>
//       {isEmpty ? (
//         <div className="no-items" id="no-headers">
//           <p>No Headers Found on this Website.</p>
//           <img src="image/notfound.svg" alt="Not Found" />
//         </div>
//       ) : (
//         <div className="header-structure">
//           {headers.map((header, index) => (
//             <div key={index} className={`header-content header-${header.tag}`}>
//               <span className="dashed-line"></span>
//               <strong>
//                 <span className="header-tag">{header.tag}</span>
//               </strong>
//               <span className="header-text">{header.text}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Headers;
