import React, { useEffect, useState, useCallback } from 'react';

const Home = ({ language, cvData }) => {
  const [timelineItems, setTimelineItems] = useState([]);
  const [competences, setCompetences] = useState([]);

  // Fonction pour extraire et trier les éléments de la frise chronologique
  const extractAndSortTimelineItems = useCallback(() => {
    if (!cvData) return;

    const diplomas = cvData.formation[0].diplome.map(diplome => ({
      type: 'formation',
      title: diplome.int[0][language][0],
      date: diplome.date[0],
      lieu: diplome.lieu[0][language][0],
      sortDate: parseDate(diplome.date[0])
    }));

    const experiences = cvData.experiences[0].exp.map(exp => ({
      type: 'experience',
      title: exp.int[0][language][0],
      date: exp.date[0],
      lieu: exp.lieu[0][language][0],
      sortDate: parseDate(exp.date[0])
    }));

    const allItems = [...diplomas, ...experiences].sort((a, b) => a.sortDate - b.sortDate);
    setTimelineItems(allItems);
  }, [language, cvData]);

  const parseDate = (dateStr) => {
    const [startDate] = dateStr.split(' - ');
    const [month, year] = startDate.split('/');
    return parseInt(year + month.padStart(2, '0'), 10);
  };

  // Fonction pour extraire les compétences
  const extractCompetences = useCallback(() => {
    if (!cvData) return;

    const competencesData = [];

    // Extraire les langues
    const langues = {
      category: language === 'fr' ? 'Langues' : 'Languages',
      skills: cvData.langues[0].lang.map(lang => ({
        name: lang.l[0][language][0],
        level: lang.niveau[0][language][0]
      })),
      link: '#languages'
    };

    // Ajouter les langues à la liste des compétences
    competencesData.push(langues);

    // Extraire les autres compétences
    const categories = cvData.competences[0].categorie.map(categorie => {
      const compSkills = (categorie.comp || [])
        .map(comp => ({
          name: comp.name[0][language][0],
          level: comp.niv[0]
        }))
        .sort((a, b) => b.level - a.level);

      const coursSkills = (categorie.cours || [])
        .map(cours => ({
          name: cours.name[0][language][0],
          level: cours.niv[0]
        }))
        .sort((a, b) => b.level - a.level);

      const skills = [...compSkills, ...coursSkills];

      return {
        category: categorie.ti[0][language][0],
        skills: skills,
        link: `#${categorie.ti[0][language][0].toLowerCase().replace(/\s+/g, '-')}`
      };
    });

    competencesData.push(...categories);
    setCompetences(competencesData);
  }, [language, cvData]);

  // Utiliser les données de `cvData` pour extraire les informations lors du changement de langue ou des données
  useEffect(() => {
    extractAndSortTimelineItems();
    extractCompetences();
  }, [extractAndSortTimelineItems, extractCompetences]);

  if (!cvData) return <div>Loading...</div>;

  return (
    <div className="home">
      {/* Section Présentation */}
      <section className="presentation">
        <div className="presentation-container">
          <img className="profile-photo" src="" alt="Profile" />
          <p className="nom">{cvData.profil[0].nom}</p>
          <p className="titre">{language === 'fr' ? cvData.profil[0].titre[0].fr[0] : cvData.profil[0].titre[0].en[0]}</p>
          <p className="presentation-description">{language === 'fr' ? cvData.profil[0].description[0].fr[0] : cvData.profil[0].description[0].en[0]}</p>
        </div>
      </section>

      {/* Section Frise Chronologique */}
      <section className="timeline">
        <h3>{language === 'fr' ? 'Frise Chronologique' : 'Timeline'}</h3>
        <div className="timeline-content">
          {timelineItems.map((item, index) => (
            <div className="timeline-item" key={index}>
              <h4>
                {item.title} ({item.date})
              </h4>
              <p>{item.lieu}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section Compétences */}
      <section className="competence-carousel">
        <h3>{language === 'fr' ? 'Compétences' : 'Skills'}</h3>
        <div className="competence-content">
          {competences.map((comp, index) => (
            <div className="competence-item" key={index}>
              <h4>{comp.category}</h4>
              <ul>
                {comp.skills.map((skill, idx) => (
                  <li key={idx}>{skill.name}</li>
                ))}
              </ul>
              <a href={comp.link} className="details-button">
                {language === 'fr' ? 'Plus de détails' : 'More details'}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
