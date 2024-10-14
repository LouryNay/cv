import React from 'react';
import { Link } from 'react-router-dom';
import './Banner.css'; // Fichier CSS pour styliser la bannière

const Banner = ({ language, changeLanguage }) => {
    return (
        <div className="banner">
            <nav className="navbar">
                <Link to="/cv" className="nav-link">{language === 'fr' ? 'Accueil' : 'Home'}</Link>
                <Link to="/cv/competences" className="nav-link">{language === 'fr' ? 'Compétences' : 'Skills'}</Link>
                <Link to="/cv/formations" className="nav-link">{language === 'fr' ? 'Formations' : 'Education'}</Link>
                <Link to="/cv/experiences" className="nav-link">{language === 'fr' ? 'Expériences' : 'Experiences'}</Link>
                <Link to="/cv/autres" className="nav-link">{language === 'fr' ? 'À propos de moi' : 'About me'}</Link>
            </nav>
            <div className="banner-buttons">
                <button className="contact-button">Contact</button>
                <button className="download-button">{language === 'fr' ? 'Télécharger mon CV' : 'Download my CV'}</button>
                <div className="language-selector">
                    <button onClick={() => changeLanguage('fr')}>Français</button>
                    <button onClick={() => changeLanguage('en')}>English</button>
                </div>
            </div>
        </div>
    );
};

export default Banner;