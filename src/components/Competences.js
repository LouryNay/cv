import React, { useEffect, useState, useCallback, useRef } from 'react';

const Competences = ({ cvData, language }) => {
  const [competences, setCompetences] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const categoriesRefs = useRef({}); // Référence pour stocker les catégories

  const normalizeString = (str) => {
    return str
      .normalize('NFD') // Décompose les caractères accentués
      .replace(/[\u0300-\u036f]/g, '') // Enlève les diacritiques
      .toLowerCase() // Met tout en minuscules
      .replace(/\s+/g, '-') // Remplace les espaces par des tirets
      .replace(/[^\w-]/g, ''); // Supprime les caractères non alphanumériques sauf les tirets
  };  

  const convertDescriptionToHTML = (description, language) => {
    if (!description || !Array.isArray(description[0][language])) return '';

    return description[0][language].map(item => {
      const htmlContent = [];

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

          // Vérification et traitement des listes dans le paragraphe
          if (paragraph.ul && Array.isArray(paragraph.ul)) {
            const listItems = paragraph.ul.map(list => {
              return list.li.map(li => {
                let liContent = li._ || ''; // Texte normal pour li
                const strongTextsLi = li.strong || []; // Textes à mettre en gras dans li

                // Remplacement de la première occurrence de chaque astérisque par le texte fort
                strongTextsLi.forEach(strongText => {
                  const regex = new RegExp(`\\*`, 'i'); // Cherche la première occurrence de l'astérisque
                  liContent = liContent.replace(regex, `<strong>${strongText}</strong>`);
                });

                return `<li>${liContent.trim()}</li>`; // Retourne chaque élément li
              }).join(''); // Combine les li en une seule chaîne
            }).join(''); // Combine les listes en une seule chaîne

            // Ajout de la liste au contenu HTML
            if (listItems) {
              paragraphContent += `<ul>${listItems}</ul>`; // Ajoute la liste à la fin du paragraphe
            }
          }

          // Ajout du paragraphe au contenu final
          htmlContent.push(`<p>${paragraphContent.trim()}</p>`);
        });
      }

      return htmlContent.join(''); // Combine tous les paragraphes en une seule chaîne
    }).join('');
  };

  const extractCompetences = useCallback((data) => {
    const competencesData = [];

    // Récupération des langues
    const langues = {
      category: language === 'fr' ? 'Langues' : 'Languages',
      skills: data.langues[0].lang.map(lang => ({
        name: lang.l[0][language][0],
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
        level: comp.niv[0],
        pre: comp.pre?.[0]?.[language]?.[0] || '',
        description: convertDescriptionToHTML(comp.des, language)
      })).sort((a, b) => b.level - a.level);
    
      const coursSkills = (categorie.cours || []).map(cours => ({
        name: cours.name[0][language][0],
        level: cours.niv[0],
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
  const scrollToSection = () => {
    const hash = window.location.hash;
    const section = decodeURIComponent(hash.split('#').pop()); // Récupère la dernière partie après le dernier #
  
    if (section) {
      const target = categoriesRefs.current[section];
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  

  // Écoute des changements d'URL
  useEffect(() => {
    const handleHashChange = () => {
      scrollToSection();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Appel initial pour faire défiler vers la section si nécessaire
  useEffect(() => {
    if (competences.length > 0) {
      setTimeout(scrollToSection, 100); // Délai de 100 ms pour laisser le temps au rendu
    }
  }, [competences]);

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
                <div className="skill-header" onClick={() => skill.description ? toggleExpand(`${index}-${idx}`) : null}>
                  <span>{skill.name} - {skill.level}</span>
                  {skill.description && (
                    <span className="expand-arrow">{expandedItems[`${index}-${idx}`] ? '▼' : '►'}</span>
                  )}
                </div>
                <p>{skill.pre}</p>
                {expandedItems[`${index}-${idx}`] && skill.description && (
                  <div className="skill-details">
                    {renderDescription(skill.description)}
                  </div>
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
