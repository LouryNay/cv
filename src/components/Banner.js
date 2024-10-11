import React from 'react';
import { Link } from 'react-router-dom';
import './Banner.css'; // Fichier CSS pour styliser la bannière

const Banner = ({ changeLanguage }) => {
    return (
        <div className="banner">
            <nav className="navbar">
                <Link to="/" className="nav-link">Accueil</Link>
                <Link to="/competences" className="nav-link">Compétences</Link>
                <Link to="/formations" className="nav-link">Formations</Link>
                <Link to="/experiences" className="nav-link">Expériences</Link>
                <Link to="/autres" className="nav-link">Autres</Link>
            </nav>
            <div className="banner-buttons">
                <button className="contact-button">Contact</button>
                <button className="download-button">Télécharger le CV</button>
                <div className="language-selector">
                    <button onClick={() => changeLanguage('fr')}>Français</button>
                    <button onClick={() => changeLanguage('en')}>English</button>
                </div>
            </div>
        </div>
    );
};

export default Banner;
