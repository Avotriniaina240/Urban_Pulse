import React, { useState } from 'react';
import TrendChart from '../Analyse/TrendChart';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarAdmin';
import { PieChart, Pie, Cell, Legend } from 'recharts'; // Importation des composants de recharts
import '../styles/Analyse/UrbanAnalysis.css'; // Assurez-vous que ce fichier CSS est correctement configuré

const API_KEY = '13c8b873a51de1239ad5606887a1565e'; // Assurez-vous de sécuriser vos clés API

const UrbanAnalysis = () => {
    const [trendData, setTrendData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [locationsInput, setLocationsInput] = useState('');
    const [coordinatesInput, setCoordinatesInput] = useState('');
    const [neighborhoodsInput, setNeighborhoodsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fonction pour récupérer les données de localisation
    const fetchLocationData = async (query) => {
        try {
            const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}`);
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erreur API: ${errorMessage}`);
            }
            const data = await response.json();
            return {
                lat: data.coord.lat,
                lon: data.coord.lon
            };
        } catch (error) {
            console.error(`Erreur lors de la récupération des données pour ${query}: ${error.message}`);
            throw error;
        }
    };

    // Fonction pour vérifier les données du graphique à secteurs
    const verifyPieChartData = (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            return 'Les données du graphique à secteurs sont vides ou mal formatées.';
        }

        for (const item of data) {
            if (!item.name || typeof item.value !== 'number') {
                return `Données invalides détectées: ${JSON.stringify(item)}`;
            }
        }

        return null;
    };

    // Fonction pour créer des données par défaut pour le graphique à secteurs
    const createDefaultPieChartData = () => {
        return [
            
        ];
    };

    // Fonction pour transformer les données de quartier en un format utilisable
    const parseNeighborhoodsInput = (input) => {
        return input.split(',').map(item => {
            const [name, value] = item.split(':').map(part => part.trim());
            return { name, value: parseFloat(value) };
        }).filter(item => item.name && !isNaN(item.value));
    };

    // Fonction pour récupérer les données et mettre à jour les états
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Traitement des entrées utilisateur
            const locationList = locationsInput.split(',').map(location => location.trim()).filter(Boolean);
            const coordinateList = coordinatesInput.split(';').map(coord => coord.trim()).filter(Boolean);
            const neighborhoodData = parseNeighborhoodsInput(neighborhoodsInput);

            // Récupération des données pour les emplacements
            const locationData = await Promise.all(locationList.map(async (location) => {
                const { lat, lon } = await fetchLocationData(location);
                return { location, lat, lon };
            }));

            // Traitement des coordonnées
            const coordinateData = coordinateList.map(coord => {
                const [lat, lon] = coord.split(',').map(Number);
                return { location: `Coordonnée (${lat}, ${lon})`, lat, lon };
            });

            // Préparer les données pour les graphiques
            const trendData = locationData.map(() => ({
                date: new Date().toISOString().split('T')[0], // Exemple de date
                temperature: Math.random() * 30, // Remplacez avec des données réelles
                humidity: Math.random() * 100   // Remplacez avec des données réelles
            }));

            // Préparer les données pour le graphique à secteurs
            let pieChartData = neighborhoodData;

            // Vérifiez les données du graphique à secteurs et utilisez des données par défaut si nécessaire
            const errorMessage = verifyPieChartData(pieChartData);
            if (errorMessage) {
                console.error(errorMessage);
                pieChartData = createDefaultPieChartData();
            }

            setTrendData(trendData);
            setPieChartData(pieChartData);
        } catch (err) {
            setError(`Une erreur est survenue lors de la récupération des données: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <div className="main-content">
                <Sidebar />
                <div className="content">
                    <div className="header">
                        <h1 className='urb-h1'>Analyse Urbaine</h1>
                    </div>
                    <div className="input-section">
                        <div className="input-toolbar">
                            <input
                                type="text"
                                placeholder="Entrez les noms de villes (séparés par des virgules)"
                                value={locationsInput}
                                onChange={(e) => setLocationsInput(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Entrez les coordonnées (lat,lng; séparés par des points-virgules)"
                                value={coordinatesInput}
                                onChange={(e) => setCoordinatesInput(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Entrez les quartiers avec valeurs (format: Quartier A:40, Quartier B:30)"
                                    value={neighborhoodsInput}
                                    onChange={(e) => setNeighborhoodsInput(e.target.value)}
                                />
                                <button onClick={fetchData} disabled={loading}>
                                    {loading ? 'Chargement...' : 'Traiter'}
                                </button>
                            </div>
                            {loading && <p>Chargement des données...</p>}
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>
                        <div className="chart-container">
                            <div className="chart-item">
                                <h2 className="pie-chart-title">Répartition des Quartiers</h2> {/* Titre pour le graphique à secteurs */}
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
                                            <Cell key={`cell-${index}`} fill={entry.fill || '#8884d8'} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </div>
                            <div className="chart-item">
                                <TrendChart data={trendData} legendTitle="Évolution des Valeurs" />
                            </div>
                            <div className="map-section">
                                <div className="description-container">
                                    <p className="description-text">
                                        Utilisez cette page pour surveiller la répartition des services ou infrastructures dans une ville. Veuillez saisir vos coordonnées et utilisez les graphiques pour comprendre la distribution ou l'utilisation des services.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    export default UrbanAnalysis;
    
                                