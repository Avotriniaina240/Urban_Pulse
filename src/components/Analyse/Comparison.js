import React, { useState } from 'react';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import '../styles/Analyse/Comparison.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import 'leaflet/dist/leaflet.css';

const API_KEY = '13c8b873a51de1239ad5606887a1565e'; // Remplacez par votre clé API

const airQualityDescriptions = [
    "🌟 Très bon",
    "😊 Bon",
    "😐 Moyen",
    "😷 Mauvais",
    "🚨 Très mauvais"
];

const weatherDescriptions = {
    "clear sky": "🌞 ciel dégagé",
    "few clouds": "🌤 peu nuageux",
    "scattered clouds": "🌥 nuages épars",
    "broken clouds": "☁️ nuages fragmentés",
    "shower rain": "🌦 averses",
    "rain": "🌧 pluie",
    "thunderstorm": "⛈ orage",
    "snow": "🌨 neige",
    "mist": "🌫 brouillard"
};

const fetchAirQualityData = async (lat, lon) => {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données de qualité de l\'air');
    }
    const data = await response.json();
    const aqi = data.list[0].main.aqi;
    return airQualityDescriptions[aqi - 1];
};

const fetchWeatherData = async (lat, lon) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données météorologiques');
    }
    const data = await response.json();
    return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        weather: weatherDescriptions[data.weather[0].description] || data.weather[0].description
    };
};

const fetchLocationData = async (query) => {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}`);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
    }
    const data = await response.json();
    return {
        lat: data.coord.lat,
        lon: data.coord.lon
    };
};

const fetchDataForLocations = async (locationsInput, coordinatesInput, neighborhoodsInput) => {
    const locationList = locationsInput.split(',').map(location => location.trim()).filter(Boolean);
    const coordinateList = coordinatesInput.split(';').map(coord => coord.trim()).filter(Boolean);
    const neighborhoodList = neighborhoodsInput.split(',').map(neighborhood => neighborhood.trim()).filter(Boolean);

    const locationData = await Promise.all(locationList.map(async (location) => {
        const { lat, lon } = await fetchLocationData(location);
        const airQuality = await fetchAirQualityData(lat, lon);
        const weather = await fetchWeatherData(lat, lon);
        return { location, lat, lon, airQuality, weather };
    }));

    const neighborhoodData = await Promise.all(neighborhoodList.map(async (neighborhood) => {
        const { lat, lon } = await fetchLocationData(neighborhood);
        const airQuality = await fetchAirQualityData(lat, lon);
        const weather = await fetchWeatherData(lat, lon);
        return { location: `Quartier ${neighborhood}`, lat, lon, airQuality, weather };
    }));

    const coordinateData = await Promise.all(coordinateList.map(async (coord) => {
        const [lat, lon] = coord.split(',').map(Number);
        const airQuality = await fetchAirQualityData(lat, lon);
        const weather = await fetchWeatherData(lat, lon);
        return { location: `Coordonnée (${lat}, ${lon})`, lat, lon, airQuality, weather };
    }));

    // Fusion des données de quartier et de ville
    const mergedData = [...locationData, ...coordinateData, ...neighborhoodData];
    return mergedData.filter((data, index, self) =>
        index === self.findIndex((t) => (
            t.lat === data.lat && t.lon === data.lon
        ))
    );
};


const Comparison = () => {
    const [comparisonData, setComparisonData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('air_quality');
    const [locationsInput, setLocationsInput] = useState('');
    const [coordinatesInput, setCoordinatesInput] = useState('');
    const [neighborhoodsInput, setNeighborhoodsInput] = useState('');

    const handleFetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const uniqueData = await fetchDataForLocations(locationsInput, coordinatesInput, neighborhoodsInput);
            setComparisonData(uniqueData);
        } catch (err) {
            setError('Une erreur est survenue lors de la récupération des données.');
        } finally {
            setLoading(false);
        }
    };

    const sortedData = [...comparisonData].sort((a, b) => {
        switch (sortBy) {
            case 'air_quality':
                return airQualityDescriptions.indexOf(a.airQuality) - airQualityDescriptions.indexOf(b.airQuality);
            case 'weather.temperature':
                return a.weather.temperature - b.weather.temperature;
            case 'weather.humidity':
                return a.weather.humidity - b.weather.humidity;
            default:
                return 0;
        }
    });

    return (
        <div className="comparison-container">
            <Navbar />
            <Sidebar />
            <div className="content-container-comparison">
                <h1 className="h1-cp">Comparaison des Zones</h1>
                <div className="comparison-toolbar">
                    <input
                        type="text"
                        placeholder="Entrez les noms de villes (,)"
                        value={locationsInput}
                        onChange={(e) => setLocationsInput(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Entrez les coordonnées (lat,lng) (,)"
                        value={coordinatesInput}
                        onChange={(e) => setCoordinatesInput(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Entrez les noms des quartiers (,)"
                        value={neighborhoodsInput}
                        onChange={(e) => setNeighborhoodsInput(e.target.value)}
                    />
                    <button onClick={handleFetchData}>
                        Traiter
                    </button>
                    <select onChange={(e) => setSortBy(e.target.value)}>
                        <option value="air_quality">Qualité de l'air 🌬</option>
                        <option value="weather.temperature">Température 🌡️</option>
                        <option value="weather.humidity">Humidité 💧</option>
                    </select>
                </div>

                {loading && <p>Chargement des données...</p>}
                {error && <p>{error}</p>}

                <div className="comparison-results">
                    {comparisonData.length > 0 ? (
                        <>
                            <div className="chart-container-comparison">
                                <LineChart width={800} height={400} data={sortedData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="location" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="airQuality" name="Qualité de l'air 🌬" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="weather.temperature" name="Température (°C) 🌡️" stroke="#82ca9d" />
                                    <Line type="monotone" dataKey="weather.humidity" name="Humidité (%) 💧" stroke="#ffc658" />
                                </LineChart>
                            </div>

                            <div className="comparison-data">
                                {sortedData.map((data, index) => (
                                    <div key={index} className="comparison-item">
                                        <h2>{data.location}</h2>
                                        <p><strong>Qualité de l'air:</strong> {data.airQuality}</p>
                                        <p><strong>Température:</strong> {data.weather?.temperature} °C</p>
                                        <p><strong>Humidité:</strong> {data.weather?.humidity}%</p>
                                        <p><strong>Description:</strong> {data.weather?.weather}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p>Aucune donnée disponible. Veuillez entrer les informations pour la comparaison.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comparison;
