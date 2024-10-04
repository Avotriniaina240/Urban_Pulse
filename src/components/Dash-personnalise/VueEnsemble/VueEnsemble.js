import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Navbar from '../../StyleBar/Navbar/Navbar';
import Sidebar from '../../StyleBar/Sidebar/SidebarCarte';
import '../../styles/Admin/VueEnsemble.css';
import { fetchUserStats } from '../../../services/userStatsService'; 
import ChartWithLegend from './ChartWithLegend'; 

const VueEnsemble = () => {
  const [stats, setStats] = useState({ citizenCount: 0, adminCount: 0, urbanistCount: 0, totalUsers: 0 });
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
    datasets: [
      {
        label: 'Répartition des Utilisateurs',
        data: [stats.citizenCount, stats.adminCount, stats.urbanistCount],
        backgroundColor: ['#4caf50', '#ff6384', '#36a2eb'],
      },
    ],
  };

  return (
    <div className="vue">
      <Navbar />
      <div className="main-vue">
        <Sidebar />
        <div className="content-vue">
          <h1 className='h1-vue'>Tableau de Bord Administrateur</h1>

          {!isLoading && !error && (
            <>
              <div className="stats-overview">
                <div className="stats-column">
                  <div className="percentage-chart">
                    <Doughnut data={percentageData} />
                    <div className="percentage-text">{stats.totalUsers}</div>
                  </div>
                </div>
              </div>

              <div className="chart-container-vue">
                <h2 className="chart-container-h2">Graphique des Utilisateurs</h2>
                <ChartWithLegend stats={stats} chartType={chartType} setChartType={setChartType} />
              </div>
            </>
          )}

          {error && <div className="error-message">Erreur : {error}</div>}
        </div>
      </div>
    </div>
  );
};

export default VueEnsemble;
