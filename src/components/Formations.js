import React, { useState, useCallback,useEffect } from 'react';

const Formation = ({ cvData, language }) => {
  const [diplomas, setDiplomas] = useState([]);
  const [openDiplomas, setOpenDiplomas] = useState({}); // Pour suivre les diplômes ouverts

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
  });

  if (!cvData) return <div>Loading...</div>;


  return (
    <section className="diplomas">
      {diplomas.map((diplome, index) => (
        <div key={index} className="diploma-item">
          <h3 className="diploma-title">{diplome.title}</h3>
          <p className="diploma-date">{diplome.date}</p>
          <p className="diploma-lieu">{diplome.lieu}</p>
          {diplome.parcours && <p className="diploma-parcours">{diplome.parcours}</p>}

          {/* Bouton pour étendre/réduire */}
          {(diplome.competences || diplome.projets.length > 0) && (
            <button
              onClick={() => toggleDetails(index)}
              className="toggle-details-button"
            >
              {openDiplomas[index] ? '▲' : '▼'}
            </button>
          )}

          {/* Affichage conditionnel des détails */}
          {openDiplomas[index] && (
            <div className="diploma-details">
              {diplome.competences && (
                <p className="diploma-competences">
                  <strong>Compétences :</strong> {diplome.competences}
                </p>
              )}
              {diplome.projets.length > 0 && (
                <div className="diploma-projets">
                  <strong>Projets :</strong>
                  <ul>
                    {diplome.projets.map((projet, idx) => (
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

export default Formation;
