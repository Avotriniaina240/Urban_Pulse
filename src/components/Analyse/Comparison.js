import React, { useState } from 'react';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import '../styles/Analyse/Comparison.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import 'leaflet/dist/leaflet.css';

const Comparison = () => {
    const [comparisonData, setComparisonData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('air_quality');

    // Fonction fictive pour simuler la récupération de données sur la qualité de l'air
    const fetchAirQualityData = async (lat, lon) => {
        return [
            { lat, lon, air_quality: Math.floor(Math.random() * 5) + 1 } // Simule une qualité de l'air entre 1 et 5
        ];
    };

    // Fonction fictive pour simuler la récupération de données météorologiques
    const fetchWeatherData = async (lat, lon) => {
        return {
            temperature: (Math.random() * 10 + 15).toFixed(1), // Température entre 15 et 25°C
            humidity: Math.floor(Math.random() * 100), // Humidité entre 0 et 100%
            weather: 'Ensoleillé' // Une description météo fixe
        };
    };

    const handleLocationSelection = async (event) => {
        setLoading(true);
        setError(null);
        try {
            const selectedOptions = Array.from(event.target.selectedOptions);
            const locations = selectedOptions.map(option => {
                const [lat, lon] = option.value.split(',');
                return { label: option.text, lat: parseFloat(lat), lon: parseFloat(lon) };
            });

            const data = await Promise.all(
                locations.map(async (location) => {
                    const airQuality = await fetchAirQualityData(location.lat, location.lon);
                    const weather = await fetchWeatherData(location.lat, location.lon);
                    return { location, airQuality, weather };
                })
            );
            setComparisonData(data);
        } catch (err) {
            setError('Une erreur est survenue lors de la récupération des données.');
        } finally {
            setLoading(false);
        }
    };

    const sortedData = [...comparisonData].sort((a, b) => a[sortBy]?.air_quality - b[sortBy]?.air_quality);

    return (
        <div className="comparison-container">
            <Navbar />
            <Sidebar />
            <div className="content-container-comparison">
                <h1>Comparaison des Quartiers/Villes</h1>
                <div className="comparison-toolbar">
                    <select multiple onChange={handleLocationSelection}>
                        <option value="-21.4545,47.0833">Zone 1</option>
                        <option value="-21.4567,47.0850">Zone 2</option>
                        <option value="-22.0000,48.0000">Zone 3</option>
                        {/* Autres options */}
                    </select>
                    <select onChange={(e) => setSortBy(e.target.value)}>
                        <option value="air_quality">Qualité de l'air</option>
                        <option value="temperature">Température</option>
                        <option value="humidity">Humidité</option>
                    </select>
                </div>

                {loading && <p>Chargement...</p>}
                {error && <p>{error}</p>}

    <div className="comparison-results">
    <div className="chart-container-comparison">
        {/* Affichage du graphique avec des données fictives */}
        <LineChart width={800} height={400} data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location.label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="airQuality[0].air_quality" stroke="#8884d8" />
            <Line type="monotone" dataKey="weather.temperature" stroke="#82ca9d" />
        </LineChart>
    </div>

    <div className="comparison-data">
        {sortedData.map((data, index) => (
            <div key={index} className="comparison-item">
                <h2>{data.location.label}</h2>
                <p>Qualité de l'air: {data.airQuality[0]?.air_quality}</p>
                <p>Météo: {data.weather?.temperature} °C</p>
                <p>Humidité: {data.weather?.humidity}%</p>
                <p>Description: {data.weather?.weather}</p>
            </div>
        ))}
    </div>
</div>
</div>
</div>
    );
};

export default Comparison;
