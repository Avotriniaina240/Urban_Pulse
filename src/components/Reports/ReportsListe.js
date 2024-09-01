import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import '../styles/ATS/ReportsListe.css';

const ReportsListe = () => {
  const [reports, setReports] = useState([]);
  const [searchText, setSearchText] = useState(''); // État pour le texte de recherche

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reports', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',  // Assurez-vous que les en-têtes appropriés sont envoyés
          }
        });

        // Vérifiez si la réponse n'est pas OK (par exemple, 404 ou 500) et gérez-la
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
            // Si la réponse n'est pas JSON, lancez une erreur générique
            throw new Error('Le serveur a renvoyé une réponse non valide.');
          }
        }

        // Convertir la réponse en JSON
        const data = await response.json();
        setReports(data);
      } catch (error) {
      
      }
    };

    fetchReports();
  }, []);

  // Filtrer les rapports en fonction du texte de recherche
  const filteredReports = reports.filter(report =>
    (report.description && report.description.toLowerCase().includes(searchText.toLowerCase())) ||
    (report.status && report.status.toLowerCase().includes(searchText.toLowerCase()))
  );


  return (
    <div>
      <Navbar />
      <Sidebar />
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
      
      {/* Nouveau conteneur pour le titre et la barre de recherche */}
      <div className="reports-header-list">
        <h2>Liste des Signalements</h2>
        <input
          type="text"
          placeholder="Rechercher par description ou statut..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
      </div>
  
      {/* Conteneur de la liste des rapports avec scroll */}
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
