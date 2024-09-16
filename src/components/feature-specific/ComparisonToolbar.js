import React, { useState } from 'react';

const ComparisonToolbar = ({ onFetchData, onSortChange }) => {
  const [locationsInput, setLocationsInput] = useState('');
  const [coordinatesInput, setCoordinatesInput] = useState('');
  const [neighborhoodsInput, setNeighborhoodsInput] = useState('');

  const handleSubmit = () => {
    onFetchData(locationsInput, coordinatesInput, neighborhoodsInput);
  };

  return (
    <div className="comparison-toolbar">
      <input
        type="text"
        placeholder="Entrez les noms de villes (,) "
        value={locationsInput}
        onChange={(e) => setLocationsInput(e.target.value)}
      />
      <input
        type="text"
        placeholder="Entrez les coordonnées (lat,lng) (,) "
        value={coordinatesInput}
        onChange={(e) => setCoordinatesInput(e.target.value)}
      />
      <input
        type="text"
        placeholder="Entrez les noms des quartiers (,) "
        value={neighborhoodsInput}
        onChange={(e) => setNeighborhoodsInput(e.target.value)}
      />
      <button onClick={handleSubmit}>Traiter</button>
      <select onChange={(e) => onSortChange(e.target.value)}>
        <option value="air_quality">Qualité de l'air 🌬</option>
        <option value="weather.temperature">Température 🌡️</option>
        <option value="weather.humidity">Humidité 💧</option>
      </select>
    </div>
  );
};

export default ComparisonToolbar;