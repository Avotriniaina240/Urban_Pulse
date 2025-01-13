import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';
import { Search, Trash2, MoreVertical, AlertCircle, Clock, CheckCircle } from 'lucide-react';

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
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/reports`, {
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
      toast.error(error.message);
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
      toast.success('Rapport supprimé avec succès');
      setSelectedReportId(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusChange = async (id, statusToUpdate) => {
    const validStatuses = ['soumis', 'en attente', 'en cours', 'résolu'];

    if (!validStatuses.includes(statusToUpdate)) {
      toast.error('Statut invalide');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/reports/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: statusToUpdate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du statut');
      }

      // Mettre à jour l'état local immédiatement
      setStatusMap(prevStatusMap => ({
        ...prevStatusMap,
        [id]: statusToUpdate,
      }));

      toast.success('Statut mis à jour');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReportClick = (id) => {
    setSelectedReportId(selectedReportId === id ? null : id);
  };

  const handleClickOutside = (event) => {
    if (reportListRef.current && !reportListRef.current.contains(event.target)) {
      setSelectedReportId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'en cours':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'résolu':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'en attente':
        return <AlertCircle className="h-4 w-4 text-blue-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'en cours':
        return 'bg-blue-100 text-blue-800';
      case 'résolu':
        return 'bg-green-100 text-green-800';
      case 'en attente':
        return 'bg-blue-50 text-blue-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getFilteredReportsByStatus = (status) => {
    return reports
      .filter((report) =>
        (report.description && report.description.toLowerCase().includes(searchText.toLowerCase())) ||
        (report.status && report.status.toLowerCase().includes(searchText.toLowerCase()))
      )
      .filter((report) => report.status === status);
  };

  const renderReportCard = (report) => (
    <div
      key={report.id}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-4 border-l-4 border-blue-400 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {getStatusIcon(report.status)}
            <div>
              <p className="text-sm font-medium text-gray-900">{report.description}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => handleReportClick(report.id)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </button>
            {selectedReportId === report.id && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={statusMap[report.id] || 'soumis'}
                    onChange={(e) => handleStatusChange(report.id, e.target.value)}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <option value="soumis">Soumis</option>
                    <option value="en attente">En attente</option>
                    <option value="en cours">En cours</option>
                    <option value="résolu">Résolu</option>
                  </select>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                      <div className="mt-2 text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Carte pour afficher tous les rapports */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Tous les rapports</h2>
                    <div className="flex flex-wrap gap-4">
                      {reports.filter((report) =>
                        report.description.toLowerCase().includes(searchText.toLowerCase())
                      ).map(renderReportCard)}
                    </div>
                  </div>

                  {/* Carte pour les rapports filtrés par statut */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 mb-4">
                      <h2 className="text-lg font-semibold text-blue-800 mb-4">En attente</h2>
                      <div className="flex flex-wrap gap-4">
                        {getFilteredReportsByStatus('en attente').map(renderReportCard)}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-lg border border-blue-300 mb-4">
                      <h2 className="text-lg font-semibold text-blue-800 mb-4">En cours</h2>
                      <div className="flex flex-wrap gap-4">
                        {getFilteredReportsByStatus('en cours').map(renderReportCard)}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 mb-4">
                      <h2 className="text-lg font-semibold text-green-800 mb-4">Résolus</h2>
                      <div className="flex flex-wrap gap-4">
                        {getFilteredReportsByStatus('résolu').map(renderReportCard)}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageReports;
