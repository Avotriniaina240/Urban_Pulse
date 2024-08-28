import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import '../styles/ATS/ReportsListe.css';

const ReportsListe = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reports', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const data = await response.json();
        setReports(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div>Chargement des données...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

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
