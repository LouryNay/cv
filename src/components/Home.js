import React, { useEffect, useState } from 'react';
import xml2js from 'xml2js';
import xmlFile from '../cv.xml'; // Assurez-vous que le chemin est correct

const Home = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(xmlFile)
            .then(response => response.text())
            .then(str => xml2js.parseStringPromise(str))
            .then(result => setData(result.CV));
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <div className="home">
            <img src={data.home.photo[0]} alt="Profile" />
            <h2>{data.home.name[0]}</h2>
            <h3>{data.home.title[0]}</h3>
            <p>{data.home.description[0]}</p>
            <div className="timeline">
                {data.home.timeline[0].experience.map((exp, index) => (
                    <div key={index}>
                        <h4>{exp.title[0]} ({exp.date[0]})</h4>
                        <p>{exp.description[0]}</p>
                    </div>
                ))}
                {data.home.timeline[0].formation.map((form, index) => (
                    <div key={index}>
                        <h4>{form.title[0]} ({form.date[0]})</h4>
                        <p>{form.description[0]}</p>
                    </div>
                ))}
            </div>
            <div className="competence-carousel">
                {data.home.competences[0].competence.map((competence, index) => (
                    <div key={index}>
                        <h4>{competence.category[0]}</h4>
                        <p>{competence.description[0]}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
