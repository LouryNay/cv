import React from 'react';
import cvData from './../cv.xml';

const Autres = ({ language }) => {
  return (
    <div>
      <h2>{language === 'fr' ? 'Autres' : 'Others'}</h2>
      <p>{language === 'fr' ? 'Information additionnelle' : 'Additional information'}</p>
      {/* Ajoute ici les autres sections du XML si nécessaire */}
    </div>
  );
};

export default Autres;
