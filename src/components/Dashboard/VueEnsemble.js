import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import '../styles/Admin/VueEnsemble.css';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler, ArcElement);

const VueEnsemble = () => {
  const [stats, setStats] = useState({ weeklyNewUsers: 0, totalUsers: 0 });
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await fetch('http://localhost:5000/api/user-stats');
        const weeklyResponse = await fetch('http://localhost:5000/api/user-weekly-stats');
        
        if (!statsResponse.ok || !weeklyResponse.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        
        const statsData = await statsResponse.json();
        const weeklyData = await weeklyResponse.json();

        console.log('Weekly Stats:', weeklyData);

        setStats({
          weeklyNewUsers: weeklyData.weekly_new_users || 0,
          totalUsers: statsData.total_users || 0,
        });

        setWeeklyStats(weeklyData.stats || []);  // Assurez-vous que "stats" est un tableau dans la réponse
      } catch (err) {
        setError('Erreur lors de la récupération des données.');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Vérifiez si weeklyStats contient des données
  const chartData = {
    labels: weeklyStats.length > 0 ? weeklyStats.map(stat => `Semaine ${stat.week}`) : ['Aucune semaine disponible'],
    datasets: [
      {
        label: 'Utilisateurs inscrits',
        data: weeklyStats.length > 0 ? weeklyStats.map(stat => stat.userCount) : [0],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const percentageData = {
    labels: ['Nouveaux Utilisateurs cette semaine', 'Autres Utilisateurs'],
    datasets: [
      {
        label: 'Répartition des Utilisateurs',
        data: [stats.weeklyNewUsers, stats.totalUsers - stats.weeklyNewUsers],
        backgroundColor: ['#4caf50', '#e6e6e6'],
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
          
          <div className="stats-overview">
            <div className="stats-column">
              <div className="percentage-chart">
                <Doughnut data={percentageData} options={{ maintainAspectRatio: false }} />
                <div className="percentage-text">{stats.weeklyNewUsers}</div>
              </div>
            </div>

            <div className="stats-column">
              <div className="percentage-chart">
                <Doughnut data={{
                  labels: ['Total Utilisateurs'],
                  datasets: [{
                    data: [stats.totalUsers],
                    backgroundColor: ['#2196f3'],
                  }],
                }} options={{ maintainAspectRatio: false }} />
                <div className="percentage-text">{stats.totalUsers}</div>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <h2>Graphique des Utilisateurs par Semaine</h2>
            <Line data={chartData} />
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default VueEnsemble;