import React, { useState, useEffect } from 'react';
import Navbar from '../../layouts/Navbar/Navbar';
import Sidebar from '../../layouts/Sidebar/SidebarCarte';
import WeatherCharts from './WeatherCharts';
import InputSection from './InputSection';
import { fetchWeatherData, fetchWeatherDataByCoordinates } from '../../../services/weatherApi';
import { calculateDateRanges } from '../../../utils/dateHelpers';
import { useGeolocation } from '../../../hooks/useGeolocation';
import '../../../styles/Analyse/HistoricalAndPrediction.css';

const HistoricalAndPrediction = () => {
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cityName, setCityName] = useState('');
    const { position, error: geoError } = useGeolocation();

    const [analysisData, setAnalysisData] = useState({
        daysStudied: 0,
        temperatureRange: { min: null, max: null },
        humidityRange: { min: null, max: null }
    });

    useEffect(() => {
        if (position) {
            fetchDataByCoordinates(position.latitude, position.longitude);
        }
    }, [position]);

    const fetchData = async (city) => {
        setLoading(true);
        setError(null);
        try {
            const weatherData = await fetchWeatherData(city);
            processWeatherData(weatherData);
            setCityName(city);
        } catch (err) {
            setError(`Une erreur est survenue: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchDataByCoordinates = async (lat, lon) => {
        setLoading(true);
        setError(null);
        try {
            const weatherData = await fetchWeatherDataByCoordinates(lat, lon);
            processWeatherData(weatherData);
            setCityName(`Coordonnées: [${lat}, ${lon}]`);
        } catch (err) {
            setError(`Erreur lors de la récupération des données: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const processWeatherData = (weatherData) => {
        setTrendData(weatherData);
        const { daysStudied, temperatureRange, humidityRange } = calculateDateRanges(weatherData);
        setAnalysisData({ daysStudied, temperatureRange, humidityRange });
    };

    return (
        <div className="page-container-pre">
            <Navbar />
            <div className="main-content-pre">
                <Sidebar />
                <div className="content-pre">
                    <div className="header-pre">
                        <h1 className='urb-h1-pre'>Données et Prédiction</h1>
                    </div>
                    <InputSection 
                        onFetchData={fetchData}
                        loading={loading}
                        error={error}
                    />
                    <WeatherCharts 
                        trendData={trendData}
                        cityName={cityName}
                        analysisData={analysisData}
                    />
                </div>
            </div>
        </div>
    );
};

export default HistoricalAndPrediction;