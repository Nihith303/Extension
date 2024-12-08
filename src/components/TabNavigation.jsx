// import React from "react";
// import "./TabNavigation.css";

// const TabNavigation = ({ activeTab, setActiveTab }) => (
//   <div className="tabs">
//     <button
//       className={`tab-button ${activeTab === "summary" ? "active" : ""}`}
//       onClick={() => setActiveTab("summary")}
//     >
//       Summary
//     </button>
//     <button
//       className={`tab-button ${activeTab === "links" ? "active" : ""}`}
//       onClick={() => setActiveTab("links")}
//     >
//       Links
//     </button>
//   </div>
// );

// export default TabNavigation;

import React from "react";
import "./TabNavigation.css";

const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div className="tabs">
    <button
      className={`tab-button ${activeTab === "summary" ? "active" : ""}`}
      onClick={() => setActiveTab("summary")}
    >
      Summary
    </button>
    <button
      className={`tab-button ${activeTab === "links" ? "active" : ""}`}
      onClick={() => setActiveTab("links")}
    >
      Links
    </button>
    <button
      className={`tab-button ${activeTab === "images" ? "active" : ""}`}
      onClick={() => setActiveTab("images")}
    >
      Images
    </button>
  </div>
);

export default TabNavigation;
