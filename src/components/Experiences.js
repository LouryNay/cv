import React, { useEffect, useState, useCallback, useRef } from 'react';
import './Experiences.css';

const Experiences = ({ cvData, language }) => {
  const [experiences, setExperiences] = useState([]);
  const [openExperiences, setOpenExperiences] = useState({}); 
  const categoriesRefs = useRef({});

  const parseDate = (dateStr) => {
    const [startDate] = dateStr.split(' - ');
    const [month, year] = startDate.split('/');
    return parseInt(year + month.padStart(2, '0'), 10);
  };

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
      // Vérifier si la section correspond à un élément avec des détails
      const index = experiences.findIndex(exp => normalizeString(exp.title.toLowerCase().replace(/\s+/g, '-')) === section);
      
      if (index !== -1) {
        // Vérifier si l'élément a des détails avant de tenter de les ouvrir
        const experience = experiences[index];
        if (experience.missions.length > 0 || experience.projets.length > 0) {
          toggleDetails(index); // Ouvre les détails du diplôme ou de l'expérience si des détails existent
        }
      }
  
      const target = categoriesRefs.current[section];
      if (target) {
        // Récupère la hauteur de la bannière
        const headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
  
        // Utilise scrollTo pour ajuster la position
        window.scrollTo({
          top: target.offsetTop - headerHeight, // Ajuste la position en fonction de la hauteur de la bannière
          behavior: 'smooth', // Défilement doux
        });
      }
    }
  },[experiences]);
  

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
    if (experiences.length > 0) {
      setTimeout(scrollToSection, 100); // Délai de 100 ms pour laisser le temps au rendu
    }
  }, [experiences, scrollToSection]);


  // Fonction pour extraire les diplômes
  const extractExperiences = useCallback(() => {
    if (!cvData) return;

    const experiences = cvData.experiences[0].exp.map(experience => ({
      type: 'experience',
      title: experience.int?.[0]?.[language]?.[0] || '',
      date: experience.date?.[0] || '',
      lieu: experience.lieu?.[0]?.[language]?.[0] || '',
      liste: experience.liste?.[0]?.l?.map(l => ({
        item: l[language]?.[0] || ''
      })) || [],
      missions: experience.desc?.[0]?.mission?.map(mission => ({
        mission: mission[language]?.[0] || ''
      })) || [],
      projets: experience.projets?.[0]?.projet?.map(projet => ({
        projet: projet[language]?.[0] || ''
      })) || [],
      sortDate: parseDate(experience.date?.[0] || '')
    }));

    setExperiences(experiences);
  }, [language, cvData]);

  // Fonction pour basculer l'état de visibilité des détails
  const toggleDetails = (index) => {
    setOpenExperiences(prevState => ({
      ...prevState,
      [index]: !prevState[index] // Basculer l'état pour le diplôme sélectionné
    }));
  };

  useEffect(() => {
    extractExperiences();
  }, [extractExperiences]);


  if (!cvData) return <div>Loading...</div>;


  return (
    <section className="experiences">
      <div className="expe">
        {experiences.map((experience, index) => (
          <div key={index} className="experience-item"
          ref={el => {
            const normalizedId = normalizeString(experience.title.toLowerCase().replace(/\s+/g, '-'));
            categoriesRefs.current[normalizedId] = el; // Référence pour chaque catégorie
          }}>
            <h3 className="experience-title">{experience.title}</h3>
            <p className="experience-date">{experience.date}</p>

            {experience.lieu ? (
              <p className="experience-lieu">{experience.lieu}</p>
            ) : (
              <ul className="job">
                {experience.liste.map((l, idx) => (
                  <li key={idx}>{l.item}</li>
                ))}
              </ul>
            )}

            {/* Affichage conditionnel des détails */}
            {openExperiences[index] && (
              <div className="experience-details">
                {experience.missions.length > 0 && (
                  <div className="experience-missions">
                    <strong>Missions :</strong>
                    <ul>
                      {experience.missions.map((mission, idx) => (
                        <li key={idx}>{mission.mission}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {experience.projets.length > 0 && (
                  <div className="experience-projets">
                    <strong>Projets :</strong>
                    <ul>
                      {experience.projets.map((projet, idx) => (
                        <li key={idx}>{projet.projet}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Bouton pour étendre/réduire */}
            {(experience.missions.length > 0 || experience.projets.length > 0) && (
              <button
                onClick={() => toggleDetails(index)}
                className="toggle-details-button"
              >
                {openExperiences[index] ? '▲' : '▼'}
              </button>
            )}


          </div>
        ))}
      </div>
    </section>
  );
};

export default Experiences;