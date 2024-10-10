import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/Analyse/AirQualitySimulation.css';

Modal.setAppElement('#root');

const AirQualitySimulation = () => {
  const [trafficReduction, setTrafficReduction] = useState(0);
  const [greenSpacesIncrease, setGreenSpacesIncrease] = useState(0);
  const [industrialPollutionReduction, setIndustrialPollutionReduction] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState('ensoleillé'); // conditions météorologiques
  const [populationDensity, setPopulationDensity] = useState(0);
  const [simulationResults, setSimulationResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Modèle de calcul amélioré
    const baseAirQuality = 100;
    const airQuality = baseAirQuality - (trafficReduction * 0.5) + (greenSpacesIncrease * 0.3) - (industrialPollutionReduction * 0.7);
    const temperature = 25 - (greenSpacesIncrease * 0.1) + (weatherCondition === 'ensoleillé' ? 1 : 0);
    const humidity = 60 - (trafficReduction * 0.2) + (populationDensity * 0.05);

    setSimulationResults({
      airQuality: airQuality.toFixed(2),
      temperature: temperature.toFixed(2),
      humidity: humidity.toFixed(2),
    });

    setIsModalOpen(true); // Ouvrir le modal avec les résultats
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSimulationResults(null); // Réinitialiser les résultats
  };

  return (
    <div className="air-quality-simulation">
      <h2>Simulation Test</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Réduction du Trafic (%):
          <input
            className='input-simulation'
            type="number"
            value={trafficReduction}
            onChange={(e) => setTrafficReduction(e.target.value)}
            min="0"
            max="100"
          />
        </label>
        <label>
          Augmentation des Espaces Verts (m²):
          <input
            className='input-simulation'
            type="number"
            value={greenSpacesIncrease}
            onChange={(e) => setGreenSpacesIncrease(e.target.value)}
            min="0"
          />
        </label>
        <label>
          Réduction de la Pollution Industrielle (%):
          <input
            className='input-simulation'
            type="number"
            value={industrialPollutionReduction}
            onChange={(e) => setIndustrialPollutionReduction(e.target.value)}
            min="0"
            max="100"
          />
        </label>
        <label>
          Conditions Météorologiques:
          <select value={weatherCondition} onChange={(e) => setWeatherCondition(e.target.value)}>
            <option value="ensoleillé">Ensoleillé</option>
            <option value="pluvieux">Pluvieux</option>
            <option value="nuageux">Nuageux</option>
          </select>
        </label>
        <label>
          Densité de Population (habitants/km²):
          <input
            type="number"
            value={populationDensity}
            onChange={(e) => setPopulationDensity(e.target.value)}
            min="0"
          />
        </label>
        <button type="submit">Faire une Simulation</button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h3>Résultats de la Simulation:</h3>
        {simulationResults && (
          <div className="results">
            <div className="result-item">
              <p>Humidité Estimée : <span>{simulationResults.humidity}%</span></p>
              <p className={simulationResults.humidity >= 50 ? 'normal' : 'low'}>
                {simulationResults.humidity >= 50 ? 'Normale' : 'Faible'}
              </p>
            </div>
            <div className="result-item">
              <p>Température Estimée : <span>{simulationResults.temperature}°C</span></p>
              <p className={simulationResults.temperature <= 25 ? 'normal' : 'high'}>
                {simulationResults.temperature <= 25 ? 'Normale' : 'Élevée'}
              </p>
            </div>
            <div className="result-item">
              <p>Qualité de l'Air : <span>{simulationResults.airQuality}</span></p>
              <p className={simulationResults.airQuality > 75 ? 'good' : 'bad'}>
                {simulationResults.airQuality > 75 ? 'Bonne' : 'Mauvaise'}
              </p>
            </div>
          </div>
        )}
        <button onClick={closeModal}>Fermer</button>
      </Modal>
    </div>
  );
};

export default AirQualitySimulation;
