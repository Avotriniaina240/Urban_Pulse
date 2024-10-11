import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';
import '../styles/ATS/ManageReports.css';

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusMap, setStatusMap] = useState({});
  const reportListRef = useRef(null);

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
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/reports`, {
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
      const initialStatusMap = data.reduce((acc, report) => {
        acc[report.id] = report.status;
        return acc;
      }, {});
      setStatusMap(initialStatusMap);
    } catch (error) {
      setError(error.message);
      console.error('Erreur lors de la récupération des rapports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/reports/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression du rapport');
      }

      setReports(reports.filter((report) => report.id !== id));
      toast.success('Rapport supprimé !');  // Assurez-vous que cette ligne est appelée une seule fois
      setSelectedReportId(null);
    } catch (error) {
      setError(error.message);
      toast.error(error.message); // Ajouter un toast.error pour les erreurs
      console.error('Erreur lors de la suppression du rapport:', error);
    }
  };

  const handleStatusChange = async (id, statusToUpdate) => {
    const validStatuses = ['soumis', 'en attente', 'en cours', 'résolu'];

    if (!statusToUpdate || !validStatuses.includes(statusToUpdate)) {
      toast.error('Le statut est requis et doit être valide');
      console.error('Statut invalide:', statusToUpdate);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/reports/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: statusToUpdate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du statut');
      }

      toast.success('Statut mis à jour avec succès !');  // Assurez-vous que cette ligne est appelée une seule fois
    } catch (error) {
      setError(error.message);
      toast.error(error.message); // Ajouter un toast.error pour les erreurs
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const handleClickOutside = (event) => {
    if (reportListRef.current && !reportListRef.current.contains(event.target)) {
      setSelectedReportId(null);
    }
  };

  const handleReportClick = (id) => {
    setSelectedReportId(selectedReportId === id ? null : id);
  };

  const handleStatusSelectChange = (id, value) => {
    setStatusMap((prevStatusMap) => {
      const updatedStatusMap = { ...prevStatusMap, [id]: value };
      handleStatusChange(id, value); // Met à jour immédiatement le statut
      return updatedStatusMap;
    });
  };

  const filteredReports = reports
    .filter((report) =>
      (report.description && report.description.toLowerCase().includes(searchText.toLowerCase())) ||
      (report.status && report.status.toLowerCase().includes(searchText.toLowerCase()))
    )
    .filter((report) => statusFilter === 'all' || report.status === statusFilter);

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="home-container"></div>
      <div className="reports-header-list">
        <h2>Gérer les Signalements</h2>
        <input
          type="text"
          placeholder="Rechercher par description ou statut..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
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
                <select
                  value={statusMap[report.id] || 'soumis'}
                  onChange={(e) => handleStatusSelectChange(report.id, e.target.value)}
                  className="status-select"
                >
                  <option value="soumis">Soumis</option>
                  <option value="en attente">En attente</option>
                  <option value="en cours">En cours</option>
                  <option value="résolu">Résolu</option>
                </select>
                <button className="action-button-supp" onClick={() => handleDelete(report.id)}>
                  <i className="fas fa-trash"></i> {/* Remplace le texte par une icône */}Supprimer
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
