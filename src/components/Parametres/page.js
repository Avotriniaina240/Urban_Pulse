import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ATS/Page.css';

const slogans = [
  "Visualisez les dynamiques urbaines en temps réel",
  "Améliorez votre ville avec UrbanPulse",
  "Des données urbaines à portée de main",
  "Explorez les tendances urbaines du futur",
  "Suivez l'évolution de votre quartier en direct",
  "Réinventez l'espace urbain avec des données précises",
  "Des villes plus connectées grâce aux données en temps réel",
  "Prendre le pouls de votre ville, un clic à la fois",
  "Optimisez la gestion urbaine avec UrbanPulse",
  "Anticipez les changements urbains grâce aux données",
  "Une meilleure compréhension de votre ville, instantanément",
  "Des données précises pour des décisions durables",
  "UrbanPulse l'avenir de l'analyse urbaine est ici",
  "Suivez les indicateurs de votre ville",
  "Votre ville sous un nouveau jour grâce à UrbanPulse",
  "Analysez les défis urbains et trouvez des solutions",
  "Pour des villes plus intelligentes et plus inclusives",
  "Prenez des décisions éclairées avec UrbanPulse",
  "Une nouvelle ère de la ville connectée commence ici",
  "Le futur de l'urbanisme propulsé par les données",
];

const Page = () => {
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [show, setShow] = useState(false);
  const slogansPerSlide = 4; 

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShow(false); 
      setTimeout(() => {
        setCurrentSloganIndex((prevIndex) =>
          (prevIndex + slogansPerSlide) % slogans.length
        );
        setShow(true); 
      }, 600); 
    }, 4000); 

    return () => clearInterval(intervalId);
  }, []);

  const currentSlogans = slogans.slice(currentSloganIndex, currentSloganIndex + slogansPerSlide);

  return (
    <div className="page">
      <header className="page-header">
        <nav>
          <Link to="/login" className="login-button">Se connecter</Link>
        </nav>
      </header>

      <main className="page-main">
        <div className="content-container-page">
          {/* Diviser la page en deux colonnes */}
          <div className="left-section">
            {/* Section de texte principale */}
            <div className="text-section">
              <p className="sub-text">Votre plateforme pour visualiser et analyser les dynamiques urbaines</p>
            </div>

            {/* Section des slogans */}
            <div className="slogans">
              {/* Afficher un groupe de 4 slogans */}
              {currentSlogans.map((slogan, index) => (
                <div key={index} className={`slogan ${show ? 'show' : ''}`}>
                  {slogan}
                </div>
              ))}
            </div>

            {/* Remplacer la section icône et texte par une vidéo */}
            <div className="video-section">
              <video autoPlay loop muted className="background-video">
                <source src={require('./page1.mp4')} type="video/mp4" />
                Votre navigateur ne prend pas en charge la vidéo.
              </video>
            </div>
          </div>

          {/* Partie de droite pour afficher une image et le texte "Urban Pulse" */}
          <div className="right-section"> 
            <h1 className="urban-pulse-title">Urban Pulse</h1> {/* Ajout du titre */}
            <img src={require('./page.png')} alt="Illustration" className="image-right" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
