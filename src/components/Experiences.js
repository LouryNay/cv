import React, { useEffect, useState } from 'react';
import xml2js from 'xml2js';
import xmlFile from '../cv.xml'; // Assurez-vous que le chemin est correct

const Experiences = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(xmlFile)
            .then(response => response.text())
            .then(str => xml2js.parseStringPromise(str))
            .then(result => setData(result.CV));
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <div className="experiences">
            <h2>Mes Expériences</h2>
            <div className="timeline">
                {data.experiences[0].experience.map((experience, index) => (
                    <div key={index}>
                        <h3>{experience.title[0]}</h3>
                        <p>Compétences développées:</p>
                        <ul>
                            {experience.skills[0].skill.map((skill, i) => (
                                <li key={i}>{skill}</li>
                            ))}
                        </ul>
                        <p>{experience.description[0]}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Experiences;
