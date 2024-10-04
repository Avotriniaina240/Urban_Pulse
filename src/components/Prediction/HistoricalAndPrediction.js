import React, { useState, useEffect } from 'react'; 
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import '../styles/Analyse/HistoricalAndPrediction.css';
import { fetchWeatherDataByCity, fetchWeatherDataByCoordinates } from '../../services/ServicePrediction';
import InputToolbar from './InputToolbar';
import BarChartComponent from './BarChartComponent';
import LineChartComponent from './LineChartComponent';

const HistoricalAndPrediction = () => {
    const [trendData, setTrendData] = useState([]);
    const [locationsInput, setLocationsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [daysStudied, setDaysStudied] = useState(0);
    const [temperatureRange, setTemperatureRange] = useState({ min: null, max: null });
    const [humidityRange, setHumidityRange] = useState({ min: null, max: null });
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [cityName, setCityName] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const weatherData = await fetchWeatherDataByCity(locationsInput);
            setCityName(locationsInput);
            setTrendData(weatherData);
            calculateStats(weatherData);
        } catch (err) {
            setError(`Une erreur est survenue: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (weatherData) => {
        const startDate = new Date(weatherData[0]?.time);
        const endDate = new Date(weatherData[weatherData.length - 1]?.time);
        const diffDays = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));
        setDaysStudied(diffDays);

        const temperatures = weatherData.map(d => d.temperature);
        const humidities = weatherData.map(d => d.humidity);

        setTemperatureRange({ min: Math.min(...temperatures), max: Math.max(...temperatures) });
        setHumidityRange({ min: Math.min(...humidities), max: Math.max(...humidities) });
    };

    useEffect(() => {
        const fetchDefaultLocationData = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLoading(true);
                    try {
                        const weatherData = await fetchWeatherDataByCoordinates(latitude, longitude);
                        setCityName(`Coordonnées: [${latitude}, ${longitude}]`);
                        setTrendData(weatherData);
                        calculateStats(weatherData);
                    } catch (err) {
                        setError(`Erreur lors de la récupération des données météo: ${err.message}`);
                    } finally {
                        setLoading(false);
                    }
                }, () => setError('Impossible de récupérer la position actuelle.'));
            } else {
                setError('La géolocalisation n\'est pas supportée par ce navigateur.');
            }
        };

        fetchDefaultLocationData();
    }, []);

    return (
        <div className="page-container-pre">
            <Navbar />
            <div className="main-content-pre">
                <Sidebar />
                <div className="content-pre">
                    <h1 className='urb-h1-pre'>Données et Prédiction</h1>
                    <InputToolbar
                        locationsInput={locationsInput}
                        setLocationsInput={setLocationsInput}
                        fetchData={fetchData}
                        loading={loading}
                    />
                    {loading && <p>Chargement des données...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div className="chart-container-pre">
                        <div className="chart-item-pre">
                            <BarChartComponent data={trendData} />
                            <div className="chart-legend-pre">
                                <h3>Détails du Graphique à Barres</h3>
                                <p><strong>Zone étudiée :</strong> {cityName}</p>
                                <p><strong>Jours étudiés :</strong> {daysStudied} jours</p>
                                <p><strong>Variation de température :</strong> Min: {temperatureRange.min}°C, Max: {temperatureRange.max}°C</p>
                                <p><strong>Variation de l'humidité :</strong> Min: {humidityRange.min}%, Max: {humidityRange.max}%</p>
                            </div>
                        </div>

                        <div className="chart-item-pre">
                            <LineChartComponent data={trendData} setSelectedPoint={setSelectedPoint} />
                            <div className="chart-legend-pre">
                                {selectedPoint ? (
                                    <div>
                                        <h3>Détails du Graphique en Ligne</h3>
                                        <p><strong>Heure sélectionnée :</strong> {selectedPoint.time}</p>
                                        <p><strong>Température :</strong> {selectedPoint.temperature}°C</p>
                                        <p><strong>Humidité :</strong> {selectedPoint.humidity}%</p>
                                    </div>
                                ) : <p>Sélectionnez un point dans le graphique pour voir les détails</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoricalAndPrediction;
