import React, { useEffect, useState, useCallback } from 'react';
import './Home.css'; // Fichier CSS pour styliser la page d'accueil

const Home = ({ language, cvData }) => {
  const [timelineItems, setTimelineItems] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const visibleItems = 4; // Nombre de catégories à afficher par page

  const nextCompetence = () => {
    // Déplace vers la droite, sans dépasser la longueur totale
    if (currentOffset < competences.length - visibleItems) {
      setCurrentOffset((prevOffset) => prevOffset + 1);
    }
  };

  const prevCompetence = () => {
    // Déplace vers la gauche, sans tomber en dessous de zéro
    if (currentOffset > 0) {
      setCurrentOffset((prevOffset) => prevOffset - 1);
    }
  };

  const getTransformValue = () => {
    // Calcule le décalage pour centrer correctement les éléments visibles
    return `translateX(-${currentOffset * (220 + 40)}px)`;
  };

  const normalizeString = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

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

  const extractCompetences = useCallback(() => {
    if (!cvData) return;

    const competencesData = [];
    const langues = {
      category: language === 'fr' ? 'Langues' : 'Languages',
      skills: cvData.langues[0].lang.map(lang => ({
        name: lang.l[0][language][0],
        level: lang.niveau[0][language][0]
      })),
      link: '#languages'
    };
    competencesData.push(langues);

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
        link: `#${normalizeString(categorie.ti[0][language][0])}`
      };
    });

    competencesData.push(...categories);
    setCompetences(competencesData);
  }, [language, cvData]);

  useEffect(() => {
    extractAndSortTimelineItems();
    extractCompetences();
  }, [extractAndSortTimelineItems, extractCompetences]);

  if (!cvData) return <div>Loading...</div>;

  return (
    <div className="home">
      <section className="presentation">
        <div className="presentation-container" id="presentation-container">
          <img className="profile-photo" src="" alt="Profile" />
          <p className="nom">{cvData.profil[0].nom}</p>
          <p className="titre">{language === 'fr' ? cvData.profil[0].titre[0].fr[0] : cvData.profil[0].titre[0].en[0]}</p>
          <p className="presentation-description">{language === 'fr' ? cvData.profil[0].description[0].fr[0] : cvData.profil[0].description[0].en[0]}</p>
        </div>
      </section>

      <section className="timeline" id="timeline">
        <div className="arrow-timeline">
          <svg className="arrow" viewBox="0 0 44 100">
            <polygon points="1,20 1,80 40,80, 40,20 1,20"
              style={{ fill: 'rgba(212, 160, 23, 0.15)', stroke: '#D4A017', strokeWidth: 0.7 }} />
          </svg>
          {timelineItems.map((item, index) => (
            <div className={`section ${item.type === 'formation' ? 'timeline-formation' : 'timeline-experience'}`} key={index}>
              <div className="content">
                <h4 className="timeline-item-title">
                  {item.title}<br></br>({item.date})
                </h4>
                <p className="timeline-item-lieu">{item.lieu}</p>
                <button className="details-button">Détails</button>
              </div>
            </div>
          ))}
          <svg className="arrow" viewBox="0 0 44 100">
            <polygon points="1,20 1,80, 8,80 8, 99 39,50 8,1 8,20 1,20"
              style={{ fill: 'rgba(212, 160, 23, 0.15)', stroke: '#D4A017', strokeWidth: 0.7 }} />
          </svg>
        </div>
      </section>


      <section className="competence-carousel" id="competence-carousel">
        <button className="carousel-button left" onClick={prevCompetence}>
          &lt;
        </button>
        <div className="competence-container">
          <div className="competence-content" style={{ transform: getTransformValue() }}>
            {competences.map((competence, index) => (
              <div className="competence-item" key={index}>
                <h4 className="competence-category">{competence.category}</h4>
                <ul className="competence-list">
                  {competence.skills.map((skill, idx) => (
                    <li key={idx} className="competence-skill">
                      {skill.name}
                    </li>
                  ))}
                </ul>
                <a href={competences[currentOffset].link} className="details-button">
                  {language === 'fr' ? 'Plus de détails' : 'More details'}
                </a>
              </div>
            ))}
          </div>
        </div>
        <button className="carousel-button right" onClick={nextCompetence}>
          &gt;
        </button>
      </section>
    </div>
  );
};

export default Home;
