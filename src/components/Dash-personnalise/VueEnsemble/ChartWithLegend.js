import React from 'react';
import ChartComponent from './ChartComponent';

const Legend = ({ stats, chartType }) => {
  const legendItems = [
    { label: 'Citoyens', value: stats.citizenCount, color: '#4caf50' },
    { label: 'Administrateurs', value: stats.adminCount, color: '#ff6384' },
    { label: 'Urbanistes', value: stats.urbanistCount, color: '#36a2eb' }
  ];

  const total = legendItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex justify-center mt-4">
      <div className="inline-flex flex-wrap items-center gap-4 justify-center">
        {legendItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-medium text-gray-600">
              {item.label}
            </span>
            <span className="text-sm font-bold text-gray-900">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChartWithLegend = ({ stats, chartType, setChartType }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative h-64">
          <ChartComponent 
            stats={stats} 
            chartType={chartType} 
            setChartType={setChartType} 
          />
        </div>
      </div>
      <Legend stats={stats} chartType={chartType} />
    </div>
  );
};

export default ChartWithLegend;