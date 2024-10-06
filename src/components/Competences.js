import React, { useEffect, useState } from 'react';
import xml2js from 'xml2js';
import xmlFile from '../cv.xml'; // Assurez-vous que le chemin est correct

const Competences = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(xmlFile)
            .then(response => response.text())
            .then(str => xml2js.parseStringPromise(str))
            .then(result => setData(result.CV));
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <div className="competences">
            <h2>Mes Compétences</h2>
            {data.competences[0].competence.map((competence, index) => (
                <div key={index}>
                    <h3>{competence.name[0]}</h3>
                    <div style={{ width: `${competence.level[0]}%` }} className="skill-bar">
                        <span>{competence.level[0]}%</span>
                    </div>
                    <p>{competence.details[0]}</p>
                </div>
            ))}
        </div>
    );
};

export default Competences;
