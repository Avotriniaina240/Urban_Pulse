import React, { useState, useEffect } from 'react';
import TrendChart from '../Analyse/TrendChart';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/SidebarAdmin';
import MapView from '../Analyse/MapView';
import BarChart from '../Analyse/BarChart';
import '../styles/Analyse/UrbanAnalysis.css'; // Importez le fichier CSS

const UrbanAnalysis = () => {
    const [trendData, setTrendData] = useState([]);
    const [mapMarkers, setMapMarkers] = useState([]);
    const [barChartData, setBarChartData] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            // Données statiques pour le graphique des tendances
            setTrendData([
                { date: '2024-01-01', value: 10 },
                { date: '2024-01-02', value: 15 },
                { date: '2024-01-03', value: 8 },
                { date: '2024-01-04', value: 20 },
                { date: '2024-01-05', value: 13 },
            ]);

            // Données statiques pour les marqueurs de la carte
            setMapMarkers([
                
            ]);

            // Données statiques pour le bar chart
            setBarChartData([
                { label: 'A', value: 30 },
                { label: 'B', value: 20 },
                { label: 'C', value: 50 },
                { label: 'D', value: 40 },
            ]);
        };

        fetchData();
    }, []);

    // Exemple d'utilisation de la légende
    const legendItems = [
        { label: 'A - Agriculture', color: 'steelblue' },
        { label: 'B - Bâtiment', color: 'green' },
        { label: 'C - Commerce', color: 'orange' },
        { label: 'D - Développement', color: 'red' }
    ];

    return (
        <div className="page-container">
            <Navbar />
            <div className="main-content">
                <Sidebar />
                <div className="content">
                    <div className="header">
                        <h1 className='urb-h1'>Tableau de Bord</h1>
                    </div>
                    <div className="chart-container">
                        <div className="chart-item">
                            <BarChart data={barChartData} legend={{ title: 'Légende des Catégories', items: legendItems }} />
                        </div>
                        <div className="chart-item">
                            <TrendChart data={trendData} legendTitle="Tendances des Valeurs" />
                        </div>
                        <div className="map-section">
                            <div className="description-container">
                                <p className="description-text">
                                    Un utilisateur pourrait utiliser cette page pour surveiller la répartition de certains services ou infrastructures dans une ville. En cliquant sur les marqueurs sur la carte, l'utilisateur peut voir où se trouvent ces services et, en utilisant les graphiques, il peut comprendre comment ces services sont distribués ou utilisés. La légende permet à l'utilisateur de filtrer les informations affichées, par exemple, en montrant seulement certains types de services ou en comparant différentes données.
                                </p>
                            </div>
                            <div className="aff">
                                <div className="section section-1">MAP</div>
                                <div className="section section-2">POLLUTION</div>
                                <div className="section section-3">METEO</div>
                            </div>
                            <div className="map-container">
                                <MapView markers={mapMarkers} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UrbanAnalysis;
