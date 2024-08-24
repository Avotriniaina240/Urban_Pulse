import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import '../styles/Admin/VueEnsemble.css';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler, ArcElement);

const VueEnsemble = () => {
  const [stats, setStats] = useState({ newUsers: 0, totalUsers: 0 });
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [error, setError] = useState('');

  // Simuler des données fictives
  useEffect(() => {
    const fetchData = () => {
      try {
        // Données fictives pour les statistiques générales
        const statsResponse = {
          newUsers: 35,
          totalUsers: 4500,
        };
        setStats(statsResponse);

        // Données fictives pour les statistiques mensuelles
        const monthlyResponse = [
          { month: 'Janvier', userCount: 300 },
          { month: 'Février', userCount: 250 },
          { month: 'Mars', userCount: 400 },
          { month: 'Avril', userCount: 350 },
          { month: 'Mai', userCount: 500 },
          { month: 'Juin', userCount: 600 },
          { month: 'Juillet', userCount: 550 },
          { month: 'Août', userCount: 700 },
          { month: 'Septembre', userCount: 650 },
          { month: 'Octobre', userCount: 750 },
          { month: 'Novembre', userCount: 800 },
          { month: 'Décembre', userCount: 900 },
        ];
        setMonthlyStats(monthlyResponse);
      } catch (err) {
        setError('Erreur lors de la récupération des données.');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: monthlyStats.map(stat => stat.month),
    datasets: [
      {
        label: 'Utilisateurs inscrits',
        data: monthlyStats.map(stat => stat.userCount),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const percentageData = {
    labels: ['Nouveaux Utilisateurs', 'Autres'],
    datasets: [
      {
        label: 'Répartition des Utilisateurs',
        data: [stats.newUsers, stats.totalUsers - stats.newUsers],
        backgroundColor: ['#4caf50', '#e6e6e6'],
      },
    ],
  };

  return (
    <div className="vue">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content">
          <h1 className='h1'>Tableau de Bord Administrateur</h1>
          
          <div className="stats-overview">
            <div className="stats-column">
              <div className="percentage-chart">
                <Doughnut data={percentageData} options={{ maintainAspectRatio: false }} />
                <div className="percentage-text">{stats.newUsers}</div>
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
            <h2>Graphique des Utilisateurs</h2>
            <Line data={chartData} />
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default VueEnsemble;
