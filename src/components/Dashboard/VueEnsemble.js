import React, { useState, useEffect, useRef } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import '../styles/Admin/VueEnsemble.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const VueEnsemble = () => {
  const [stats, setStats] = useState({ citizenCount: 0, adminCount: 0, urbanistCount: 0, totalUsers: 0 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user-stats');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données : ' + response.status);
        }
        const data = await response.json();
        if (!data.citizen_count || !data.admin_count || !data.urbanist_count || !data.total_users) {
          throw new Error('Données manquantes ou incorrectes.');
        }
        setStats({
          citizenCount: data.citizen_count,
          adminCount: data.admin_count,
          urbanistCount: data.urbanist_count,
          totalUsers: data.total_users,
        });
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

  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setChartType(prevType => (prevType === 'bar' ? 'line' : 'bar'));
          setIsTransitioning(false);
        }, 300);
      }, 5000);
    };

    startInterval();

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleMouseEnter = () => {
    setIsPaused(true);
    clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setChartType(prevType => (prevType === 'bar' ? 'line' : 'bar'));
        setIsTransitioning(false);
      }, 300);
    }, 5000);
  };

  const chartData = {
    labels: ['Citoyens', 'Administrateurs', 'Urbanistes'],
    datasets: [
      {
        label: 'Nombre d\'utilisateurs',
        data: [stats.citizenCount, stats.adminCount, stats.urbanistCount],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 0.5,
        tension: chartType === 'line' ? 0.4 : 0,
        fill: false,
      },
    ],
  };

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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'rgba(0,0,0,0.7)',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw} utilisateurs`;
          },
        },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutBounce',
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'rgba(0,0,0,0.7)',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutBounce',
    },
  };

  const renderChart = () => {
    const ChartComponent = chartType === 'bar' ? Bar : Line;
    return (
      <div className={`chart-wrapper ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <ChartComponent data={chartData} options={chartOptions} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
      </div>
    );
  };

  const renderLegend = () => {
    return (
      <div className={`chart-legend ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <h3>Légende détaillée</h3>
        <p>Ce graphique représente la répartition des utilisateurs par catégorie.</p>
        <ul>
          <li><span style={{color: 'rgba(75, 192, 192, 0.6)'}}>■</span> Citoyens: {stats.citizenCount} ({((stats.citizenCount / stats.totalUsers) * 100).toFixed(2)}%)</li>
          <li><span style={{color: 'rgba(255, 99, 132, 0.6)'}}>■</span> Administrateurs: {stats.adminCount} ({((stats.adminCount / stats.totalUsers) * 100).toFixed(2)}%)</li>
          <li><span style={{color: 'rgba(54, 162, 235, 0.6)'}}>■</span> Urbanistes: {stats.urbanistCount} ({((stats.urbanistCount / stats.totalUsers) * 100).toFixed(2)}%)</li>
        </ul>
        <p>Total des utilisateurs: {stats.totalUsers}</p>
        <p>Type de graphique actuel: {chartType === 'bar' ? 'Histogramme' : 'Courbe'}</p>
        {chartType === 'bar' ? (
          <p>L'histogramme permet de comparer facilement les quantités entre les différentes catégories.</p>
        ) : (
          <p>La courbe met en évidence la tendance et la progression entre les catégories.</p>
        )}
      </div>
    );
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
                    <Doughnut data={percentageData} options={doughnutOptions} />
                    <div className="percentage-text">{stats.totalUsers}</div>
                  </div>
                </div>
              </div>

              <div className="chart-container-vue">
                <h2 className="chart-container-h2">Graphique des Utilisateurs</h2>
                <div className="chart-with-legend">
                  {renderChart()}
                  {renderLegend()}
                </div>
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