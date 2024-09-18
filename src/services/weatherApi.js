import { API_KEY } from '../constants/api';
import { format } from 'date-fns';

const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

export const fetchWeatherData = async (city) => {
    console.log(`Récupération des données pour la ville: ${city}`);
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Réponse API non-OK pour ${city}:`, response.status, errorText);
            throw new Error(`Erreur API (${response.status}): ${errorText}`);
        }
        const data = await response.json();
        console.log(`Données reçues pour ${city}:`, data);
        return processWeatherData(data);
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour ${city}:`, error);
        throw error;
    }
};

export const fetchWeatherDataByCoords = async (lat, lon) => {
    console.log(`Récupération des données pour les coordonnées: (${lat}, ${lon})`);
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Réponse API non-OK pour (${lat}, ${lon}):`, response.status, errorText);
            throw new Error(`Erreur API (${response.status}): ${errorText}`);
        }
        const data = await response.json();
        console.log(`Données reçues pour (${lat}, ${lon}):`, data);
        return processWeatherData(data);
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour (${lat}, ${lon}):`, error);
        throw error;
    }
};

const processWeatherData = (data) => ({
    city: data.name,
    temperature: Math.round(data.main.temp),
    humidity: Math.round(data.main.humidity),
    date: format(new Date(), 'yyyy-MM-dd')
});
