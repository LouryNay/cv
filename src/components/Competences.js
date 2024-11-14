import React, { useEffect, useState, useCallback, useRef } from 'react';
import './Competences.css';

const Competences = ({ cvData, language }) => {
  const [competences, setCompetences] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const categoriesRefs = useRef({}); // Référence pour stocker les catégories

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

  const normalizeString = (str) => {
    return str
      .normalize('NFD') // Décompose les caractères accentués
      .replace(/[\u0300-\u036f]/g, '') // Enlève les diacritiques
      .toLowerCase() // Met tout en minuscules
      .replace(/\s+/g, '-') // Remplace les espaces par des tirets
      .replace(/[^\w-]/g, ''); // Supprime les caractères non alphanumériques sauf les tirets
  };

  const convertDescriptionToHTML = (description, language) => {
    // Vérification si la description est valide
    if (!description || !description[0] || !description[0][language]) return '';

    const htmlContent = [];


    // la description est un tableau d'objets (comme prévu initialement)
    description[0][language].forEach(item => {
      // Traitement des paragraphes
      if (item.p && Array.isArray(item.p)) {
        item.p.forEach(paragraph => {
          let paragraphContent = paragraph._ || ''; // Texte normal
          const strongTexts = paragraph.strong || []; // Textes à mettre en gras

          // Remplacement de la première occurrence de chaque astérisque par le texte fort
          strongTexts.forEach(strongText => {
            const regex = new RegExp(`\\*`, 'i'); // Cherche la première occurrence de l'astérisque
            paragraphContent = paragraphContent.replace(regex, `<strong>${strongText}</strong>`);
          });

          // Traitement des listes dans les paragraphes
          if (paragraph.ul && Array.isArray(paragraph.ul)) {
            const listItems = paragraph.ul.map(list => {
              return list.li.map(li => {
                let liContent = li._ || ''; // Texte normal pour chaque élément de la liste
                const strongTextsLi = li.strong || [];

                // Remplacement du texte à mettre en gras dans chaque élément li
                strongTextsLi.forEach(strongText => {
                  const regex = new RegExp(`\\*`, 'i');
                  liContent = liContent.replace(regex, `<strong>${strongText}</strong>`);
                });

                return `<li>${liContent.trim()}</li>`;
              }).join('');
            }).join('');

            // Ajouter les items de liste à la fin du paragraphe
            if (listItems) {
              paragraphContent += `<ul>${listItems}</ul>`;
            }
          }

          // Ajouter le paragraphe au contenu final
          htmlContent.push(`<p>${paragraphContent.trim()}</p>`);
        });
      }
    });

    return htmlContent.join('');
  };


  const extractCompetences = useCallback((data) => {
    const competencesData = [];

    // Récupération des langues
    const langues = {
      category: language === 'fr' ? 'Langues' : 'Languages',
      skills: data.langues[0].lang.map(lang => ({
        name: lang.l[0][language][0],
        liste:[],
        level: lang.niveau[0][language][0],
        pre: '',
        description: ''
      })),
      link: '#languages'
    };

    competencesData.push(langues);

    // Récupération des compétences et cours pour chaque catégorie
    const categories = data.competences[0].categorie.map(categorie => {
      // Normaliser le nom de la catégorie
      const normalizedCategoryName = normalizeString(categorie.ti[0][language][0]);

      const compSkills = (categorie.comp || []).map(comp => ({
        name: comp.name[0][language][0],
        level: comp.niv[0] ? comp.niv[0] : 'N/A',
        liste: comp.liste?.[0]?.l ? comp.liste[0].l.map(item => item) : [],
        pre: comp.pre?.[0]?.[language]?.[0] || '',
        description: convertDescriptionToHTML(comp.des, language)
      })).sort((a, b) => b.level - a.level);

      const coursSkills = (categorie.cours || []).map(cours => ({
        name: cours.name[0][language][0],
        level: cours.niv[0] ? cours.niv[0] : 'N/A',
        liste: cours.liste?.[0]?.l ? cours.liste[0].l.map(item => item) : [],
        pre: cours.pre?.[0]?.[language]?.[0] || '',
        description: convertDescriptionToHTML(cours.des, language)
      })).sort((a, b) => b.level - a.level);

      const skills = [...compSkills, ...coursSkills];

      return {
        category: categorie.ti[0][language][0],
        skills: skills,
        link: `#${normalizedCategoryName}`
      };
    });

    competencesData.push(...categories);
    setCompetences(competencesData);
  }, [language]);

  useEffect(() => {
    if (cvData) {
      extractCompetences(cvData);
    }
  }, [cvData, extractCompetences]);

  // Fonction pour gérer l'extension des descriptions
  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Affichage des descriptions interprétées comme HTML
  const renderDescription = (htmlContent) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };
// Fonction pour faire défiler vers la section correspondant à l'URL
const scrollToSection = useCallback(() => {
  const hash = window.location.hash;
  const section = decodeURIComponent(hash.split('#').pop()); // Récupère la dernière partie après le dernier #

  if (section) {
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
},[]);



  // Écoute des changements d'URL
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
    if (competences.length > 0) {
      setTimeout(scrollToSection, 100); // Délai de 100 ms pour laisser le temps au rendu
    }
  }, [competences, scrollToSection]);

  if (competences.length === 0) return <div>Loading...</div>;

  return (
    <div className="competences">
      {competences.map((comp, index) => (
        <div
          id={comp.category.toLowerCase().replace(/\s+/g, '-')}
          className="competence-category"
          key={index}
          ref={el => {
            const normalizedId = normalizeString(comp.category.toLowerCase().replace(/\s+/g, '-'));
            categoriesRefs.current[normalizedId] = el; // Référence pour chaque catégorie
          }}
        >
          <h4>{comp.category}</h4>
          <ul>
            {comp.skills.map((skill, idx) => (
              <li key={idx}>
                <div className="skill-header">
                  <div className="skill-name-level">
                    <p className="skill-name">{skill.name}</p>

                    {skill.level !== 'N/A' && (
                      <p className="skill-level">{skill.level}</p>
                    )}
                  </div>

                  {skill.level !== 'N/A' && <ProgressBar level={skill.level} />}
                </div>

                {skill.liste.length>0 && (
                  <p className="liste-skill">{skill.liste.join(", ")}</p>
                )}

                {skill.pre &&(<p className="pre">{skill.pre}</p>)}

                {expandedItems[`${index}-${idx}`] && skill.description && (
                  <div className={`des ${expandedItems[`${index}-${idx}`] ? 'expanded' : ''}`}>
                    {renderDescription(skill.description)}
                  </div>
                )}

                {skill.description && (
                  <button
                    onClick={() => toggleExpand(`${index}-${idx}`)}
                    className="toggle-details-button"
                  >
                    {expandedItems[`${index}-${idx}`] ? '▲' : '▼'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Competences;
