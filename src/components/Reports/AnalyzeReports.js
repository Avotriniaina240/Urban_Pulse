import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import '../styles/ATS/AnalyzeReports.css';
import { useStatistics } from '../Reports/StatisticsContext'; // Importez le hook

const AnalyzeReports = () => {
  const { statistics, setStatistics } = useStatistics();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const handleFetchError = async (response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des données');
    } else {
      throw new Error('Le serveur a renvoyé une réponse non valide.');
    }
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reports/statistics?status=${statusFilter}`, {
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
        setStatistics(data); // Mettez à jour les statistiques dans le contexte
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [statusFilter]);

  const renderFilteredStatistics = () => {
    if (error) {
      return <p>Erreur: {error}</p>;
    }

    if (!statistics) {
      return <p>Les données ne sont pas disponibles.</p>;
    }

    switch (statusFilter) {
      case 'resolved':
        return statistics.resolved > 0 ? <p><strong>Signalements Résolus:</strong> {statistics.resolved}</p> : null;
      case 'pending':
        return statistics.pending > 0 ? <p><strong>Signalements En Attente:</strong> {statistics.pending}</p> : null;
      case 'in-progress':
        return statistics.inProgress > 0 ? <p><strong>Signalements En Cours:</strong> {statistics.inProgress}</p> : null;
      case 'all':
      default:
        return (
          <div className="statistics-container">
            <div className="statistics-item total-reports">
              <p><strong>Total des Signalements:</strong> {statistics.totalReports}</p>
            </div>
            <div className="statistics-item resolved">
              <p><strong>Signalements Résolus:</strong> {statistics.resolved}</p>
            </div>
            <div className="statistics-item pending">
              <p><strong>Signalements En Attente:</strong> {statistics.pending}</p>
            </div>
            <div className="statistics-item in-progress">
              <p><strong>Signalements En Cours:</strong> {statistics.inProgress}</p>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return <div>Chargement des données...</div>;
  }

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
          <button onClick={() => setStatusFilter('resolved')} className={statusFilter === 'resolved' ? 'active-filter' : ''}>Résolus</button>
          <button onClick={() => setStatusFilter('pending')} className={statusFilter === 'pending' ? 'active-filter' : ''}>En Attente</button>
          <button onClick={() => setStatusFilter('in-progress')} className={statusFilter === 'in-progress' ? 'active-filter' : ''}>En Cours</button>
        </div>
        {renderFilteredStatistics()}
      </div>
    </div>
  );
};

export default AnalyzeReports;
