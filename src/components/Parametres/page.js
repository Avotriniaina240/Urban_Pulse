import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ATS/Page.css';

const slogans = [
  "Visualisez les dynamiques urbaines en temps réel",
  "Améliorez votre ville avec UrbanPulse",
  "Des données urbaines à portée de main",
  "Un avenir urbain plus intelligent avec UrbanPulse",
  "Explorez les tendances urbaines du futur",
  "Des décisions basées sur les données pour un meilleur avenir",
  "Suivez l'évolution de votre quartier en direct",
  "Réinventez l'espace urbain avec des données précises",
  "Des villes plus connectées grâce aux données en temps réel",
  "Prendre le pouls de votre ville, un clic à la fois",
  "Optimisez la gestion urbaine avec UrbanPulse",
  "Anticipez les changements urbains grâce aux données",
  "Vos décisions nos données ensemble pour une ville plus intelligente",
  "Une meilleure compréhension de votre ville, instantanément",
  "Des données précises pour des décisions durables",
  "UrbanPulse l'avenir de l'analyse urbaine est ici",
  "Suivez les indicateurs de votre ville",
  "Votre ville sous un nouveau jour grâce à UrbanPulse",
  "Simplifiez la planification urbaine avec des données fiables",
  "Analysez les défis urbains et trouvez des solutions",
  "Pour des villes plus intelligentes et plus inclusives",
  "Prenez des décisions éclairées avec UrbanPulse",
  "Une nouvelle ère de la ville connectée commence ici",
  "Le futur de l'urbanisme propulsé par les données",
];

const Page = () => {
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [show, setShow] = useState(false);
  const slogansPerSlide = 4; // Nombre de slogans à afficher à la fois

  useEffect(() => {
    // Délai pour l'animation
    const intervalId = setInterval(() => {
      setShow(false); // Masquer les slogans actuels
      setTimeout(() => {
        setCurrentSloganIndex((prevIndex) =>
          (prevIndex + slogansPerSlide) % slogans.length
        );
        setShow(true); // Afficher les nouveaux slogans après le changement
      }, 600); // Correspond à la durée de l'animation CSS
    }, 4000); // Intervalle pour le changement des slogans

    return () => clearInterval(intervalId);
  }, []);

  // Obtenir les slogans actuels à afficher
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

            {/* Section icône et texte en bas */}
            <div className="bottom-section">
              <div className="icon-container">
              <div className="urban-pulse-text">Urban Pulse</div>
              </div>
            </div>
          </div>

          {/* Partie de droite pour afficher une image */}
          <div className="right-section"> 
            <img src={require('./page.png')} alt="Illustration" className="image-right" />
          </div>
        </div>
      </main>
    </div>
  );
};


export default Page;