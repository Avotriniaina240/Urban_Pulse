import { format } from 'date-fns';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export const fetchWeatherData = async (city) => {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erreur API: ${errorMessage}`);
        }
        const data = await response.json();
        return {
            city: data.name,
            temperature: Math.round(data.main.temp),
            humidity: Math.round(data.main.humidity),
            date: format(new Date(), 'yyyy-MM-dd')
        };
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour ${city}: ${error.message}`);
        throw error;
    }
};

export const fetchWeatherDataByCoords = async (lat, lon) => {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erreur API: ${errorMessage}`);
        }
        const data = await response.json();
        return {
            city: data.name,
            temperature: Math.round(data.main.temp),
            humidity: Math.round(data.main.humidity),
            date: format(new Date(), 'yyyy-MM-dd')
        };
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour les coordonnées (${lat}, ${lon}): ${error.message}`);
        throw error;
    }
};