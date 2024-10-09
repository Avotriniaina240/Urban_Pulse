import React from 'react';
import ChartComponent from './ChartComponent';
import Legend from './Legend';
import '../../styles/Admin/VueEnsemble.css';

const ChartWithLegend = ({ stats, chartType, setChartType }) => {
  return (
    <div className="chart-with-legend">
      <div className="ChartComponent">
        <ChartComponent stats={stats} chartType={chartType} setChartType={setChartType} />
      </div>
        <Legend stats={stats} chartType={chartType} />
      </div>
  );
};

export default ChartWithLegend;
