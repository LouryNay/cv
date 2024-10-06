import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Competences from './components/Competences';
import Formations from './components/Formations';
import Experiences from './components/Experiences';
import Autres from './components/Autres';
import Banner from './components/Banner';
import './App.css'; // Ajoutez votre fichier CSS pour le style

const App = () => {
    return (
        <Router>
            <div className="App">
                <Banner />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/competences" element={<Competences />} />
                    <Route path="/formations" element={<Formations />} />
                    <Route path="/experiences" element={<Experiences />} />
                    <Route path="/autres" element={<Autres />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
