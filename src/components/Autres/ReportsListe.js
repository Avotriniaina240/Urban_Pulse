import React from 'react';
import '../styles/ATS/ReportsListe.css';

const ReportsListe = () => {
  // Données fictives des signalements
  const reports = [
    { id: 1, description: 'Panneau de signalisation endommagé', status: 'En cours' },
    { id: 2, description: 'Graffiti sur un mur', status: 'Résolu' },
    { id: 3, description: 'Nid-de-poule sur la route', status: 'En attente' },
  ];

  return (
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
  );
};

export default ReportsListe;
