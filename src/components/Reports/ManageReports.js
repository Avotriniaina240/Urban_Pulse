import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import '../styles/ATS/ManageReports.css';

const ManageReports = () => {
  // Données fictives des signalements pour la gestion
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
        <h2>Gérer les Signalements</h2>
          <div className="report-management">
            <ul>
              {reports.map(report => (
                <li key={report.id} className="report-item">
                  <div>
                    <strong>Description:</strong> {report.description} <br />
                    <strong>Statut:</strong> {report.status}
                  </div>
                  <div className="report-actions">
                    <button className="action-button">Modifier</button>
                    <button className="action-button">Supprimer</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
      </div>
  );
};

export default ManageReports;
