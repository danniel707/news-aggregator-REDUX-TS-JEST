import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram } from "@fortawesome/free-brands-svg-icons"

import './footer.styles.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <span>News Blog</span>
        <span>newsblog@gmail.com</span>
        <span>City</span>
        <span>@2024</span>
      </div>
      <div className="footer-right">
        <a 
          href="" 
          target="_blank" 
          rel="noopener noreferrer">
          <FontAwesomeIcon className="fa-instagram" icon={faInstagram} /></a>    
      </div>
    </footer>
  );
};

export default Footer;