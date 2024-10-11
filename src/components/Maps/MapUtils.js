import axios from 'axios';

const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
const airQualityApiUrl = process.env.REACT_APP_AIR_QUALITY_API_URL;
const weatherApiUrl = process.env.REACT_APP_WEATHER_API_URL;

export const fetchAirQualityData = async (lat, lon) => {
    try {
        const response = await axios.get(`${airQualityApiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        return response.data.list.map(item => ({
            lat,
            lng: lon,
            air_quality: item.main.aqi,
            components: item.components || {}
        }));
    } catch (error) {
        console.error('Erreur lors de la récupération des données sur la qualité de l\'air :', error);
        return [];
    }
};

export const fetchWeatherData = async (lat, lon) => {
    try {
        const response = await axios.get(`${weatherApiUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        return {
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            weather: response.data.weather[0].description
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données météorologiques :', error);
        return null;
    }
};

export const getColor = (aqi) => {
    switch (aqi) {
        case 1: return 'green';
        case 2: return 'yellow';
        case 3: return 'orange';
        case 4: return 'red';
        default: return 'grey';
    }
};
