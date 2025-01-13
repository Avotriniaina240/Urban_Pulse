import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertTriangle, CheckCircle, Clock, AlertCircle, Filter } from 'lucide-react';
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';

const ReportsListe = () => {
  const [reports, setReports] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        if (!response.ok) throw new Error('Erreur lors de la récupération des données');
        const data = await response.json();
        setReports(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getFilteredReports = () => {
    return reports.filter(report => 
      report.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      report.status?.toLowerCase().includes(searchText.toLowerCase())
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

  const renderReportCard = (report) => (
    <div
      key={report.id}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden group"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(report.status)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 leading-5 mb-2 line-clamp-2">
                {report.description}
              </p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
            </div>
          </div>
          <Link
            to={`/report/${report.id}`}
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group-hover:translate-x-0.5 duration-200"
          >
            Détails 
            <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </Link>
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
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-10 pr-4 py-2 w-72 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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