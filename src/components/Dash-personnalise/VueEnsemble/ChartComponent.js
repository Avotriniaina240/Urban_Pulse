import React, { useEffect, useState, useRef } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import '../../styles/Admin/VueEnsemble.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const ChartComponent = ({ stats, chartType, setChartType }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

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

    return () => {
      clearInterval(intervalRef.current); // Nettoyer l'intervalle
    };
  }, [setChartType]);

  return (
    <div className={`chart-wrapper ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      {chartType === 'bar' ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default ChartComponent;
