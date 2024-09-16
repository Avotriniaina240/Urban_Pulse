import React, { useState } from 'react';
import Navbar from '../components/layouts/Navbar/Navbar';
import Sidebar from '../components/layouts/Sidebar/Sidebar';
import TrendChart from '../components/feature-specific/TrendChart';
import PieChartComponent from '../components/feature-specific/PieChartComponent';
import useWeatherData from '../hooks/useWeatherData';
import useLocationInput from '../hooks/useLocationInput';
import '../styles/UrbanAnalysis.css';

const UrbanAnalysis = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataType, setDataType] = useState('ville');

    const { 
        trendData, 
        pieChartData, 
        loading, 
        error, 
        fetchData 
    } = useWeatherData(dataType);

    const {
        locations,
        coordinatePairs,
        handleLocationChange,
        addLocationField,
        removeLocationField,
        handleCoordinateChange,
        addCoordinatePair,
        removeCoordinatePair
    } = useLocationInput();

    return (
        <div className="page-container">
            <Navbar />
            <div className="main-content">
                <Sidebar />
                <div className="content">
                    <h1>Analyse des Données Urbaines</h1>
                    <button onClick={() => setIsModalOpen(!isModalOpen)}>
                        {isModalOpen ? 'Fermer' : 'Ouvrir'} le Menu
                    </button>
                    
                    {isModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h2>Choisir le type de données</h2>
                                <select value={dataType} onChange={(e) => setDataType(e.target.value)}>
                                    <option value="ville">Ville</option>
                                    <option value="quartier">Quartier</option>
                                    <option value="coordonnées">Coordonnées</option>
                                </select>

                                {dataType === 'ville' && (
                                    <>
                                        <h3>Entrez les villes</h3>
                                        {locations.map((location, index) => (
                                            <div key={index} className="location-input-group">
                                                <input
                                                    type="text"
                                                    placeholder="Nom de la ville"
                                                    value={location}
                                                    onChange={(e) => handleLocationChange(index, e.target.value)}
                                                />
                                                <button onClick={() => removeLocationField(index)}>Supprimer</button>
                                            </div>
                                        ))}
                                        <button onClick={addLocationField}>Ajouter une Ville</button>
                                    </>
                                )}

                                {dataType === 'quartier' && (
                                    <>
                                        <h3>Entrez les quartiers</h3>
                                        {/* Similar structure as 'ville', but for quartiers */}
                                    </>
                                )}

                                {dataType === 'coordonnées' && (
                                    <>
                                        <h3>Entrez les coordonnées</h3>
                                        {coordinatePairs.map((pair, index) => (
                                            <div key={index} className="coordinate-input-group">
                                                <input
                                                    type="number"
                                                    placeholder="Latitude"
                                                    value={pair.latitude}
                                                    onChange={(e) => handleCoordinateChange(index, { ...pair, latitude: e.target.value })}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Longitude"
                                                    value={pair.longitude}
                                                    onChange={(e) => handleCoordinateChange(index, { ...pair, longitude: e.target.value })}
                                                />
                                                <button onClick={() => removeCoordinatePair(index)}>Supprimer</button>
                                            </div>
                                        ))}
                                        <button onClick={addCoordinatePair}>Ajouter une Coordonnée</button>
                                    </>
                                )}

                                <button onClick={fetchData}>Récupérer les données</button>
                            </div>
                        </div>
                    )}
                    
                    {loading && <p>Chargement des données...</p>}
                    {error && <p>Erreur: {error}</p>}
                    
                    <div className="chart-container">
                        {pieChartData.length > 0 && (
                            <div className="chart-item">
                                <h2>Répartition des Températures</h2>
                                <PieChartComponent data={pieChartData} />
                            </div>
                        )}
                        
                        {trendData.length > 0 && (
                            <div className="chart-item-char">
                                <TrendChart data={trendData} legendTitle="Évolution des Températures" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UrbanAnalysis;