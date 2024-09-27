import React, { useState } from 'react';
import Competences from './components/Competences';
import Formations from './components/Formations';
import Experiences from './components/Experiences';
import Autres from './components/Autres';


const App = () => {
  const [language, setLanguage] = useState('fr'); // Gestion du changement de langue
  const [page, setPage] = useState('accueil'); // Navigation

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const renderContent = () => {
    switch (page) {
      case 'competences':
        return <Competences language={language} />;
      case 'formations':
        return <Formations language={language} />;
      case 'experiences':
        return <Experiences language={language} />;
      case 'autres':
        return <Autres language={language} />;
      default:
        return (
          <div>
            <h1>{language === 'fr' ? 'Accueil' : 'Home'}</h1>
            <p>{language === 'fr' ? 'Bienvenue sur mon CV interactif' : 'Welcome to my interactive CV'}</p>
          </div>
        );
    }
  };

  return (
    <div>
      <header>
        <nav>
          <ul>
            <li onClick={() => setPage('accueil')}>{language === 'fr' ? 'Accueil' : 'Home'}</li>
            <li onClick={() => setPage('competences')}>{language === 'fr' ? 'Compétences' : 'Skills'}</li>
            <li onClick={() => setPage('formations')}>{language === 'fr' ? 'Formations' : 'Education'}</li>
            <li onClick={() => setPage('experiences')}>{language === 'fr' ? 'Expériences' : 'Experiences'}</li>
            <li onClick={() => setPage('autres')}>{language === 'fr' ? 'Autres' : 'Others'}</li>
          </ul>
        </nav>
        <div>
          <button onClick={() => changeLanguage('fr')}>FR</button>
          <button onClick={() => changeLanguage('en')}>EN</button>
        </div>
      </header>
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
