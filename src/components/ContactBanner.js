// ContactBanner.js
import React from 'react';

const ContactBanner = () => {
  return (
    <footer className="contact-banner">
      <div className="contact-info">
        <p>Tel: 0123456789</p>
        <p>Email: example@mail.com</p>
        <div className="social-links">
          <a href="https://linkedin.com">LinkedIn</a>
          <a href="https://github.com">GitHub</a>
        </div>
      </div>
      <div className="pdf-download">
        <a href="/path/to/cv.pdf" download="CV.pdf">
          Télécharger le CV en PDF
        </a>
      </div>
    </footer>
  );
};

export default ContactBanner;
