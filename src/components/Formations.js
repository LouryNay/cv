import React, { useEffect, useState } from 'react';
import xml2js from 'xml2js';
import xmlFile from '../cv.xml'; // Assurez-vous que le chemin est correct

const Formations = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(xmlFile)
            .then(response => response.text())
            .then(str => xml2js.parseStringPromise(str))
            .then(result => setData(result.CV));
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <div className="formations">
            <h2>Formations</h2>
            <div className="timeline">
                {data.formulations[0].formation.map((formation, index) => (
                    <div key={index}>
                        <h3>{formation.title[0]}</h3>
                        <p>Compétences acquises:</p>
                        <ul>
                            {formation.skills[0].skill.map((skill, i) => (
                                <li key={i}>{skill}</li>
                            ))}
                        </ul>
                        <p>Projets:</p>
                        <ul>
                            {formation.projects[0].project.map((project, i) => (
                                <li key={i}>
                                    <strong>{project.name[0]}</strong>: {project.description[0]}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Formations;
