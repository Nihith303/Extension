// import React, { useState } from "react";
// import TabNavigation from "./components/TabNavigation";
// import Summary from "./tabs/summary/Summary";
// import Links from "./tabs/links/Links";
// import Images from "./tabs/imagestab/Images";

// const App = () => {
//   const [activeTab, setActiveTab] = useState("summary"); // Default tab: Summary

//   return (
//     <div>
//       {/* Tab Navigation */}
//       <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

//       {/* Render Active Tab */}
//       {activeTab === "summary" && <Summary />}
//       {activeTab === "links" && <Links />}
//       {activeTab === "images" && <Images />} 
//     </div>
//   );
// };

// export default App;


import React, { useState } from "react";
import TabNavigation from "./components/TabNavigation";
import Summary from "./tabs/summary/Summary";
import Links from "./tabs/links/Links";
import Images from "./tabs/imagestab/Images";
import Header from "./tabs/header/Header"; // Import the new Header tab

const App = () => {
  const [activeTab, setActiveTab] = useState("summary"); // Default tab: Summary

  return (
    <div>
      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Render Active Tab */}
      {activeTab === "summary" && <Summary />}
      {activeTab === "links" && <Links />}
      {activeTab === "images" && <Images />}
      {activeTab === "headers" && <Header />} {/* Render Header tab */}
    </div>
  );
};

export default App;
