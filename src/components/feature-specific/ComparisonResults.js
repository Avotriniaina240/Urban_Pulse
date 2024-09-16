import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ComparisonResults = ({ data, sortBy }) => {
  console.log('ComparisonResults received data:', data);

  if (!data || data.length === 0) {
    return <p>Aucune donnée disponible. Veuillez entrer des données valides et réessayer.</p>;
  }

  return (
    <div className="comparison-results">
      <div className="chart-container-comparison">
        <LineChart width={800} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="location" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="airQuality" name="Qualité de l'air 🌬" stroke="#8884d8" />
          <Line type="monotone" dataKey="weather.temperature" name="Température (°C) 🌡️" stroke="#ff7300" />
          <Line type="monotone" dataKey="weather.humidity" name="Humidité (%) 💧" stroke="#82ca9d" />
        </LineChart>
      </div>

      <ul className="data-list-comparison">
        {data.map((item, index) => (
          <li key={index} className={`data-item ${sortBy === 'air_quality' ? 'highlight-air-quality' : ''} ${sortBy === 'weather.temperature' ? 'highlight-temperature' : ''} ${sortBy === 'weather.humidity' ? 'highlight-humidity' : ''}`}>
            <p className='data-list-title'>{item.location}</p>
            <p>Qualité de l'air : {item.airQuality}</p>
            <p>Température : {item.weather.temperature}°C</p>
            <p>Humidité : {item.weather.humidity}%</p>
            <p>Météo : {item.weather.weather}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComparisonResults;