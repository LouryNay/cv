import React from 'react';
import cvData from './../cv.xml'; // Assure-toi de convertir le fichier XML en un format que React peut lire

const Competences = ({ language }) => {
  const categories = cvData.competences.categorie.map((categorie, index) => (
    <div key={index}>
      <h3>{language === 'fr' ? categorie.ti.fr : categorie.ti.en}</h3>
      <ul>
        {categorie.comp && categorie.comp.map((comp, i) => (
          <li key={i}>{language === 'fr' ? comp.fr : comp.en}</li>
        ))}
        {categorie.cours && categorie.cours.map((cours, i) => (
          <li key={i}>{language === 'fr' ? cours.fr : cours.en}</li>
        ))}
      </ul>
    </div>
  ));

  return (
    <div>
      <h2>{language === 'fr' ? 'Compétences' : 'Skills'}</h2>
      {categories}
    </div>
  );
};

export default Competences;
