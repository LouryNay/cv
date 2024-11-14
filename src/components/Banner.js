import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';

const Banner = ({ language, changeLanguage }) => {
    const [backgroundOpacity, setBackgroundOpacity] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = 200; // Position où l'opacité est de 1
            const opacity = Math.min(scrollY / maxScroll, 1); // Limite entre 0 et 1
            setBackgroundOpacity(opacity);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className="banner"
            style={{
                backgroundColor: `rgba(0,9,62, ${backgroundOpacity})`, // Change l'opacité du fond
                boxShadow: backgroundOpacity > 0.1 ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none', // Ombre légère pour contraste
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease', // Transition pour un effet fluide
            }}
        >
            <nav className="navbar">
                <Link to="/" className="nav-link" id="home-link">
                    {language === 'fr' ? 'Accueil' : 'Home'}
                </Link>
                <Link to="/competences" className="nav-link" id="skills-link">
                    {language === 'fr' ? 'Compétences' : 'Skills'}
                </Link>
                <Link to="/formations" className="nav-link" id="education-link">
                    {language === 'fr' ? 'Formations' : 'Education'}
                </Link>
                <Link to="/experiences" className="nav-link" id="experiences-link">
                    {language === 'fr' ? 'Expériences' : 'Experiences'}
                </Link>
                <Link to="/projets" className="nav-link" id="projets-link">
                    {language === 'fr' ? 'Projets' : 'Projects'}
                </Link>
                <Link to="/autres" className="nav-link" id="about-link">
                    {language === 'fr' ? 'À propos de moi' : 'About me'}
                </Link>
            </nav>
            <div className="banner-buttons">
                <a
                    href={process.env.PUBLIC_URL + "/CV_Melina_BERTHIER.pdf"} // Chemin vers le fichier PDF dans le dossier public
                    className="download-button"
                    id="download-btn"
                    target="_blank" // Ouvre le lien dans un nouvel onglet
                    rel="noopener noreferrer" // Sécurité pour éviter les vulnérabilités
                >
                    {language === 'fr' ? 'CV' : 'Resume'}
                </a>
                <div className="language-selector">
                    <button className="language-button" onClick={() => changeLanguage('fr')}>FR</button>
                    <button className="language-button" onClick={() => changeLanguage('en')}>EN</button>
                </div>
            </div>
        </header>
    );
};

export default Banner;
