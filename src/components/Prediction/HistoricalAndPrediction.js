import React, { useState } from 'react';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import '../styles/Analyse/HistoricalAndPrediction.css';
import axios from 'axios';

const API_KEY = '13c8b873a51de1239ad5606887a1565e';

const HistoricalAndPrediction = () => {
    const [trendData, setTrendData] = useState([]);
    const [locationsInput, setLocationsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const locationList = locationsInput.split(',').map(location => location.trim()).filter(Boolean);
            const allTrendData = [];

            for (const location of locationList) {
                const weatherData = await fetchWeatherData(location);
                allTrendData.push({ location, data: weatherData });
            }

            setTrendData(allTrendData.flatMap(locationData => locationData.data));
        } catch (err) {
            setError(`Une erreur est survenue lors de la récupération des données: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container-pre">
            <Navbar />
            <div className="main-content-pre">
                <Sidebar />
                <div className="content-pre">
                    <div className="header-pre">
                        <h1 className='urb-h1-pre'>Données et Prédiction</h1>
                    </div>
                    <div className="input-section-pre">
                        <div className="input-toolbar-pre">
                            <input
                                type="text"
                                placeholder="Entrez les noms de villes (séparés par des virgules)"
                                value={locationsInput}
                                onChange={(e) => setLocationsInput(e.target.value)}
                            />
                            <button className='btnpre' onClick={fetchData} disabled={loading}>
                                {loading ? 'Chargement...' : 'Traiter'}
                            </button>
                        </div>
                        {loading && <p>Chargement des données...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                    <div className="chart-container-pre">
                        <div className="chart-item-pre">
                            <h2 className="chart-title-pre">Évolution de la Température et Humidité</h2>
                            <BarChart width={800} height={400} data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="temperature" stackId="a" fill="#8884d8" />
                                <Bar dataKey="humidity" stackId="a" fill="#82ca9d" />
                            </BarChart>
                        </div>
                        <div className="chart-item-pre">
                            <h2 className="chart-title-pre">Prévision des Températures</h2>
                            <AreaChart width={800} height={400} data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="temperature" stroke="#8884d8" fill="#8884d8" />
                                <Area type="monotone" dataKey="humidity" stroke="#82ca9d" fill="#82ca9d" />
                            </AreaChart>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoricalAndPrediction;
