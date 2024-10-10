// src/components/UrbanPlannerDashboard.js
import React from 'react';
import '../styles/Admin/UrbanPulseInfo.css';

const UrbanPulseInfoUrb = () => {
  return (
    <div className="urban-pulse-info">
      <h2>Tableau de Bord des Urbanistes</h2>
      <ul>
        <li>
          <strong>Analyse des Données Urbaines :</strong>
          <ul>
            <li><strong>Collecte de données :</strong> Rassembler des données sur l'utilisation des services.</li>
            <li><strong>Visualisation des tendances :</strong> Analyser les comportements et les besoins des citoyens.</li>
          </ul>
        </li>
        <li>
          <strong>Planification Urbaine :</strong>
          <ul>
            <li><strong>Évaluer les projets :</strong> Examiner et approuver les propositions de développement.</li>
            <li><strong>Collaboration avec les citoyens :</strong> Travailler avec les citoyens pour améliorer le cadre de vie.</li>
          </ul>
        </li>
        <li>
          <strong>Gestion des Ressources :</strong>
          <ul>
            <li><strong>Coordination avec les services publics :</strong> Collaborer avec différents départements pour les projets.</li>
            <li><strong>Suivi des budgets :</strong> Gérer les financements pour les initiatives urbaines.</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default UrbanPulseInfoUrb;
