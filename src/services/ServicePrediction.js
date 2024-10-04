import axios from 'axios';

const API_KEY = '13c8b873a51de1239ad5606887a1565e';

const fetchWeatherDataByCity = async (city) => {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const data = response.data.list;
        return data.map(item => ({
            time: item.dt_txt,
            temperature: item.main.temp,
            humidity: item.main.humidity
        }));
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des données pour ${city}: ${error.message}`);
    }
};

const fetchWeatherDataByCoordinates = async (lat, lon) => {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = response.data.list;
        return data.map(item => ({
            time: item.dt_txt,
            temperature: item.main.temp,
            humidity: item.main.humidity
        }));
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des données: ${error.message}`);
    }
};

export { fetchWeatherDataByCity, fetchWeatherDataByCoordinates };
