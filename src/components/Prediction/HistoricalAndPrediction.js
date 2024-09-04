import React, { useState, useEffect } from 'react';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarAdmin';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import HeatMap from 'react-heatmap-grid'; // Importation de la bibliothèque pour Heatmap
import '../styles/Analyse/HistoricalAndPrediction.css'; // Assurez-vous que ce fichier CSS est correctement configuré
import axios from 'axios';

const API_KEY = '13c8b873a51de1239ad5606887a1565e'; // Assurez-vous de sécuriser vos clés API

const HistoricalAndPrediction = () => {
    const [trendData, setTrendData] = useState([]);
    const [heatmapData, setHeatmapData] = useState([]);
    const [locationsInput, setLocationsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fonction pour récupérer les données météorologiques
    const fetchWeatherData = async (city) => {
        try {
            const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
            const data = response.data.list;
            return data.map(item => ({
                time: item.dt_txt,
                temperature: item.main.temp,
                humidity: item.main.humidity
            }));
        } catch (error) {
            console.error(`Erreur lors de la récupération des données pour ${city}: ${error.message}`);
            throw error;
        }
    };

    // Fonction pour récupérer les données et mettre à jour les états
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const locationList = locationsInput.split(',').map(location => location.trim()).filter(Boolean);
            const allTrendData = [];
            const allHeatmapData = [];

            for (const location of locationList) {
                const weatherData = await fetchWeatherData(location);
                allTrendData.push({ location, data: weatherData });

                // Préparer les données pour le Heatmap
                const locationData = weatherData.map(item => [new Date(item.time).getHours(), item.temperature]);
                allHeatmapData.push(locationData);
            }

            // Vous pouvez personnaliser comment vous voulez gérer plusieurs lieux ici
            setTrendData(allTrendData.flatMap(locationData => locationData.data));
            setHeatmapData(allHeatmapData.flat());
        } catch (err) {
            setError(`Une erreur est survenue lors de la récupération des données: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour préparer les données pour le Heatmap
    const prepareHeatmapData = (data) => {
        const hours = Array.from({ length: 24 }, (_, i) => i); // Heures de 0 à 23
        const days = Array.from({ length: 7 }, (_, i) => i); // Jours de la semaine 0-6

        const heatmap = days.map(() => hours.map(() => 0));

        data.forEach(([hour, value]) => {
            const day = new Date().getDay(); // Vous pouvez personnaliser pour des jours spécifiques
            heatmap[day][hour] = value;
        });

        return heatmap;
    };

    return (
        <div className="page-container-pre">
            <Navbar />
            <div className="main-content-pre">
                <Sidebar />
                <div className="content-pre">
                    <div className="header-pre">
                        <h1 className='urb-h1-pre'>Analyse Urbaine</h1>
                    </div>
                    <div className="input-section-pre">
                        <div className="input-toolbar-pre">
                            <input
                                type="text"
                                placeholder="Entrez les noms de villes (séparés par des virgules)"
                                value={locationsInput}
                                onChange={(e) => setLocationsInput(e.target.value)}
                            />
                            <button onClick={fetchData} disabled={loading}>
                                {loading ? 'Chargement...' : 'Traiter'}
                            </button>
                        </div>
                        {loading && <p>Chargement des données...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                    <div className="chart-container-pre">
                        <div className="chart-item-pre">
                            <h2 className="chart-title-pre">Évolution de la Température</h2>
                            <LineChart width={800} height={400} data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                                <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
                            </LineChart>
                        </div>
                        <div className="chart-item-pre">
                            <h2 className="chart-title-pre">Carte de Chaleur de la Température</h2>
                            <HeatMap
                                xLabels={Array.from({ length: 24 }, (_, i) => `${i}`)} // Affichage des heures 0, 1, 2, etc.
                                yLabels={Array.from({ length: 7 }, (_, i) => `J.${i + 1}`)} // Affichage des jours J.1, J.2, etc.
                                data={prepareHeatmapData(heatmapData)}
                                square
                                height={50}
                                width={50}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoricalAndPrediction;
