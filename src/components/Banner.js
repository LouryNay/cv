import React from 'react';
import { Link } from 'react-router-dom';
import './Banner.css'; // Fichier CSS pour styliser la bannière

const Banner = ({ language, changeLanguage }) => {
    return (
        <div className="banner">
            <nav className="navbar">
                <Link to="/" className="nav-link" id="home-link">{language === 'fr' ? 'Accueil' : 'Home'}</Link>
                <Link to="/competences" className="nav-link" id="skills-link">{language === 'fr' ? 'Compétences' : 'Skills'}</Link>
                <Link to="/formations" className="nav-link" id="education-link">{language === 'fr' ? 'Formations' : 'Education'}</Link>
                <Link to="/experiences" className="nav-link" id="experiences-link">{language === 'fr' ? 'Expériences' : 'Experiences'}</Link>
                <Link to="/autres" className="nav-link" id="about-link">{language === 'fr' ? 'À propos de moi' : 'About me'}</Link>
            </nav>
            <div className="banner-buttons">
                <button className="contact-button" id="contact-btn">Contact</button>
                <button className="download-button" id="download-btn">{language === 'fr' ? 'Télécharger mon CV' : 'Download my CV'}</button>
                <div className="language-selector">
                    <button className="language-button" onClick={() => changeLanguage('fr')}>Français</button>
                    <button className="language-button" onClick={() => changeLanguage('en')}>English</button>
                </div>
            </div>
        </div>
    );
};

export default Banner;
