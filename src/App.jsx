import React, { useState } from "react";
import TabNavigation from "./components/navigator/TabNavigation";
import Summary from "./tabs/summary/Summary";
import Links from "./tabs/links/Links";
import Images from "./tabs/imagestab/Images";
import Header from "./tabs/header/Header";
import Schema from "./tabs/schema/Schema";
import PageSpeedTest from "./tabs/pagespeed/PageSpeed";
import Footer from "./components/footer/Footer";
import DownloadPdf from "./components/downloadpdf/Downloadpdf";
import "./App.css";

const App = () => {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="app-container">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <DownloadPdf />
      <div className="app-content">
        {activeTab === "summary" && <Summary />}
        {activeTab === "links" && <Links />}
        {activeTab === "images" && <Images />}
        {activeTab === "headers" && <Header />}
        {activeTab === "schema" && <Schema />}
        {activeTab === "pagespeedtest" && <PageSpeedTest />}
      </div>

      <Footer />
    </div>
  );
};

export default App;

// import React, { useState, useEffect } from "react";
// import TabNavigation from "./components/navigator/TabNavigation";
// import Summary from "./tabs/summary/Summary";
// import Links from "./tabs/links/Links";
// import Images from "./tabs/imagestab/Images";
// import Header from "./tabs/header/Header";
// import Schema from "./tabs/schema/Schema";
// import PageSpeedTest from "./tabs/pagespeed/PageSpeed";
// import Footer from "./components/footer/Footer";
// import "./App.css";

// const App = () => {
//   const [activeTab, setActiveTab] = useState("summary");

//   // State to track all tabs data
//   const [tabData, setTabData] = useState({
//     summary: null,
//     links: null,
//     images: null,
//     headers: null,
//     schema: null,
//     pagespeedtest: null,
//   });

//   // Load data from chrome.storage when the app is initialized
//   useEffect(() => {
//     chrome.storage.local.get(null, (data) => {
//       setTabData((prev) => ({ ...prev, ...data }));
//     });
//   }, []);

//   // Save activeTab data to chrome.storage
//   const saveTabData = (tabName, data) => {
//     setTabData((prev) => ({ ...prev, [tabName]: data }));
//     chrome.storage.local.set({ [tabName]: data });
//   };

//   return (
//     <div className="app-container">
//       <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

//       <div className="app-content">
//         {activeTab === "summary" && (
//           <Summary
//             data={tabData.summary}
//             saveData={(data) => saveTabData("summary", data)}
//           />
//         )}
//         {activeTab === "links" && (
//           <Links
//             data={tabData.links}
//             saveData={(data) => saveTabData("links", data)}
//           />
//         )}
//         {activeTab === "images" && (
//           <Images
//             data={tabData.images}
//             saveData={(data) => saveTabData("images", data)}
//           />
//         )}
//         {activeTab === "headers" && (
//           <Header
//             data={tabData.headers}
//             saveData={(data) => saveTabData("headers", data)}
//           />
//         )}
//         {activeTab === "schema" && (
//           <Schema
//             data={tabData.schema}
//             saveData={(data) => saveTabData("schema", data)}
//           />
//         )}
//         {activeTab === "pagespeedtest" && (
//           <PageSpeedTest
//             data={tabData.pagespeedtest}
//             saveData={(data) => saveTabData("pagespeedtest", data)}
//           />
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default App;
