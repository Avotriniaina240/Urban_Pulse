import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { Link } from 'react-router-dom'; // Assurez-vous d'importer Link ici
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';

const ReportsListe = () => {
  const [reports, setReports] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  const loadAndDisplayNotifications = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_NOTIFICATIONS_API_URL);
      const data = await response.json();
      console.log(data);  // Affichez les notifications si nécessaire
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token missing');
      }

      const decodedToken = jwtDecode(token);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/users/${decodedToken.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentUser(response.data);
    } catch (error) {
      console.error('Failed to load user profile', error);
      setError('Erreur lors du chargement du profil');
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/reports`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const reportsData = response.data;
      setReports(reportsData);

      const userIds = [...new Set(
        reportsData
          .map(report => report.user_id)
          .filter(userId => userId !== null && userId !== undefined)
      )];
      
      const usersData = {};
      await Promise.all(
        userIds.map(async (userId) => {
          if (!userId) {
            console.warn(`ID utilisateur invalide détecté : ${userId}`);
            return;
          }

          try {
            const userResponse = await axios.get(
              `${process.env.REACT_APP_BASE_URL}/users/${userId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            usersData[userId] = userResponse.data;
          } catch (error) {
            console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
            usersData[userId] = {
              name: 'Utilisateur inconnu',
              email: '',
              profilePictureUrl: null,
            };
          }
        })
      );

      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports :', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
    fetchReports();
  }, []);

  const getFilteredReports = () => {
    return reports.filter(report => 
      report.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      report.status?.toLowerCase().includes(searchText.toLowerCase()) ||
      users[report.user_id]?.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase().trim()) {
      case 'en cours':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'résolu':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'en attente':
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase().trim()) {
      case 'en cours':
        return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20';
      case 'résolu':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      case 'en attente':
        return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20';
    }
  };

  const renderReportCard = (report) => {
    const reportUser = users[report.user_id] || {
      name: 'Utilisateur inconnu',
      email: '',
      profilePictureUrl: null,
    };

    const isCurrentUserReport = currentUser && report.user_id === currentUser.id;

    return (
      <div key={report.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start space-x-4 mb-4">
            <div className="flex-shrink-0">
              {reportUser.profilePictureUrl ? (
                <img 
                  src={reportUser.profilePictureUrl}
                  alt={reportUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">
                    {reportUser.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {reportUser.name}
                    {isCurrentUserReport && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium text-lime-600 bg-lime-50 rounded-full">
                        Vous
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">{reportUser.email}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(report.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(report.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
              
              <Link
                to={`/report/${report.id}`}
                className="flex items-center text-sm font-medium text-lime-600 hover:text-lime-800 transition-colors group"
              >
                Détails 
                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher par description, statut ou utilisateur..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-lime-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {getFilteredReports().map(renderReportCard)}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsListe;
