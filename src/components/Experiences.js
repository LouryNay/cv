import React from 'react';
import cvData from './../cv.xml';

const Experiences = ({ language }) => {
  const experiences = cvData.experiences.exp.map((exp, index) => (
    <div key={index}>
      <h3>{language === 'fr' ? exp.int.fr : exp.int.en}</h3>
      <p>{exp.date}</p>
      <p>{language === 'fr' ? exp.lieu.fr : exp.lieu.en}</p>
      <ul>
        {exp.desc.mission && exp.desc.mission.map((mission, i) => (
          <li key={i}>{language === 'fr' ? mission.fr : mission.en}</li>
        ))}
      </ul>
    </div>
  ));

  return (
    <div>
      <h2>{language === 'fr' ? 'Expériences' : 'Experiences'}</h2>
      {experiences}
    </div>
  );
};

export default Experiences;
