import { useState, useEffect } from 'react';
import { fetchWeatherData, fetchWeatherDataByCoordinates } from '../services/weatherApi';

export const useWeatherData = (position) => {
    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cityName, setCityName] = useState('');
    const [daysStudied, setDaysStudied] = useState(0);
    const [temperatureRange, setTemperatureRange] = useState({ min: null, max: null });
    const [humidityRange, setHumidityRange] = useState({ min: null, max: null });

    const fetchData = async (city) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchWeatherData(city);
            processWeatherData(data);
            setCityName(city);
        } catch (err) {
            setError(`Une erreur est survenue lors de la récupération des données: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (position) {
            const fetchDataByCoordinates = async () => {
                setLoading(true);
                try {
                    const data = await fetchWeatherDataByCoordinates(position.latitude, position.longitude);
                    processWeatherData(data);
                    setCityName(`Coordonnées: [${position.latitude}, ${position.longitude}]`);
                } catch (err) {
                    setError(`Erreur lors de la récupération des données météo: ${err.message}`);
                } finally {
                    setLoading(false);
                }
            };
            fetchDataByCoordinates();
        }
    }, [position]);

    const processWeatherData = (data) => {
        setWeatherData(data);
        const startDate = new Date(data[0]?.time);
        const endDate = new Date(data[data.length - 1]?.time);
        setDaysStudied(Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)));
        const temperatures = data.map(d => d.temperature);
        const humidities = data.map(d => d.humidity);
        setTemperatureRange({ min: Math.min(...temperatures), max: Math.max(...temperatures) });
        setHumidityRange({ min: Math.min(...humidities), max: Math.max(...humidities) });
    };

    return { weatherData, loading, error, fetchData, cityName, daysStudied, temperatureRange, humidityRange };
};