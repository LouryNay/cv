import React from 'react';
import cvData from './../cv.xml';

const Formations = ({ language }) => {
  const formations = cvData.formation.diplome.map((diplome, index) => (
    <div key={index}>
      <h3>{language === 'fr' ? diplome.int.fr : diplome.int.en}</h3>
      <p>{diplome.date}</p>
      <p>{language === 'fr' ? diplome.lieu.fr : diplome.lieu.en}</p>
      <p>{language === 'fr' ? diplome.parcours.fr : diplome.parcours.en}</p>
      <ul>
        {diplome.projets.projet && diplome.projets.projet.map((projet, i) => (
          <li key={i}>{language === 'fr' ? projet.fr : projet.en}</li>
        ))}
      </ul>
    </div>
  ));

  return (
    <div>
      <h2>{language === 'fr' ? 'Formations' : 'Education'}</h2>
      {formations}
    </div>
  );
};

export default Formations;
