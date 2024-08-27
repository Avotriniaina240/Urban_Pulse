// src/pages/HistoricalAndPrediction.js
import React, { useState, useEffect } from 'react';
import Navbar from '../StyleBar/Navbar/Navbar'; // Assurez-vous que le chemin est correct
import Sidebar from '../StyleBar/Sidebar/SidebarRA'; // Assurez-vous que le chemin est correct
import CitySelector from '../Prediction/CitySelector';
import IndicatorSelector from '../Prediction/IndicatorSelector';
import DateRangePicker from '../Prediction/DateRangePicker';
import TimeSeriesChart from '../Prediction/TimeSeriesChart';
import 'chartjs-adapter-date-fns'; // Import de l'adaptateur de date pour les échelles de temps
import '../styles/Analyse/HistoricalAndPrediction.css';

// Données fictives pour les villes
const mockCities = [
  { id: '1', name: 'Paris' },
  { id: '2', name: 'New York' },
  { id: '3', name: 'Tokyo' }
];

// Données fictives pour les indicateurs
const mockIndicators = [
  { id: '1', name: 'Température' },
  { id: '2', name: 'Précipitations' },
  { id: '3', name: 'Pollution' }
];

// Données fictives pour le graphique
const mockChartData = {
  labels: [
    '2024-08-25', '2024-08-26', '2024-08-27', '2024-08-28', '2024-08-29'
  ],
  historical: [
    { x: '2024-08-25', y: 22 },
    { x: '2024-08-26', y: 24 },
    { x: '2024-08-27', y: 20 },
    { x: '2024-08-28', y: 23 },
    { x: '2024-08-29', y: 25 }
  ],
  predicted: [
    { x: '2024-08-30', y: 27 },
    { x: '2024-08-31', y: 26 }
  ]
};

const HistoricalAndPrediction = () => {
  const [cities, setCities] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], historical: [], predicted: [] });

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);

  // Utiliser les données fictives pour les villes et les indicateurs
  useEffect(() => {
    setCities(mockCities);
    setIndicators(mockIndicators);
  }, []); // Dépendances vides car les données sont fixes

  // Simuler la récupération des données du graphique
  useEffect(() => {
    if (selectedCity && selectedIndicator && dateRange) {
      // Simuler le filtrage des données fictives en fonction des sélections
      setChartData(mockChartData);
    }
  }, [selectedCity, selectedIndicator, dateRange]); // Ajouter les dépendances nécessaires

  return (
    <div className="historical-prediction-container">
      <Navbar onSearchChange={() => {}} /> {/* Ajustez si nécessaire */}
      <div className="main-content">
        <Sidebar />
        <div className="content">
          <h1>Données Historique et Prediction</h1>

          <div className="selectors">
            <CitySelector cities={cities} onSelectCity={setSelectedCity} />
            <IndicatorSelector indicators={indicators} onSelectIndicator={setSelectedIndicator} />
            <DateRangePicker onDateChange={setDateRange} />
          </div>
          
          <TimeSeriesChart data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default HistoricalAndPrediction;
