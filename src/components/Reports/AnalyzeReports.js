import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/Sidebar';
import '../styles/ATS/AnalyzeReports.css';
import { useStatistics } from '../Reports/StatisticsContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import Modal from '../Reports/Modal';

const AnalyzeReports = () => {
  const { statistics, setStatistics } = useStatistics();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [reportDetails, setReportDetails] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Gestion d'erreur personnalisée
  const handleFetchError = async (response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des données');
    } else {
      throw new Error('Le serveur a renvoyé une réponse non valide.');
    }
  };

  // Récupération des statistiques
  const fetchStatistics = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/statistics`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        await handleFetchError(response);
      }

      const data = await response.json();
      console.log('Statistiques reçues:', data); // Vérifiez les statistiques ici
      setStatistics(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Récupération des détails des rapports
  const fetchReportDetails = async () => {
    try {
      const detailsResponse = await fetch(`http://localhost:5000/api/reports?status=${statusFilter}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!detailsResponse.ok) {
        await handleFetchError(detailsResponse);
      }

      const detailsData = await detailsResponse.json();
      console.log('Détails des rapports reçus:', detailsData);
      setReportDetails(detailsData);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchStatistics(); // Optionnel si vous ne voulez pas mettre à jour les statistiques à chaque changement de filtre
      await fetchReportDetails(); // Fetch report details according to the current filter
      setLoading(false);
    };

    fetchData();
  }, [statusFilter]);

  // Couleurs pour le graphique
  const getBarColor = (name) => {
    switch (name) {
      case 'Total':
        return '#8884d8';
      case 'Résolus':
        return '#82ca9d';
      case 'En Attente':
        return '#ff7300';
      case 'En Cours':
        return '#ff4d4d';
      default:
        return '#8884d8';
    }
  };

  // Rendu des statistiques filtrées
  const renderFilteredStatistics = () => {
    if (error) {
      return <p>Erreur: {error}</p>;
    }

    if (!statistics) {
      return <p>Les données ne sont pas disponibles.</p>;
    }

    let data = [
      { name: 'Total', value: statistics.totalReports },
      { name: 'Résolus', value: statistics.resolved },
      { name: 'En Attente', value: statistics.pending },
      { name: 'En Cours', value: statistics.inProgress },
    ];

    if (statusFilter !== 'all') {
      data = data.filter(entry => entry.name === statusFilter);
    }

    return (
      <div className="statistics-container">
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.map((entry) => (
            <Bar
              key={entry.name}
              dataKey="value"
              fill={getBarColor(entry.name)}
              name={entry.name}
              stackId="a"
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          ))}
        </BarChart>
      </div>
    );
  };

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
      <div className="analysis-container">
        <div className="status-filters">
          <button onClick={() => setStatusFilter('all')} className={statusFilter === 'all' ? 'active-filter' : ''}>Tous</button>
          <button onClick={() => setStatusFilter('Résolus')} className={statusFilter === 'Résolus' ? 'active-filter' : ''}>Résolus</button>
          <button onClick={() => setStatusFilter('En Attente')} className={statusFilter === 'En Attente' ? 'active-filter' : ''}>En Attente</button>
          <button onClick={() => setStatusFilter('En Cours')} className={statusFilter === 'En Cours' ? 'active-filter' : ''}>En Cours</button>
        </div>
        <div className="analysis-content">
          <div className="chart-container">
            {renderFilteredStatistics()}
          </div>
          <div className="table-container">
            <div className="report-details">
              <ReportTable reports={reportDetails} setSelectedReport={setSelectedReport} setIsModalOpen={setIsModalOpen} />
            </div>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          reportDetails={selectedReport}
        />
      </div>
    </div>
  );
};

const ReportTable = ({ reports, setSelectedReport, setIsModalOpen }) => {
  console.log('Rapports affichés dans le tableau:', reports);
  
  return (
    <table className="report-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Lieu</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {reports.length > 0 ? (
          reports.map(report => (
            <tr key={report.id} onClick={() => {
              setSelectedReport(report);
              setIsModalOpen(true);
            }}>
              <td>{report.description}</td>
              <td>{report.location}</td>
              <td>{report.status}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3">Aucune donnée disponible pour ce filtre.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default AnalyzeReports;