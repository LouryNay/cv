import React, { useEffect, useState, useCallback } from 'react';

const Experiences = ({ cvData, language }) => {
  const [experiences, setExperiences] = useState([]);
  const [openExperiences, setOpenExperiences] = useState({}); // Pour suivre les diplômes ouverts

  const parseDate = (dateStr) => {
    const [startDate] = dateStr.split(' - ');
    const [month, year] = startDate.split('/');
    return parseInt(year + month.padStart(2, '0'), 10);
  };

  // Fonction pour extraire les diplômes
  const extractExperiences = useCallback(() => {
    if (!cvData) return;
  
    const experiences = cvData.experiences[0].exp.map(experience => ({
      type: 'experience',
      title: experience.int?.[0]?.[language]?.[0] || '',
      date: experience.date?.[0] || '',
      lieu: experience.lieu?.[0]?.[language]?.[0] || '',
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
  });

  if (!cvData) return <div>Loading...</div>;


  return (
    <section className="experiences">
      {experiences.map((experience, index) => (
        <div key={index} className="experience-item">
          <h3 className="experience-title">{experience.title}</h3>
          <p className="experience-date">{experience.date}</p>
          <p className="experience-lieu">{experience.lieu}</p>

          {/* Bouton pour étendre/réduire */}
          {(experience.missions.length > 0 || experience.projets.length > 0) && (
            <button
              onClick={() => toggleDetails(index)}
              className="toggle-details-button"
            >
              {openExperiences[index] ? '▲' : '▼'}
            </button>
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
        </div>
      ))}
    </section>
  );
};

export default Experiences;