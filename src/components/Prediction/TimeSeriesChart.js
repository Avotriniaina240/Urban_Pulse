import React from 'react';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS,CategoryScale,LinearScale,TimeScale,PointElement,LineElement,Title,Tooltip,Legend,} from 'chart.js';
import 'chartjs-adapter-date-fns';
ChartJS.register(CategoryScale,LinearScale,TimeScale,PointElement,LineElement,Title,Tooltip,Legend);


const TimeSeriesChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Données historiques',
        data: data.historical,
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Données prédites',
        data: data.predicted,
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
        borderDash: [5, 5], // Ligne pointillée pour les prédictions
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default TimeSeriesChart;
