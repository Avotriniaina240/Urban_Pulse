import React, { useState } from 'react';
import TrendChart from '../Analyse/TrendChart';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarAdmin';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Analyse/UrbanAnalysis.css';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

const API_KEY = '13c8b873a51de1239ad5606887a1565e';

const UrbanAnalysis = () => {
    const [trendData, setTrendData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [locations, setLocations] = useState(['']); // Liste des champs de saisie pour les quartiers
    const [coordinatePairs, setCoordinatePairs] = useState([{ latitude: '', longitude: '' }]); // Liste des paires de coordonnées
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataType, setDataType] = useState('ville'); // Type de données : ville, quartier ou coordonnée

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const fetchWeatherData = async (city) => {
        try {
            const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erreur API: ${errorMessage}`);
            }
            const data = await response.json();
            return {
                city: data.name,
                temperature: Math.round(data.main.temp), // Arrondir la température
                humidity: Math.round(data.main.humidity), // Arrondir l'humidité
                date: format(new Date(), 'yyyy-MM-dd')
            };
        } catch (error) {
            console.error(`Erreur lors de la récupération des données pour ${city}: ${error.message}`);
            throw error;
        }
    };
    
    const fetchWeatherDataByCoords = async (lat, lon) => {
        try {
            const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erreur API: ${errorMessage}`);
            }
            const data = await response.json();
            return {
                city: data.name,
                temperature: Math.round(data.main.temp), // Arrondir la température
                humidity: Math.round(data.main.humidity), // Arrondir l'humidité
                date: format(new Date(), 'yyyy-MM-dd')
            };
        } catch (error) {
            console.error(`Erreur lors de la récupération des données pour les coordonnées (${lat}, ${lon}): ${error.message}`);
            throw error;
        }
    };
    
    const fetchData = async () => {
        setLoading(true);
        setError(null); // Réinitialiser les erreurs avant de commencer la récupération des données
        try {
            let weatherData = [];
    
            if (dataType === 'ville') {
                const cityList = locations.filter(city => city.trim()).map(city => city.trim());
                weatherData = await Promise.all(cityList.map(city => fetchWeatherData(city)));
            } else if (dataType === 'quartier') {
                // Traiter les quartiers comme des villes pour cet exemple
                const neighborhoodList = locations.filter(location => location.trim()).map(location => location.trim());
                weatherData = await Promise.all(neighborhoodList.map(location => fetchWeatherData(location)));
            } else if (dataType === 'coordonnées') {
                const weatherDataPromises = coordinatePairs
                    .filter(pair => pair.latitude && pair.longitude)
                    .map(pair => fetchWeatherDataByCoords(pair.latitude, pair.longitude));
                weatherData = await Promise.all(weatherDataPromises);
            }
    
            const trendData = weatherData.map((data) => ({
                city: data.city,
                temperature: data.temperature,
                humidity: data.humidity,
                date: data.date
            }));
    
            const pieChartData = weatherData.map(data => ({
                name: data.city,
                value: data.temperature
            }));
    
            setTrendData(trendData);
            setPieChartData(pieChartData);
            setIsModalOpen(false); // Ferme le modal après le traitement
        } catch (err) {
            setError('Les informations saisies ne sont pas correctes.'); // Message d'erreur générique
        } finally {
            setLoading(false);
        }
    };

    const handleLocationChange = (index, value) => {
        const newLocations = [...locations];
        newLocations[index] = value;
        setLocations(newLocations);
    };

    const addLocationField = () => {
        setLocations([...locations, '']);
    };

    const removeLocationField = (index) => {
        const newLocations = locations.filter((_, i) => i !== index);
        setLocations(newLocations);
    };

    const handleCoordinateChange = (index, e) => {
        const { name, value } = e.target;
        const newPairs = [...coordinatePairs];
        newPairs[index] = { ...newPairs[index], [name]: value };
        setCoordinatePairs(newPairs);
    };

    const addCoordinatePair = () => {
        setCoordinatePairs([...coordinatePairs, { latitude: '', longitude: '' }]);
    };

    const removeCoordinatePair = (index) => {
        const newPairs = coordinatePairs.filter((_, i) => i !== index);
        setCoordinatePairs(newPairs);
    };

    return (
        <div className="page-container">
            <Navbar />
            <div className="main-content">
                <Sidebar />
                <div className="content">
                    <div className="header">
                        <h1 className='urb-h1'>Analyse des Données Urbaines</h1>
                    </div>
                    <div className="input-section">
                        <button className='btn-open-modal' onClick={() => setIsModalOpen(true)}>
                            Ouvrir le Menu
                        </button>
                        {isModalOpen && (
                            <div className="modal-overlay">
                                <div className="modal-content-urb">
                                    <button className="btn-close" onClick={() => setIsModalOpen(false)}>×</button>
                                    <h2>Choisir le type de données</h2>
                                    <select value={dataType} onChange={(e) => setDataType(e.target.value)}>
                                        <option value="ville">Ville</option>
                                        <option value="quartier">Quartier</option>
                                        <option value="coordonnées">Coordonnées</option>
                                    </select>
                                    {dataType === 'ville' && (
                                    <>
                                        <h2>Entrez les villes</h2>
                                        {locations.map((location, index) => (
                                            <div key={index} className="location-input-group">
                                                <input
                                                    type="text"
                                                    placeholder="Nom de la ville"
                                                    value={location}
                                                    onChange={(e) => handleLocationChange(index, e.target.value)}
                                                />
                                                <button className="btn-remove" onClick={() => removeLocationField(index)}>
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                            </div>
                                        ))}
                                        <button className="btn-add" onClick={addLocationField}>
                                            Ajouter une Ville
                                        </button>
                                    </>
                                )}

                                    {dataType === 'quartier' && (
                                        <>
                                            <h2>Entrez les quartiers</h2>
                                            {locations.map((location, index) => (
                                                <div key={index} className="location-input-group">
                                                    <input
                                                        type="text"
                                                        placeholder="Nom du quartier"
                                                        value={location}
                                                        onChange={(e) => handleLocationChange(index, e.target.value)}
                                                    />
                                                    <button className="btn-remove" onClick={() => removeLocationField(index)}>
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button className="btn-add" onClick={addLocationField}>
                                                Ajouter un Quartier
                                            </button>
                                        </>
                                    )}

                                    {dataType === 'coordonnées' && (
                                        <>
                                            <h2>Entrez les coordonnées</h2>
                                            {coordinatePairs.map((pair, index) => (
                                                <div key={index} className="coordinate-input-group">
                                                    <input
                                                        type="number"
                                                        placeholder="Latitude"
                                                        name="latitude"
                                                        value={pair.latitude}
                                                        onChange={(e) => handleCoordinateChange(index, e)}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Longitude"
                                                        name="longitude"
                                                        value={pair.longitude}
                                                        onChange={(e) => handleCoordinateChange(index, e)}
                                                    />
                                                    <button className="btn-remove" onClick={() => removeCoordinatePair(index)}>
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button className="btn-add" onClick={addCoordinatePair}>
                                                Ajouter une Coordonnée
                                            </button>
                                        </>
                                    )}

                                    <button className='btnana-urb' onClick={fetchData} disabled={loading}>
                                        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSpinner} />}
                                    </button>
                                    {loading && <p>Chargement des données...</p>}
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="chart-container">
                        <div className="chart-item">
                            <h2 className="pie-chart-title">Répartition des Températures</h2>
                            <PieChart width={400} height={400}>
                                <Pie 
                                    data={pieChartData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={150} 
                                    fill="#8884d8" 
                                    label
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                            </PieChart>
                        </div>
                        <div className="chart-item-char">
                            <TrendChart data={trendData} legendTitle="Évolution des Températures" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UrbanAnalysis;
