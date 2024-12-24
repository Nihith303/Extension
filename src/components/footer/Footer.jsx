import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          For better results, visualization, and automated SEO <br /> audit of
          your website, visit Digispot-AI.
        </p>
        <a
          href="https://digispot.ai"
          id="mainlink"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="footer-button">
            <img src="image/icon16.png" alt="digispot.ai logo" id="logo" />
            Digispot-AI
          </div>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
