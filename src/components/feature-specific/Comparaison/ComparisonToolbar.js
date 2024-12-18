import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import '../../../styles/Comparison.css';

const ComparisonToolbar = ({ onFetchData, onSortChange }) => {
  const [locationsInput, setLocationsInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // État pour l'icône de chargement

  const handleSubmit = () => {
    setIsLoading(true);
    onFetchData(locationsInput);

    setTimeout(() => {
      setIsLoading(false); 
      setIsModalOpen(false); 
    }, 2000); 
  };

  return (
    <div className="comparison-toolbar">
      <select onChange={(e) => onSortChange(e.target.value)}>
        <option value="air_quality">Qualité de l'air 🌬</option>
        <option value="weather.temperature">Température 🌡️</option>
        <option value="weather.humidity">Humidité 💧</option>
      </select>

      <button className="btn-open-modal-cp" onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faBars} /> Ouvrir Menu
      </button>


      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn-close" onClick={() => setIsModalOpen(false)}>
              ×
            </button>
            <h2>Comparer les Données</h2>

            <input
              className='recherche-comparison'
              type="text"
              placeholder="Entrez les noms de villes separés par des virgules ... "
              value={locationsInput}
              onChange={(e) => setLocationsInput(e.target.value)}
            />

            <button className="btn-submit" onClick={handleSubmit}>
              {isLoading && <span className="loader"></span>} ✔️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonToolbar;
