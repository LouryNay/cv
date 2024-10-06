import React from 'react';
import { Link } from 'react-router-dom';
import './Banner.css'; // Fichier CSS pour le style de la bannière

const Banner = () => {
    return (
        <div className="banner">
            <h1>Mon CV</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/competences">Compétences</Link>
                <Link to="/formations">Formations</Link>
                <Link to="/experiences">Expériences</Link>
                <Link to="/autres">Autres</Link>
            </nav>
            <button onClick={() => { /* Ajouter la logique pour télécharger le CV en PDF */ }}>
                Télécharger mon CV
            </button>
            <div className="contact-info">
                <p>Téléphone: Votre Numéro</p>
                <p>Email: Votre Email</p>
                <p>Réseaux sociaux: Vos Réseaux</p>
            </div>
        </div>
    );
};

export default Banner;
