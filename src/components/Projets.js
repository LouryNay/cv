import React, { useEffect, useState, useCallback, useRef } from 'react';
import './Projets.css';

const Projets = ({ cvData, language }) => {

    const [projets, setProjets] = useState([]);
    const [openProjects, setOpenProjects] = useState({});
    const categoriesRefs = useRef({});


    const normalizeString = (str) => {
        return str
            .normalize('NFD') // Décompose les caractères accentués
            .replace(/[\u0300-\u036f]/g, '') // Enlève les diacritiques
            .toLowerCase() // Met tout en minuscules
            .replace(/\s+/g, '-') // Remplace les espaces par des tirets
            .replace(/[^\w-]/g, ''); // Supprime les caractères non alphanumériques sauf les tirets
    };

    const scrollToSection = useCallback(() => {
        const hash = window.location.hash;
        const section = decodeURIComponent(hash.split('#').pop()); // Récupère la dernière partie après le dernier #

        if (section) {
            // Vérifier si la section correspond à un élément avec des détails
            const index = projets.findIndex(proj => normalizeString(proj.nom.toLowerCase().replace(/\s+/g, '-')) === section);

            if (index !== -1) {
                // Vérifier si l'élément a des détails avant de tenter de les ouvrir
                const projet = projets[index];
                if (projet.desc.length > 0) {
                    toggleDetails(index); // Ouvre les détails du diplôme ou de l'expérience si des détails existent
                }
            }

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
    }, [projets]);


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
        if (projets.length > 0) {
            setTimeout(scrollToSection, 100); // Délai de 100 ms pour laisser le temps au rendu
        }
    }, [projets, scrollToSection]);


    const extractProjects = useCallback(() => {
        if (!cvData) return;


        const projets = cvData.projets[0].projet.map(projet => ({
            nom: projet.nom[0][language][0],
            type: projet.type[0][language][0],
            technos: projet.technos[0].t.map(t => ({
                tech: t[language][0]
            })),
            desc: projet.desc?.[0]?.[language]?.[0]?.p?.map((p) => ({
                text: p || ""  // Valeur par défaut si le texte est absent
            })) || []
        }));

        setProjets(projets);

    }, [language, cvData]);

    const toggleDetails = (index) => {
        setOpenProjects(prevState => ({
            ...prevState,
            [index]: !prevState[index] // Basculer l'état pour le diplôme sélectionné
        }));
    };

    useEffect(() => {
        extractProjects();
    }, [extractProjects]);


    if (!cvData) return <div>Loading...</div>;


    return (
        <section className="projects">
            <div className="projects-container">
                {projets.map((projet, index) => (
                    <div className="project-content" key={index}
                        ref={el => {
                            const normalizedId = normalizeString(projet.nom.toLowerCase().replace(/\s+/g, '-'));
                            categoriesRefs.current[normalizedId] = el; // Référence pour chaque catégorie
                        }}>
                        <p className="project-type">{projet.type}</p>
                        <h3>{projet.nom}</h3>
                        <div className="liste-techs">
                            {projet.technos.map((tech, i) => (
                                <p key={i}>{tech.tech}</p>
                            ))}
                        </div>
                        {openProjects[index] && (
                            <div className="project-descr">
                                {projet.desc.length > 0 ? (
                                    projet.desc.map((item, i) => (
                                        <p key={i}>{item.text}</p> // Afficher chaque paragraphe
                                    ))
                                ) : (
                                    <p>Aucune description disponible.</p>
                                )}
                            </div>
                        )}
                        <button
                            onClick={() => toggleDetails(index)}
                            className="project-details-button"
                        >
                            {openProjects[index] ? '▲' : '▼'}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projets;