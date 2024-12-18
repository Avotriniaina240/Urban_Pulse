import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';
import '../styles/ATS/ReportsListe.css';
import { useStatistics } from '../Reports/StatisticsContext'; // Importez le hook

const ReportsListe = () => {
  const [reports, setReports] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { setStatistics } = useStatistics(); // Utilisez le contexte pour mettre à jour les statistiques

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/reports`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Erreur lors de la récupération des données');
            } catch (e) {
              console.log(e);
            }
          } else {
            throw new Error('Le serveur a renvoyé une réponse non valide.');
          }
        }

        const data = await response.json();
        setReports(data);
        
        // Mettre à jour les statistiques après avoir récupéré les rapports
        const responseStats = await fetch(`${process.env.REACT_APP_BASE_URL}/reports/statistics`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          }
        });

        if (responseStats.ok) {
          const statsData = await responseStats.json();
          setStatistics(statsData);
        }

      } catch (error) {
        console.error('Erreur:', error.message);
      }
    };

    fetchReports();
  }, [setStatistics]);

  const filteredReports = reports.filter(report =>
    (report.description && report.description.toLowerCase().includes(searchText.toLowerCase())) ||
    (report.status && report.status.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="home-container">
      </div>
      
      <div className="reports-header-list">
        <h2>Liste des Signalements</h2>
        <input
          type="text"
          placeholder="Rechercher par description ou statut..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input-manage"
        />
      </div>
  
      <div className="report-list">
        <ul>
          {filteredReports.length > 0 ? (
            filteredReports.map(report => (
              <li key={report.id} className="report-item-list">
                <strong>Description:</strong> {report.description} <br />
                <strong>Statut:</strong> {report.status}
              </li>
            ))
          ) : (
            <p>Aucun signalement trouvé.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ReportsListe;
