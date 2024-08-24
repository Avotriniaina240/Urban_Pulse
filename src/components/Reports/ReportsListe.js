import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import '../styles/ATS/ReportsListe.css';

const ReportsListe = () => {
  // Données fictives des signalements
  const reports = [
    { id: 1, description: 'Panneau de signalisation endommagé', status: 'En cours' },
    { id: 2, description: 'Graffiti sur un mur', status: 'Résolu' },
    { id: 3, description: 'Nid-de-poule sur la route', status: 'En attente' },
  ];

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
      <div className="report-list">
      <h2>Liste des Signalements</h2>
      <ul>
        {reports.map(report => (
          <li key={report.id}>
            <strong>Description:</strong> {report.description} <br />
            <strong>Statut:</strong> {report.status}
          </li>
        ))}
      </ul>
    </div>

    </div>
  );
};

export default ReportsListe;
