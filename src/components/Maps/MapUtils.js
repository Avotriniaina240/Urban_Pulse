import axios from 'axios';

const apiKey = '13c8b873a51de1239ad5606887a1565e';

export const fetchAirQualityData = async (lat, lon) => {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
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
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
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



