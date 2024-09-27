import React, { useState, useEffect } from 'react';
import { parseString } from 'xml2js';
import { fetchCVData } from './utils'; // Assure-toi d'avoir cette fonction pour charger le fichier XML

function Home({ language }) {
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchCVData().then(xml => {
      parseString(xml, (err, result) => {
        if (err) {
          console.error("Error parsing XML: ", err);
          return;
        }
        const profileData = result.cv.profil[0];
        const name = profileData.nom[0][language][0];
        const title = profileData.titre[0][language][0] || '';
        const description = profileData.description[0][language][0] || '';

        setProfile({
          name: name,
          title: title,
          description: description
        });
      });
    });
  }, [language]);

  return (
    <div className="home">
      <h1>{profile.name}</h1>
      <h2>{profile.title}</h2>
      <p>{profile.description}</p>
    </div>
  );
}

export default Home;
