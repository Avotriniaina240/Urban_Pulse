// src/components/UrbanAnalysis.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import '../styles/Analyse/UrbanAnalysis.css';

const UrbanAnalysis = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/analysis/air-quality');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des données.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data ? data.map(d => d.timestamp) : [],
    datasets: [
      {
        label: 'PM10',
        data: data ? data.map(d => d.pm10) : [],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
      },
      {
        label: 'PM2.5',
        data: data ? data.map(d => d.pm2_5) : [],
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
      },
      // Ajouter d'autres datasets si nécessaire
    ],
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="analysis-container">
      <h2>Analyse des Données Urbaines</h2>
      <div className="chart-container">
        <Line data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default UrbanAnalysis;
