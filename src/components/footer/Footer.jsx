import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          For better results, visualization, and automated SEO audit
          <br /> of your website, visit Digispot-AI.
        </p>
        <button
          className="footer-button"
          onClick={() => window.open("https://digispot.ai")}
        >
          Digispot-AI
        </button>
      </div>
    </footer>
  );
};

export default Footer;
