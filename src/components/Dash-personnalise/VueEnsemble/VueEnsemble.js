import React, { useState, useEffect } from 'react';
import Navbar from '../../layouts/Navbar/Navbar';
import Sidebar from '../../layouts/Sidebar/SidebarCarte';
import { fetchUserStats } from '../../../services/userStatsService';
import ChartWithLegend from './ChartWithLegend';
import { CircleUserRound, Users, Building2, Loader2, TrendingUp } from 'lucide-react';
import DoughnutWithLegend from './DoughnutWithLegend'; 
import BubbleChart from './BubbleChart'; 

const StatCard = ({ title, value, icon: Icon, color, percentage }) => (
  <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{value}</h3>
        {percentage && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <p className="text-sm font-semibold text-green-600">
              +{percentage}% depuis le mois dernier
            </p>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-2xl ${color} shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const VueEnsemble = () => {
  const [stats, setStats] = useState({
    citizenCount: 0,
    adminCount: 0,
    urbanistCount: 0,
    totalUsers: 0
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState('bar'); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserStats();
        setStats(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Erreur inconnue lors de la récupération des données.');
        console.error('Erreur de l\'API :', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const percentageData = {
    labels: ['Citoyens', 'Admin', 'Urbanistes'],
    datasets: [{
      label: 'Répartition des Utilisateurs',
      data: [stats.citizenCount, stats.adminCount, stats.urbanistCount],
      backgroundColor: ['#4caf50', '#ff6384', '#36a2eb'],
    }],
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600 font-medium">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16">
          <div className="p-8 min-h-screen">
            {/* Header avec tailles originales */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Tableau de Bord Administrateur
                  </h1>
                </div>
              </div>
              <p className="text-gray-600">
                Vue d'ensemble des statistiques utilisateurs
              </p>
            </div>

            {error ? (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">!</span>
                  </div>
                  <p className="text-red-700 font-medium">Erreur : {error}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Grid avec tailles originales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    title="Total Utilisateurs"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-gradient-to-r from-blue-500 to-blue-600"
                    percentage={12}
                  />
                  <StatCard
                    title="Citoyens"
                    value={stats.citizenCount}
                    icon={CircleUserRound}
                    color="bg-gradient-to-r from-green-500 to-green-600"
                    percentage={8}
                  />
                  <StatCard
                    title="Admin"
                    value={stats.adminCount}
                    icon={Building2}
                    color="bg-gradient-to-r from-purple-500 to-purple-600"
                    percentage={5}
                  />
                  <StatCard
                    title="Urbanistes"
                    value={stats.urbanistCount} 
                    icon={Building2} 
                    color="bg-gradient-to-r from-yellow-500 to-orange-500" 
                    percentage={7} 
                  />
                </div>

                {/* Charts Grid avec tailles originales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">%</span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Répartition des Utilisateurs
                      </h2>
                    </div>
                    <DoughnutWithLegend data={percentageData} />
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                          <span className="text-white font-bold text-xs"></span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                          Graphique des Utilisateurs
                        </h2>
                      </div>
                      <select
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        className="p-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                      >
                        <option value="bar">Barres</option>
                        <option value="line">Ligne</option>
                        <option value="area">Aires</option>
                        <option value="bubble">Bulles</option>
                      </select>
                    </div>

                    {/* Chart Display avec fond subtil */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      {chartType === 'bar' && (
                        <ChartWithLegend stats={stats} chartType={chartType} setChartType={setChartType} />
                      )}
                      {chartType === 'line' && (
                        <ChartWithLegend stats={stats} chartType={chartType} setChartType={setChartType} />
                      )}
                      {chartType === 'area' && (
                        <ChartWithLegend stats={stats} chartType={chartType} setChartType={setChartType} />
                      )}
                      {chartType === 'bubble' && (
                        <BubbleChart stats={stats} /> 
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VueEnsemble;