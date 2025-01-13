import React, { useState, useEffect } from 'react';
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';
import { useStatistics } from '../Reports/StatisticsContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import Modal from '../Reports/Modal';
import { AlertCircle, FileBarChart, Search, ExternalLink, Filter } from 'lucide-react';

const AnalyzeReports = () => {
  const { statistics, setStatistics } = useStatistics();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [reportDetails, setReportDetails] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleFetchError = async (response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des données');
    } else {
      throw new Error('Le serveur a renvoyé une réponse non valide.');
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/reports/statistics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) await handleFetchError(response);
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchReportDetails = async () => {
    try {
      const detailsResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/reports?status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!detailsResponse.ok) await handleFetchError(detailsResponse);
      const detailsData = await detailsResponse.json();
      setReportDetails(detailsData);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchStatistics(), fetchReportDetails()]);
      setLoading(false);
    };
    fetchData();
  }, [statusFilter]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'résolus':
        return 'bg-green-100 text-green-800';
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en cours':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBarColor = (name) => {
    switch (name) {
      case 'Total':
        return '#6366f1';
      case 'Résolus':
        return '#10b981';
      case 'En Attente':
        return '#f59e0b';
      case 'En Cours':
        return '#3b82f6';
      default:
        return '#6366f1';
    }
  };

  const renderFilteredStatistics = () => {
    if (error) return (
      <div className="flex items-center justify-center p-6 bg-red-50 rounded-lg">
        <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
        <p className="text-red-700">{error}</p>
      </div>
    );

    if (!statistics) return (
      <div className="flex items-center justify-center p-6">
        <p className="text-gray-500">Les données ne sont pas disponibles.</p>
      </div>
    );

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
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques des Signalements</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              {data.map((entry) => (
                <Bar
                  key={entry.name}
                  dataKey="value"
                  fill={getBarColor(entry.name)}
                  name={entry.name}
                  radius={[4, 4, 0, 0]}
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const filteredReports = reportDetails.filter(report =>
    report.description.toLowerCase().includes(searchText.toLowerCase()) ||
    report.location.toLowerCase().includes(searchText.toLowerCase()) ||
    report.status.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileBarChart className="h-6 w-6 text-indigo-500" />
                </div>
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
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    {['all', 'Résolus', 'En Attente', 'En Cours'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          statusFilter === status
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {status === 'all' ? 'Tous' : status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
                    </div>
                  ) : (
                    renderFilteredStatistics()
                  )}
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Détails des Signalements</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                              <tr key={report.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                    {report.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setIsModalOpen(true);
                                    }}
                                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                  >
                                    Voir détails
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                Aucune donnée disponible pour ce filtre.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} reportDetails={selectedReport} />
    </div>
  );
};

export default AnalyzeReports;