import React, { useEffect, useState } from 'react';
import xml2js from 'xml2js';
import xmlFile from './../cv.xml';

const Home = ({ language }) => {
    const [data, setData] = useState(null);
    const [timelineItems, setTimelineItems] = useState([]);
    const [competences, setCompetences] = useState([]);

    useEffect(() => {
      fetch(xmlFile)
      .then(response => response.text())
      .then(str => xml2js.parseStringPromise(str))
      .then(result => {
        console.log('Parsed XML:', result);
        if (result && result.cv) {
          setData(result.cv);
          extractAndSortTimelineItems(result.cv);
          extractCompetences(result.cv);
        }
      })
      .catch(error => console.error('Erreur lors du chargement du fichier XML:', error));
    
    }, [language]);

    const extractAndSortTimelineItems = (cvData) => {
        const diplomas = cvData.formation[0].diplome.map(diplome => ({
            type: 'formation',
            title: diplome.int[0][language][0],
            date: diplome.date[0],
            lieu: diplome.lieu[0][language][0],
            sortDate: parseDate(diplome.date[0])
        }));

        const experiences = cvData.experiences[0].exp.map(exp => ({
            type: 'experience',
            title: exp.int[0],
            date: exp.date[0],
            lieu: exp.lieu[0][language][0],
            sortDate: parseDate(exp.date[0])
        }));

        const allItems = [...diplomas, ...experiences].sort((a, b) => b.sortDate - a.sortDate);
        setTimelineItems(allItems);
    };

    const parseDate = (dateStr) => {
        const [startDate] = dateStr.split(' - ');
        const [month, year] = startDate.split('/');
        return parseInt(year + month.padStart(2, '0'), 10);
    };

    const extractCompetences = (cvData) => {
        const competencesData = [];

        // Extraire les langues
        const langues = cvData.langues[0].lang.map(lang => ({
            category: language === 'fr' ? 'Langues' : 'Languages',
            skills: [
                {
                    name: lang.l[0][language][0],
                    level: lang.niveau[0][language][0]
                }
            ],
            link: '#languages'
        }));

        competencesData.push(...langues);

        // Extraire les autres compétences
        const categories = cvData.competences[0].categorie.map(categorie => {
            const skills = categorie.comp.map(comp => ({
                name: comp.name[0][language],
                level: comp.niv[0]
            })).sort((a, b) => b.level - a.level);

            return {
                category: categorie.ti[0][language][0],
                skills: skills,
                link: `#${categorie.ti[0][language][0].toLowerCase().replace(/\s+/g, '-')}`
            };
        });

        competencesData.push(...categories);
        setCompetences(competencesData);
    };

    if (!data) return <div>Loading...</div>;

    return (
        <div className="home">
            {/* Section Présentation */}
            <section className="presentation">
                <div className="presentation-container">
                    <img className="profile-photo" src="" alt="Profile" />
                    <p className="nom">{data.profil[0].nom}</p>
                    <p className="titre">{language === 'fr' ? data.profil[0].titre[0].fr[0] : data.profil[0].titre[0].en[0]}</p>
                    <p className="presentation-description">{language === 'fr' ? data.profil[0].description[0].fr[0] : data.profil[0].description[0].en[0]}</p>
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
