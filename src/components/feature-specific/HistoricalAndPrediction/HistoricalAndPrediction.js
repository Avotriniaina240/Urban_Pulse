import React, { useState } from 'react';
import Navbar from '../../layout/Navbar';
import Sidebar from '../../layout/Sidebar';
import ChartContainer from './ChartContainer';
import { useWeatherData } from '../../../hooks/useWeatherData';
import { useGeolocation } from '../../../hooks/useGeolocation';
import '../../../styles/Analyse/HistoricalAndPrediction.css';

const HistoricalAndPrediction = () => {
    const [locationsInput, setLocationsInput] = useState('');
    const { position, error: geoError } = useGeolocation();
    const { 
        weatherData, 
        loading, 
        error, 
        fetchData, 
        cityName, 
        daysStudied, 
        temperatureRange, 
        humidityRange 
    } = useWeatherData(position);

    return (
        <div className="page-container-pre">
            <Navbar />
            <div className="main-content-pre">
                <Sidebar />
                <div className="content-pre">
                    <div className="header-pre">
                        <h1 className='urb-h1-pre'>Données et Prédiction</h1>
                    </div>
                    <div className="input-section-pre">
                        <input
                            className='input-pred'
                            type="text"
                            placeholder="Entrez le nom de la ville"
                            value={locationsInput}
                            onChange={(e) => setLocationsInput(e.target.value)}
                        />
                        <button className="btnpre" onClick={() => fetchData(locationsInput)} disabled={loading}>
                            Rechercher
                        </button>
                    </div>
                    {loading && <p>Chargement des données...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <ChartContainer 
                        weatherData={weatherData}
                        cityName={cityName}
                        daysStudied={daysStudied}
                        temperatureRange={temperatureRange}
                        humidityRange={humidityRange}
                    />
                </div>
            </div>
        </div>
    );
};

export default HistoricalAndPrediction;