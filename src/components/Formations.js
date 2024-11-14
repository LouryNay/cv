import React, { useState, useCallback, useEffect, useRef } from 'react';
import './Formations.css';

const Formation = ({ cvData, language }) => {
  const [diplomas, setDiplomas] = useState([]);
  const [openDiplomas, setOpenDiplomas] = useState({}); // Pour suivre les diplômes ouverts
  const categoriesRefs = useRef({});


  const normalizeString = (str) => {
    return str
      .normalize('NFD') // Décompose les caractères accentués
      .replace(/[\u0300-\u036f]/g, '') // Enlève les diacritiques
      .toLowerCase() // Met tout en minuscules
      .replace(/\s+/g, '-') // Remplace les espaces par des tirets
      .replace(/[^\w-]/g, ''); // Supprime les caractères non alphanumériques sauf les tirets
  };

  const scrollToSection = useCallback(() => {
    const hash = window.location.hash;
    const section = decodeURIComponent(hash.split('#').pop()); // Récupère la dernière partie après le dernier #
  
    if (section) {
      const target = categoriesRefs.current[section];


      if (target) {
        // Ouvre les détails de la section
        const index = diplomas.findIndex(diplome => normalizeString(diplome.title.toLowerCase().replace(/\s+/g, '-')) === section);
        if (index !== -1) {
          toggleDetails(index); // Ouvre les détails du diplôme ciblé
        }
        // Récupère la hauteur de la bannière
        const headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
  
        // Utilise scrollTo pour ajuster la position
        window.scrollTo({
          top: target.offsetTop - headerHeight, // Ajuste la position en fonction de la hauteur de la bannière
          behavior: 'smooth', // Défilement doux
        });
  
      }
    }
  }, [diplomas]);
  

  useEffect(() => {
    const handleHashChange = () => {
      scrollToSection();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [scrollToSection]);

  // Appel initial pour faire défiler vers la section si nécessaire
  useEffect(() => {
    if (diplomas.length > 0) {
      setTimeout(scrollToSection, 100); // Délai de 100 ms pour laisser le temps au rendu
    }
  }, [diplomas, scrollToSection]);

  const parseDate = (dateStr) => {
    const [startDate] = dateStr.split(' - ');
    const [month, year] = startDate.split('/');
    return parseInt(year + month.padStart(2, '0'), 10);
  };

  // Fonction pour extraire les diplômes
  const extractDiplomas = useCallback(() => {
    if (!cvData) return;

    const diplomas = cvData.formation[0].diplome.map(diplome => ({
      type: 'formation',
      title: diplome.int[0][language][0],
      date: diplome.date[0],
      lieu: diplome.lieu[0][language][0],
      parcours: diplome.parcours?.[0]?.[language]?.[0] || '',
      competences: diplome.competences?.[0]?.[language]?.[0] || '',
      projets: diplome.projets?.[0]?.projet.map(projet => ({
        projet: projet[language]?.[0] || ''
      })) || [],
      sortDate: parseDate(diplome.date[0])
    }));

    setDiplomas(diplomas);
  }, [language, cvData]);


  // Fonction pour basculer l'état de visibilité des détails
  const toggleDetails = (index) => {
    setOpenDiplomas(prevState => ({
      ...prevState,
      [index]: !prevState[index] // Basculer l'état pour le diplôme sélectionné
    }));
  };

  useEffect(() => {
    extractDiplomas();
  }, [extractDiplomas]);


  if (!cvData) return <div>Loading...</div>;


  return (
    <section className="diplomas">
      <div className="diploma">
        {diplomas.map((diplome, index) => (
          <div key={index} className="diploma-item"
          ref={el => {
            const normalizedId = normalizeString(diplome.title.toLowerCase().replace(/\s+/g, '-'));
            categoriesRefs.current[normalizedId] = el; // Référence pour chaque catégorie
          }}>
            <h3 className="diploma-title">{diplome.title}</h3>
            <p className="diploma-date">{diplome.date}</p>
            <p className="diploma-lieu">{diplome.lieu}</p>
            {diplome.parcours && <p className="diploma-parcours">{diplome.parcours}</p>}

            {/* Affichage conditionnel des détails */}
            {openDiplomas[index] && (
              <div className="diploma-details">
                {diplome.competences && (
                  <p className="diploma-competences">
                    {diplome.competences}
                  </p>
                )}
                {diplome.projets.length > 0 && (
                  <div className="diploma-projets">
                    <strong>{language === 'fr' ? 'Projets :' : 'Projects :'}</strong>
                    <ul>
                      {diplome.projets.map((projet, idx) => (
                        <li key={idx}>{projet.projet}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Bouton pour étendre/réduire */}
            {(diplome.competences || diplome.projets.length > 0) && (
              <button
                onClick={() => toggleDetails(index)}
                className="toggle-details-button"
              >
                {openDiplomas[index] ? '▲' : '▼'}
              </button>
            )}

          </div>
        ))}
      </div>
    </section>
  );
};

export default Formation;
