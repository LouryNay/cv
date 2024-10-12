import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Competences from './components/Competences';
import Formations from './components/Formations';
import Experiences from './components/Experiences';
import Autres from './components/Autres';
import Banner from './components/Banner';
import './App.css'; // Ajoutez votre fichier CSS pour le style

const App = () => {
    const [language, setLanguage] = useState('fr'); // Langue par défaut

    const changeLanguage = (lang) => {
        setLanguage(lang);
    };

    return (
        <Router>
            <div className="App">
                <Banner language={language} changeLanguage={changeLanguage} />
                <Routes>
                  <Route path="/" element={<Home language={language} />} />
                  <Route path="*" element={<Home language={language} />} />
                  <Route path="/competences" element={<Competences language={language} />} />
                  <Route path="/formations" element={<Formations language={language} />} />
                  <Route path="/experiences" element={<Experiences language={language} />} />
                  <Route path="/autres" element={<Autres language={language} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
