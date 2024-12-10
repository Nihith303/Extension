import React, { useState } from "react";
import TabNavigation from "./components/TabNavigation";
import Summary from "./tabs/summary/Summary";
import Links from "./tabs/links/Links";
import Images from "./tabs/imagestab/Images";
import Header from "./tabs/header/Header"; 
import Schema from "./tabs/schema/Schema";

const App = () => {
  const [activeTab, setActiveTab] = useState("summary"); 

  return (
    <div>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "summary" && <Summary />}
      {activeTab === "links" && <Links />}
      {activeTab === "images" && <Images />}
      {activeTab === "headers" && <Header />} 
      {activeTab === "schema" && <Schema />}
    </div>
  );
};

export default App;
