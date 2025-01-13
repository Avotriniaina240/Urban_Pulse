import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ChartComponent = ({ stats, chartType }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    setChartData({
      labels: ['Citoyens', 'Administrateurs', 'Urbanistes'],
      datasets: [
        {
          label: "Nombre d'utilisateurs",
          data: [stats.citizenCount, stats.adminCount, stats.urbanistCount],
          backgroundColor: [
            'rgba(76, 175, 80, 0.6)',  // Green
            'rgba(255, 99, 132, 0.6)', // Pink
            'rgba(54, 162, 235, 0.6)'  // Blue
          ],
          borderColor: [
            'rgb(76, 175, 80)',  // Green
            'rgb(255, 99, 132)', // Pink
            'rgb(54, 162, 235)'  // Blue
          ],
          borderWidth: 1,
          tension: chartType === 'line' ? 0.4 : 0,
          fill: chartType === 'line' ? false : true,
        }
      ]
    });
  }, [stats, chartType]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 12
          },
          color: 'rgb(107, 114, 128)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          },
          color: 'rgb(107, 114, 128)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: 'rgb(17, 24, 39)',
        bodyColor: 'rgb(107, 114, 128)',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 14
        },
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw} utilisateurs`;
          }
        }
      }
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  };

  if (!chartData) {
    return <div className="h-full w-full flex items-center justify-center">Chargement...</div>;
  }

  const ChartType = chartType === 'bar' ? Bar : Line;
  
  return (
    <div className="w-full h-full">
      <ChartType data={chartData} options={chartOptions} />
    </div>
  );
};

export default ChartComponent;