import React, { useState, useEffect } from 'react'; 
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import '../styles/Analyse/HistoricalAndPrediction.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const API_KEY = '13c8b873a51de1239ad5606887a1565e';

const HistoricalAndPrediction = () => {
    const [trendData, setTrendData] = useState([]);
    const [locationsInput, setLocationsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [daysStudied, setDaysStudied] = useState(0);
    const [temperatureRange, setTemperatureRange] = useState({ min: null, max: null });
    const [humidityRange, setHumidityRange] = useState({ min: null, max: null });
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [cityName, setCityName] = useState(''); // Nouvel état pour stocker le nom de la ville

    const fetchWeatherData = async (city) => {
        try {
            const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
            const data = response.data.list;
            setCityName(city); // Mettre à jour le nom de la ville
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

    const fetchWeatherDataByCoordinates = async (lat, lon) => {
        try {
            const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            const data = response.data.list;
            setCityName(`Coordonnées: [${lat}, ${lon}]`); // Mettre à jour les coordonnées
            return data.map(item => ({
                time: item.dt_txt,
                temperature: item.main.temp,
                humidity: item.main.humidity
            }));
        } catch (error) {
            console.error(`Erreur lors de la récupération des données: ${error.message}`);
            throw error;
        }
    };

    const fetchData = async (city) => {
        setLoading(true);
        setError(null);
        try {
            const weatherData = await fetchWeatherData(city);
            setTrendData(weatherData);

            const startDate = new Date(weatherData[0]?.time);
            const endDate = new Date(weatherData[weatherData.length - 1]?.time);
            const diffDays = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));
            setDaysStudied(diffDays);

            const temperatures = weatherData.map(d => d.temperature);
            const humidities = weatherData.map(d => d.humidity);

            setTemperatureRange({ min: Math.min(...temperatures), max: Math.max(...temperatures) });
            setHumidityRange({ min: Math.min(...humidities), max: Math.max(...humidities) });
        } catch (err) {
            setError(`Une erreur est survenue lors de la récupération des données: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchDefaultLocationData = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLoading(true);
                    try {
                        const weatherData = await fetchWeatherDataByCoordinates(latitude, longitude);
                        setTrendData(weatherData);

                        const startDate = new Date(weatherData[0]?.time);
                        const endDate = new Date(weatherData[weatherData.length - 1]?.time);
                        const diffDays = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));
                        setDaysStudied(diffDays);

                        const temperatures = weatherData.map(d => d.temperature);
                        const humidities = weatherData.map(d => d.humidity);

                        setTemperatureRange({ min: Math.min(...temperatures), max: Math.max(...temperatures) });
                        setHumidityRange({ min: Math.min(...humidities), max: Math.max(...humidities) });
                    } catch (err) {
                        setError(`Erreur lors de la récupération des données météo: ${err.message}`);
                    } finally {
                        setLoading(false);
                    }
                }, (error) => {
                    setError('Impossible de récupérer la position actuelle.');
                });
            } else {
                setError('La géolocalisation n\'est pas supportée par ce navigateur.');
            }
        };

        fetchDefaultLocationData();
    }, []);

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
                            <button className='btnpre' onClick={() => fetchData(locationsInput)} enabled={loading}>
                                <FontAwesomeIcon icon={faSpinner} />
                            </button>

                        </div>
                        {loading && <p>Chargement des données...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                    <div className="chart-container-pre">
                        {/* Premier graphique en barres */}
                        <div className="chart-item-pre">
                            <div className="chart-wrapper-pre">
                                <BarChart width={1000} height={400} data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="temperature" stackId="a" fill="#8884d8" />
                                    <Bar dataKey="humidity" stackId="a" fill="#82ca9d" />
                                </BarChart>
                                <div className="chart-legend-pre">
                                    <h3>Détails du Graphique à Barres</h3>
                                    <p><strong>Zone étudiée :</strong> {cityName}</p> {/* Nom de la zone étudiée */}
                                    <p><strong>Jours étudiés :</strong> {daysStudied} jours</p>
                                    <p><strong>Variation de température :</strong> Min: {temperatureRange.min}°C, Max: {temperatureRange.max}°C</p>
                                    <p><strong>Variation de l'humidité :</strong> Min: {humidityRange.min}%, Max: {humidityRange.max}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Deuxième graphique linéaire */}
                        <div className="chart-item-pre">
                            <div className="chart-wrapper-pre">
                                <LineChart
                                    width={1000}
                                    height={400}
                                    data={trendData}
                                    onClick={(e) => setSelectedPoint(e.activePayload ? e.activePayload[0].payload : null)} // Capturer les clics
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
                                </LineChart>
                                <div className="chart-legend-pre">
                                    <h3>Détails du Graphique Linéaire</h3>
                                    <p><strong>Zone étudiée :</strong> {cityName}</p> {/* Nom de la zone étudiée */}
                                    {selectedPoint ? (
                                        <>
                                            <p><strong>Point sélectionné :</strong> {selectedPoint.time}</p>
                                            <p><strong>Température :</strong> {selectedPoint.temperature}°C</p>
                                            <p><strong>Humidité :</strong> {selectedPoint.humidity}%</p>
                                        </>
                                    ) : (
                                        <p>Cliquez sur un point pour afficher les détails.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoricalAndPrediction;
