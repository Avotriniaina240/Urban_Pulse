import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ATS/Page.css';

const slogans = [
  "Visualisez les dynamiques urbaines en temps réel",
  "Améliorez votre ville avec UrbanPulse",
  "Des données urbaines à portée de main",
  "Un avenir urbain plus intelligent avec UrbanPulse"
];

const Page = () => {
  return (
    <div className="page">
      <header className="page-header">
        <nav>
          <Link to="/login" className="login-button">Se connecter</Link>
        </nav>
      </header>
      <main className="page-main">
        <div className="content-container-page">
          <div className="text-section">
            <div className="hero-section">
              <h1>Bienvenue à UrbanPulse</h1>
              <p>Votre plateforme pour visualiser et analyser les dynamiques urbaines</p>
            </div>
            <div className="slogans">
              {slogans.map((slogan, index) => (
                <div key={index} className="slogan">
                  {slogan}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
