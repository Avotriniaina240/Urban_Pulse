import { fetchAirQualityData, fetchWeatherData } from '../components/Maps/MapUtils';

export const fetchAllData = async (zones) => {
    try {
        const allData = await Promise.all(
            zones.map(async (zone) => {
                const airQuality = await fetchAirQualityData(zone.lat, zone.lon);
                console.log('Données de qualité de l\'air reçues :', airQuality);
                const weather = await fetchWeatherData(zone.lat, zone.lon);
                return { airQuality, weather, lat: zone.lat, lon: zone.lon };
            })
        );
        return allData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données pour toutes les zones :', error);
        throw error;
    }
};

export const getAirQualityDescriptionInFrench = (airQualityIndex) => {
    console.log('Air Quality Index Received:', airQualityIndex);
    if (!airQualityIndex) return 'Description non disponible';
    switch (true) {
        case (airQualityIndex <= 50):
            return 'Bonne';
        case (airQualityIndex <= 100):
            return 'Modérée';
        case (airQualityIndex <= 150):
            return 'Insuffisante';
        case (airQualityIndex <= 200):
            return 'Mauvaise';
        case (airQualityIndex > 200):
            return 'Très mauvaise';
        default:
            return 'Description non disponible';
    }
};

export const getWeatherDescriptionInFrench = (description) => {
    console.log('Description Received:', description);
    if (!description) return 'Non disponible';
    switch (description.toLowerCase()) {
        case 'clear sky':
            return '☀️ Ciel dégagé';
        case 'few clouds':
            return '🌤️ Quelques nuages';
        case 'scattered clouds':
            return '🌥️ Nuages épars';
        case 'broken clouds':
            return '☁️ Nuages fragmentés';
        case 'shower rain':
            return '🌧️ Averses';
        case 'rain':
            return '🌧️ Pluie';
        case 'thunderstorm':
            return '⛈️ Orage';
        case 'snow':
            return '❄️ Neige';
        case 'mist':
            return '🌫️ Brume';
        case 'overcast clouds':
            return '☁️ Ciel couvert';
        default:
            return description; // Si aucune traduction n'est trouvée, retourner la description originale
    }
};
