import { useState } from 'react';
import { fetchWeatherData, fetchWeatherDataByCoords } from '../services/weatherApi';

const useWeatherData = (dataType) => {
    const [trendData, setTrendData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (locations, coordinatePairs) => {
        setLoading(true);
        setError(null);
        console.log('Début de fetchData', { dataType, locations, coordinatePairs });

        try {
            let weatherData = [];

            if (dataType === 'ville' || dataType === 'quartier') {
                console.log('Récupération des données pour les villes/quartiers');
                weatherData = await Promise.all(locations.map(async location => {
                    try {
                        return await fetchWeatherData(location);
                    } catch (err) {
                        console.error(`Erreur pour ${location}:`, err);
                        throw err;
                    }
                }));
            } else if (dataType === 'coordonnées') {
                console.log('Récupération des données pour les coordonnées');
                weatherData = await Promise.all(coordinatePairs.map(async pair => {
                    try {
                        return await fetchWeatherDataByCoords(pair.latitude, pair.longitude);
                    } catch (err) {
                        console.error(`Erreur pour (${pair.latitude}, ${pair.longitude}):`, err);
                        throw err;
                    }
                }));
            }

            console.log('Données météo récupérées:', weatherData);

            const processedTrendData = weatherData.map(data => ({
                city: data.city,
                temperature: data.temperature,
                humidity: data.humidity,
                date: data.date
            }));

            const processedPieChartData = weatherData.map(data => ({
                name: data.city,
                value: data.temperature
            }));

            console.log('Données traitées:', { processedTrendData, processedPieChartData });

            setTrendData(processedTrendData);
            setPieChartData(processedPieChartData);
        } catch (err) {
            console.error('Erreur lors de la récupération des données:', err);
            setError(`Erreur lors de la récupération des données: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return { trendData, pieChartData, loading, error, fetchData };
};

export default useWeatherData;