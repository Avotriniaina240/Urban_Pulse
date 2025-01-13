import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutWithLegend = ({ data }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const legendItems = data.labels.map((label, index) => ({
    label,
    color: data.datasets[0].backgroundColor[index],
    value: data.datasets[0].data[index]
  }));

  const total = legendItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="relative" style={{ height: '300px' }}>
        <Doughnut data={data} options={chartOptions} />
      </div>
      
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap items-center gap-4 justify-center mt-4">
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
    </div>
  );
};

export default DoughnutWithLegend;