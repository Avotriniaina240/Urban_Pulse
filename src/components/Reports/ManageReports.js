import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importer la fonction toast
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import '../styles/ATS/ManageReports.css';

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // Nouveau état pour le filtre de statut
  const reportListRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la récupération des données');
        } else {
          throw new Error('Le serveur a renvoyé une réponse non valide.');
        }
      }

      const data = await response.json();
      setReports(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    console.log('ID du rapport à supprimer:', id);
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
  
      const contentType = response.headers.get('content-type');
  
      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la suppression du rapport');
        } else {
          throw new Error('Le serveur a renvoyé une réponse non valide.');
        }
      }
  
      setReports(reports.filter((report) => report.id !== id));
      toast.success('Rapport supprimé !');
      setSelectedReportId(null);
    } catch (error) {
      console.error('Erreur lors de la suppression du rapport:', error);
      setError(error.message);
    }
  };
  
  const handleEdit = (id) => {
    navigate(`/edit-report/${id}`);
  };

  const handleClickOutside = (event) => {
    if (reportListRef.current && !reportListRef.current.contains(event.target)) {
      setSelectedReportId(null);
    }
  };

  const handleReportClick = (id) => {
    setSelectedReportId(selectedReportId === id ? null : id);
  };

  const filteredReports = reports
    .filter((report) =>
      (report.description && report.description.toLowerCase().includes(searchText.toLowerCase())) ||
      (report.status && report.status.toLowerCase().includes(searchText.toLowerCase()))
    )
    .filter((report) => statusFilter === 'all' || report.status === statusFilter); // Filtrer par statut

  // Calculer les statistiques
  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const inProgressReports = reports.filter(r => r.status === 'in-progress').length;

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

      <div className="reports-header-list">
        <h2>Gérer les Signalements</h2>
        <input
          type="text"
          placeholder="Rechercher par description ou statut..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />

        {/* Filtres de statut */}
        <div className="status-filters">
          <button onClick={() => setStatusFilter('all')} className={statusFilter === 'all' ? 'active-filter' : ''}>Tous</button>
          <button onClick={() => setStatusFilter('resolved')} className={statusFilter === 'resolved' ? 'active-filter' : ''}>Résolus</button>
          <button onClick={() => setStatusFilter('pending')} className={statusFilter === 'pending' ? 'active-filter' : ''}>En Attente</button>
          <button onClick={() => setStatusFilter('in-progress')} className={statusFilter === 'in-progress' ? 'active-filter' : ''}>En Cours</button>
        </div>
      </div>

      <div className="report-stats">
        <p><strong>Total des Signalements:</strong> {totalReports}</p>
        <p><strong>Résolus:</strong> {resolvedReports}</p>
        <p><strong>En Attente:</strong> {pendingReports}</p>
        <p><strong>En Cours:</strong> {inProgressReports}</p>
      </div>

      <div className="report-management" ref={reportListRef}>
        {loading && <div>Chargement...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && filteredReports.map((report) => (
          <div
            key={report.id}
            className={`report-item ${selectedReportId === report.id ? 'active' : ''}`}
            onClick={() => handleReportClick(report.id)}
          >
            <div>
              <strong>Description:</strong> {report.description} <br />
              <strong>Statut:</strong> {report.status}
            </div>
            {selectedReportId === report.id && (
              <div className="report-actions" onClick={(e) => e.stopPropagation()}>
                <button className="action-button-mod" onClick={() => handleEdit(report.id)}>
                  Modifier
                </button>
                <button className="action-button-supp" onClick={() => handleDelete(report.id)}>
                  Supprimer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageReports;
