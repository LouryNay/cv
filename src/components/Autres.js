import React, { useEffect, useState } from 'react';
import xml2js from 'xml2js';
import xmlFile from '../cv.xml'; // Assurez-vous que le chemin est correct

const Autres = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(xmlFile)
            .then(response => response.text())
            .then(str => xml2js.parseStringPromise(str))
            .then(result => setData(result.CV));
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <div className="autres">
            <h2>Autres Informations</h2>
            <p>{data.autres[0].description[0]}</p>
        </div>
    );
};

export default Autres;
