import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import '../styles/ATS/AnalyzeReports.css'; // Créez ce fichier pour les styles spécifiques à cette page

const AnalyzeReports = () => {
  // Données fictives pour l'analyse
  const statistics = {
    totalReports: 30,
    resolved: 12,
    pending: 10,
    inProgress: 8
  };

  return (
    <div>
      <Navbar/>
      <Sidebar/>
      <div className="home-container">
        <div className="global-border">
          <div className="buttons-container">
            <Link to="/reports">
              <button className="home-button">Faire une Plainte</button>
            </Link>
            <Link to="/reports-liste">
              <button className="home-button">Voir la Liste des Plaintes</button>
            </Link>
            <Link to="/manage-reports">
              <button className="home-button">Gérer les Plaintes</button>
            </Link>
          </div>
        </div>
      </div>
          <div className="analysis-container">
            <p><strong>Total des Signalements:</strong> {statistics.totalReports}</p>
            <p><strong>Résolus:</strong> {statistics.resolved}</p>
            <p><strong>En Attente:</strong> {statistics.pending}</p>
            <p><strong>En Cours:</strong> {statistics.inProgress}</p>
          </div>
      </div>
  );
};

export default AnalyzeReports;
