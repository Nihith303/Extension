// import React, { useState } from "react";
// import TabNavigation from "./components/navigator/TabNavigation";
// import Summary from "./tabs/summary/Summary";
// import Links from "./tabs/links/Links";
// import Images from "./tabs/imagestab/Images";
// import Header from "./tabs/header/Header"; 
// import Schema from "./tabs/schema/Schema";
// import PageSpeedTest from "./tabs/pagespeed/PageSpeed";
// import Footer from "./components/footer/Footer";

// const App = () => {
//   const [activeTab, setActiveTab] = useState("summary"); 

//   return (
//     <div>
//       <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

//       {activeTab === "summary" && <Summary />}
//       {activeTab === "links" && <Links />}
//       {activeTab === "images" && <Images />}
//       {activeTab === "headers" && <Header />} 
//       {activeTab === "schema" && <Schema />}
//       {activeTab === "pagespeedtest" && <PageSpeedTest />}

//       <div><Footer /></div>
//     </div>
//   );
// };

// export default App;










import React, { useState } from "react";
import TabNavigation from "./components/navigator/TabNavigation";
import Summary from "./tabs/summary/Summary";
import Links from "./tabs/links/Links";
import Images from "./tabs/imagestab/Images";
import Header from "./tabs/header/Header";
import Schema from "./tabs/schema/Schema";
import PageSpeedTest from "./tabs/pagespeed/PageSpeed";
import Footer from "./components/footer/Footer";
import "./App.css"; // Add this for layout styling

const App = () => {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="app-container">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
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
