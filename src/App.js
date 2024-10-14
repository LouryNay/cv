import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import xml2js from 'xml2js';
import xmlFile from './cv.xml';
import Home from './components/Home';
import Competences from './components/Competences';
import Formations from './components/Formations';
import Experiences from './components/Experiences';
import Autres from './components/Autres';
import Banner from './components/Banner';
import './App.css';

const App = () => {
    const [language, setLanguage] = useState('fr');
    const [cvData, setCvData] = useState(null);

    const changeLanguage = (lang) => {
        setLanguage(lang);
    };

    useEffect(() => {
        fetch(xmlFile)
            .then(response => response.text())
            .then(str => xml2js.parseStringPromise(str))
            .then(result => {
                console.log('Parsed XML:', result);
                if (result && result.cv) {
                    setCvData(result.cv);
                }
            })
            .catch(error => console.error('Erreur lors du chargement du fichier XML:', error));
    }, []);

    if (!cvData) return <div>Loading...</div>;

    return (
        <Router>
            <div className="App">
                <Banner language={language} changeLanguage={changeLanguage} />
                <Routes>
                    <Route path="/cv" element={<Home language={language} cvData={cvData} />} />
                    <Route path="/cv/competences" element={<Competences language={language} cvData={cvData} />} />
                    <Route path="/cv/formations" element={<Formations language={language} cvData={cvData} />} />
                    <Route path="/cv/experiences" element={<Experiences language={language} cvData={cvData} />} />
                    <Route path="/cv/autres" element={<Autres language={language} cvData={cvData} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;