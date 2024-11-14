import React from 'react';
import './Contact.css';

const Contact = ({ language, cvData }) => {

  if (!cvData) return <div>Loading...</div>;

  return (
    <section className="contact">
      <div className="contact-container">
        <p className="contact-text">{cvData.contact[0].txt[0][language][0]}</p>
        <div className="contact-info">
          <h3>Contact</h3>
          <p>{cvData.contact[0].mail}</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
