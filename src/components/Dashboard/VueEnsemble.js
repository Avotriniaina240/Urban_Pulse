import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import '../styles/Admin/VueEnsemble.css';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const VueEnsemble = () => {
  const [stats, setStats] = useState({ newUsers: 0, totalUsers: 0 });
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const statsResponse = await axios.get('http://localhost:5000/admin/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assurez-vous que le token est correctement stocké
          }
        });
        setStats(statsResponse.data);

        const monthlyResponse = await axios.get('http://localhost:5000/admin/monthly-stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assurez-vous que le token est correctement stocké
          }
        });
        setMonthlyStats(monthlyResponse.data);
      } catch (err) {
        setError('Erreur lors de la récupération des données.');
        console.error(err);
      }
    }

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

  return (
    <div className="vue">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content">
          <h1 className='h1'>Tableau de Bord Administrateur</h1>
          
          <div className="stats-overview">
            <h2>Vue d'ensemble</h2>
            <p><strong>Utilisateurs Totaux :</strong> {stats.totalUsers}</p>
            <p><strong>Nouveaux Utilisateurs ce Mois :</strong> {stats.newUsers}</p>
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
