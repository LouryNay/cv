import React, { useEffect, useState, useCallback } from 'react';
import './Home.css'; // Fichier CSS pour styliser la page d'accueil

const Home = ({ language, cvData }) => {
  //Texte animé
  const [index, setIndex] = useState(0);           // Pour suivre l'index du mot
  const [charIndex, setCharIndex] = useState(0);    // Pour suivre l'index du caractère dans le mot
  const [isDeleting, setIsDeleting] = useState(false); // Contrôle l'état de suppression
  const choices = cvData.profil[0].liste[0].choix.map(choice => language === 'fr' ? choice.fr[0] : choice.en[0]);//Liste des poste possibles

  //Recuperation des données
  const [competences, setCompetences] = useState([]);
  const [formations, setFormations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projets, setProjets] = useState([]);
  const [loisirs, setLoisirs] = useState([]);

  //Bouton selectionnée skill
  const [selectedCategory, setSelectedCategory] = useState(language === 'fr' ? 'Langages de programmation' : 'Programming Languages'); // Initialiser avec une valeur par défaut 

  useEffect(() => {
    const newCategory = language === 'fr' ? 'Langages de programmation' : 'Programming Languages';

    // Vérifiez si la nouvelle langue a une catégorie correspondante
    if (!competences.find(comp => comp.category === selectedCategory)) {
      setSelectedCategory(newCategory);
    }
  }, [language, competences, selectedCategory]);


  const ProgressBar = ({ level }) => {
    switch (level) {
      case 'Native':
      case 'Maternelle':
        level = 100;
        break;
      case 'C2':
      case 'Fluent':
        level = 96;
        break;
      case 'B2':
      case 'Intermediate':
        level = 55;
        break;
      default:
        break;
    }
    return (
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${level}%` }}></div>
      </div>
    )
  };

  // Déclaration et initialisation de filteredSkills
  const filteredSkills = competences.find(comp => comp.category === selectedCategory)?.skills || [];

  useEffect(() => {
    let typingSpeed = isDeleting ? 50 : 100;  // Vitesse de saisie et d'effacement

    if (!isDeleting && charIndex === choices[index].length) {
      // Pause à la fin du mot avant de supprimer
      setTimeout(() => setIsDeleting(true), 1000);
    } else if (isDeleting && charIndex === 0) {
      // Passe au mot suivant après effacement
      setIsDeleting(false);
      setIndex((prevIndex) => (prevIndex + 1) % choices.length);
    } else {
      // Continue d'afficher ou d'effacer les caractères
      const timeout = setTimeout(() => {
        setCharIndex((prevCharIndex) => prevCharIndex + (isDeleting ? -1 : 1));
      }, typingSpeed);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, isDeleting, index, choices]);

  const normalizeString = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  const linkToProject = (title) => {
    const normalizedTitle = normalizeString(title); // Normalise le titre comme dans le lien
    const sectionHash = `#projets#${normalizedTitle}`; // Formate le hash de la même manière que dans votre lien
    window.location.hash = sectionHash; // Change l'URL en ajoutant un hash
    
  };

  const extractDiplomas = useCallback(() => {
    if (!cvData) return;

    const diplomas = cvData.formation[0].diplome.map(diplome => ({
      type: 'formation',
      title: diplome.int[0][language][0],
      date: diplome.date[0],
      lieu: diplome.lieu[0][language][0],
      sortDate: parseDate(diplome.date[0])
    })).sort((a, b) => a.sortDate - b.sortDate);

    setFormations(diplomas);
  }, [language, cvData]);



  const extractExperiences = useCallback(() => {
    if (!cvData) return;

    const experiences = cvData.experiences[0].exp.map(exp => ({
      type: 'experience',
      title: exp.int[0][language][0],
      date: exp.date[0],
      lieu: exp.lieu?.[0]?.[language]?.[0] || '',
      liste: exp.liste?.[0]?.l?.map(l => ({
        item: l[language]?.[0] || ''
      })) || [],
      sortDate: parseDate(exp.date[0])
    })).sort((a, b) => a.sortDate - b.sortDate);

    setExperiences(experiences);
  }, [language, cvData]);

  const parseDate = (dateStr) => {
    const [startDate] = dateStr.split(' - ');
    const [month, year] = startDate.split('/');
    return parseInt(year + month.padStart(2, '0'), 10);
  };

  const extractCompetences = useCallback(() => {
    if (!cvData) return;

    const competencesData = [];

    const categories = cvData.competences[0].categorie.map(categorie => {
      const compSkills = (categorie.comp || [])
        .map(comp => ({
          name: comp.name[0][language][0],
          level: comp.niv[0],
          liste: comp.liste?.[0]?.l ? comp.liste[0].l.map(item => item) : []
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

    const langues = {
      category: language === 'fr' ? 'Langues' : 'Languages',
      skills: cvData.langues[0].lang.map(lang => ({
        name: lang.l[0][language][0],
        level: lang.niveau[0][language][0]
      })),
      link: '#languages'
    };
    competencesData.push(langues);

    setCompetences(competencesData);
  }, [language, cvData]);


  const extractProjects = useCallback(() => {
    if (!cvData) return;

    const projets = cvData.projets[0].projet.map(projet => ({
      nom: projet.nom[0][language][0],
      type: projet.type[0][language][0],
      technos: projet.technos[0].t.map(t => ({
        tech: t[language][0]
      }))
    }));

    setProjets(projets);

  }, [language, cvData]);


  const extractHobbies = useCallback(() => {
    if (!cvData) return;

    const loisirs = cvData.loisirs[0].loi.map(l => ({
      nom: l[language][0]
    }));

    setLoisirs(loisirs);

  }, [language, cvData]);



  useEffect(() => {
    extractExperiences();
    extractDiplomas();
    extractCompetences();
    extractProjects();
    extractHobbies();
  }, [extractExperiences, extractDiplomas, extractCompetences, extractProjects, extractHobbies]);

  if (!cvData) return <div>Loading...</div>;

  return (
    <div className="home">
      <section className="presentation">
        <div className="presentation-container" id="presentation-container">
          <p className="nom">
            {language === 'fr'
              ? `Bonjour! Je m'appelle ${cvData.profil[0].nom}.`
              : `Hi! My name is ${cvData.profil[0].nom}!`}
          </p>
          <div className="animated-text-container">
            <p className="animated-text">
              {choices[index].substring(0, charIndex)}
              <span className="cursor"></span>
            </p>
          </div>
          <p className="titre">
            {language === 'fr' ? (
              <>
                Mais si je dois me définir,<br /> ce serait comme :
              </>
            ) : (
              <>
                But if I have to define myself,<br /> it will be as :
              </>
            )}
            <span className="intitule">{language === 'fr' ? cvData.profil[0].titre[0].fr[0] : cvData.profil[0].titre[0].en[0]}</span>
          </p>
          <div className="presentation-description">
            {language === 'fr'
              ? cvData.profil[0].description[0].fr[0].paragraph.map((para, index) => (
                <p key={index}>{para}</p>
              ))
              : cvData.profil[0].description[0].en[0].paragraph.map((para, index) => (
                <p key={index}>{para}</p>
              ))
            }
          </div>
        </div>
      </section>

      <section className="competences">
        <div className="competences-container">
          <h2>{language === 'fr' ? 'Compétences' : 'Skills'}</h2>
          <div className="categories">
            {competences.map(competence => (
              <button
                key={competence.category}
                className={`category-button ${selectedCategory === competence.category ? "active" : ""}`}
                onClick={() => setSelectedCategory(competence.category)}
              >
                {competence.category}
              </button>
            ))}
          </div>

          {/* Ajoutez ici une section pour afficher les compétences filtrées */}
          <div className="skills-list filtered-skills">
            {filteredSkills.map(skill => {
              if (Number(skill.level) !== 0) {
                return (
                  <div className="skill skill-w-level" key={skill.name}>
                    <div className="skill-header">
                      <h3>{skill.name}</h3>
                      <p>{skill.level}</p>
                    </div>
                    <ProgressBar level={skill.level} />
                  </div>
                )
              } else if (skill.liste.length > 0) {
                return (
                  <div className="skill skill-w-liste" key={skill.name}>
                    <h3>{skill.name} :</h3>
                    <p className="liste-skill">{skill.liste.join(", ")}</p>
                  </div>
                )
              } else {
                return (
                  <div className="skill skill-simple" key={skill.name}>
                    <h3>{skill.name}</h3>
                  </div>
                )
              }
            })}
          </div>

          <a href={`#/competences${competences.find(comp => comp.category === selectedCategory)?.link}`} className="details-button">
            {language === 'fr' ? 'Plus de détails' : 'More details'}
          </a>

        </div>
      </section>


      <section className="experiences">
        <div className="experiences-container">
          <h2>Experiences</h2>
          <div className="content">
            {experiences.map((item, index) => (
              <div className="experience" key={index}>
                <h4 className="item-title">
                  {item.title}
                </h4>
                <p>{item.date}</p>
                {item.lieu ? (
                  <p className="item-lieu">{item.lieu}</p>
                ) : (
                  <ul>
                    {item.liste.map((l, idx) => (
                      <li key={idx}>{l.item}</li>
                    ))}
                  </ul>
                )}
                <a
                  href={`#/experiences#${normalizeString(item.title)}`} // Ajoutez un lien vers la section de l'expérience
                  className="plus-button"
                >
                  +
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="formations">
        <div className="formations-container">
          <h2>{language === 'fr' ? 'Formations' : 'Education'}</h2>
          <div className="content">
            {formations.map((item, index) => (
              <div className="formation" key={index}>
                <h4 className="item-title">
                  {item.title}
                </h4>
                <p>{item.date}</p>
                <p className="item-lieu">{item.lieu}</p>
                <a
                  href={`#/formations#${normalizeString(item.title)}`} // Ajoutez un lien vers la section de l'expérience
                  className="plus-button"
                >
                  +
                </a>
              </div>
            ))};
          </div>
        </div>
      </section>

      <section className="projets">
        <div className="projets-container">
          <h2>{language === 'fr' ? 'Projets' : 'Projects'}</h2>
          <div className="projet">
            {projets.map((projet, index) => (
              <div className="projet-content" key={index} onClick={() => linkToProject(projet.nom)}>
                <p>{projet.type}</p>
                <h3>{projet.nom}</h3>
                <div className="liste-technos">
                  {projet.technos.map((tech, i) => (
                    <p key={i}>{tech.tech}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="loisirs">
        <div className="loisirs-container">
          <h2>{language === 'fr' ? 'Loisirs' : 'Hobbies'}</h2>
          <div className="loisir">
            {loisirs.map((loisir, index) => (
              <div className="loisir-content" key={index}>
                <h3>{loisir.nom}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
