import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">BRMBRM</span>
          <span className="footer-copyright">
            &copy; {new Date().getFullYear()} BRMBRM d.o.o.
          </span>
        </div>
        <div className="footer-links-wrapper">
          <nav className="footer-links-col">
            <Link to="/">Naslovna</Link>
            <Link to="/vozila">Ponuda vozila</Link>
            <Link to="/servis/novi">Servis</Link>
            <Link to="/about">O nama</Link>
          </nav>
          <nav className="footer-links-col">
            <Link to="/brands/audi">Audi</Link>
            <Link to="/brands/seat">Seat</Link>
            <Link to="/brands/škoda">Škoda</Link>
          </nav>
        </div>
        <div className="footer-contact">
          <span className="footer-contact-mail">info@brmbrm.hr</span>
          <span className="footer-contact-phone">+385 91 555 4444</span>
          <span className="footer-contact-address">
            Slavonija 2/2, SB
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
