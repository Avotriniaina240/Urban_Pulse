import React, { useState, useEffect } from 'react';
import Navbar from '../../layouts/Navbar/Navbar';
import Sidebar from '../../layouts/Sidebar/SidebarCarte';
import { fetchUserStats } from '../../../services/userStatsService';
import ChartWithLegend from './ChartWithLegend';
import { CircleUserRound, Users, Building2, Loader2 } from 'lucide-react';
import DoughnutWithLegend from './DoughnutWithLegend'; 
import BubbleChart from './BubbleChart'; 

const StatCard = ({ title, value, icon: Icon, color, percentage }) => (
  <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        {percentage && (
          <p className="text-sm text-green-600 mt-1 cursor-pointer">
            +{percentage}% depuis le mois dernier
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
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
    labels: ['Citoyens', 'Administrateurs', 'Urbanistes'],
    datasets: [{
      label: 'Répartition des Utilisateurs',
      data: [stats.citizenCount, stats.adminCount, stats.urbanistCount],
      backgroundColor: ['#4caf50', '#ff6384', '#36a2eb'],
    }],
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16">
          <div className="p-8 bg-gray-50 min-h-screen">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Tableau de Bord Administrateur
              </h1>
              <p className="text-gray-600">
                Vue d'ensemble des statistiques utilisateurs
              </p>
            </div>

            {error ? (
              <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-red-700">Erreur : {error}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    title="Total Utilisateurs"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-blue-500"
                    percentage={12}
                  />
                  <StatCard
                    title="Citoyens"
                    value={stats.citizenCount}
                    icon={CircleUserRound}
                    color="bg-green-500"
                    percentage={8}
                  />
                  <StatCard
                    title="Administrateurs"
                    value={stats.adminCount}
                    icon={Building2}
                    color="bg-purple-500"
                    percentage={5}
                  />
                  <StatCard
                    title="Urbanistes"
                    value={stats.urbanistCount} 
                    icon={Building2} 
                    color="bg-yellow-500" 
                    percentage={7} 
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                      Répartition des Utilisateurs
                    </h2>
                    <DoughnutWithLegend data={percentageData} />
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">
                        Graphique des Utilisateurs
                      </h2>
                      <select
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="bar">Barres</option>
                        <option value="line">Ligne</option>
                        <option value="area">Aires</option>
                        <option value="bubble">Bulles</option> {/* Option pour graphique à bulles */}
                      </select>
                    </div>

                    {/* Affichage des différents graphiques en fonction du type sélectionné */}
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
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VueEnsemble;
