import React from 'react';
import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, BubbleController, Title, Tooltip, Legend } from 'chart.js';

// Enregistrer les contrôleurs et éléments nécessaires pour BubbleChart
ChartJS.register(BubbleController, Title, Tooltip, Legend);

const BubbleChart = ({ stats }) => {
  const data = {
    datasets: [{
      label: 'Répartition des Utilisateurs',
      data: [
        { x: stats.citizenCount, y: 10, r: 10 },
        { x: stats.adminCount, y: 20, r: 15 },
        { x: stats.urbanistCount, y: 30, r: 20 },
      ],
      backgroundColor: '#36a2eb',
    }],
  };

  return (
    <Bubble data={data} />
  );
};

export default BubbleChart;
