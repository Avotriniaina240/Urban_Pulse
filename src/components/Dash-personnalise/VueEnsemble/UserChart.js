// UserChart.js
import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import '../../styles/Admin/VueEnsemble.css';

const UserChart = ({ chartType, chartData, chartOptions, handleMouseEnter, handleMouseLeave, isTransitioning }) => {
  const ChartComponent = chartType === 'bar' ? Bar : Line;

  return (
    <div className={`chart-wrapper ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      <ChartComponent 
        data={chartData} 
        options={chartOptions} 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave} 
      />
    </div>
  );
};

export default UserChart;
