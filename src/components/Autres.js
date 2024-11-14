import React, { useState, useEffect, useCallback } from 'react';
import './Autres.css';

const Autres = ({ cvData, language }) => {
    const [presentation, setPresentation] = useState({
        pres: [],
        parcours: [],
        projets: [],
        loisirs: []
    });

    const extractPresentation = useCallback(() => {
        if (!cvData) return;

        const presentationData = cvData.propos[0];

        const presentation = {
            pres: presentationData.pres?.[0]?.[language]?.[0]?.paragraph?.map((p) => ({
                text: p || ""
            })) || [],
            parcours: presentationData.parcours?.[0]?.[language]?.[0]?.paragraph?.map((p) => ({
                text: p || ""
            })) || [],
            projets: presentationData.projets?.[0]?.[language]?.[0]?.paragraph?.map((p) => ({
                text: p || ""
            })) || [],
            loisirs: presentationData.loisir?.[0]?.[language]?.[0]?.paragraph?.map((p) => ({
                text: p || ""
            })) || [],
        };

        setPresentation(presentation);
    }, [language, cvData]);


    useEffect(() => {
        extractPresentation();
    }, [extractPresentation]);


    if (!cvData) return <div>Loading...</div>;

    return (
        <div className="autres">
            <div className="presentation">
                <div className="presentation-content">
                    {presentation.pres.map((item, i) => (
                        <p key={i}>{item.text}</p>))}
                </div>
            </div>

            <div className="parcours">
                <h2>{language === 'fr' ? 'Mon Parcours' : 'My Background'}</h2>
                <div className="para">
                    {presentation.parcours.map((item, i) => (
                        <p key={i}>{item.text}</p>))}
                </div>
            </div>

            <div className="projets">
                <h2>{language === 'fr' ? 'Mes Projets' : 'My Projects'}</h2>
                <div className="para">
                    {presentation.projets.map((item, i) => (
                        <p key={i}>{item.text}</p>))}
                </div>
            </div>

            <div className="loisirs">
                <h2>{language === 'fr' ? 'Mes Loisirs' : 'My Hobbies'}</h2>
                <div className="para">
                    {presentation.loisirs.map((item, i) => (
                        <p key={i}>{item.text}</p>))}
                </div>
            </div>
        </div>
    );
};

export default Autres;
