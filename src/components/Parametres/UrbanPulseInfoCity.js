// src/components/CitizenDashboard.js
import React from 'react';
import '../styles/Admin/UrbanPulseInfo.css';

const UrbanPulseInfoCity = () => {
  return (
    <div className="urban-pulse-info">
      <h2>Tableau de Bord des Citoyens</h2>
      <ul>
        <li>
          <strong>Interactions Communautaires :</strong>
          <ul>
            <li><strong>Soumettre des commentaires :</strong> Partager vos retours sur l'application et les services.</li>
            <li><strong>Participer à des sondages :</strong> Contribuer aux enquêtes pour améliorer les services.</li>
            <li><strong>Créer des discussions :</strong> Échanger avec d'autres citoyens sur des sujets d'intérêt.</li>
          </ul>
        </li>
        <li>
          <strong>Accès à l'Information :</strong>
          <ul>
            <li><strong>Consulter les annonces :</strong> Rester informé sur les événements locaux et les mises à jour.</li>
            <li><strong>Explorer les points d'intérêt :</strong> Découvrir les lieux, événements et services à proximité.</li>
          </ul>
        </li>
        <li>
          <strong>Gestion des Problèmes Urbains :</strong>
          <ul>
            <li><strong>Signaler des problèmes :</strong> Alerter les autorités sur des problèmes dans votre quartier.</li>
            <li><strong>Suivre l'état des signalements :</strong> Vérifier les progrès des problèmes signalés.</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default UrbanPulseInfoCity;
