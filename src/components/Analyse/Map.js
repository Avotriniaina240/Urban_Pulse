// src/components/Map.js
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Analyse/Map.css';
import axios from 'axios';

const Map = () => {
    const [airQualityData, setAirQualityData] = useState([]);

    const fetchAirQualityData = async () => {
        try {
            const response = await axios.get('https://api.example.com/air-quality');
            setAirQualityData(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données sur la qualité de l\'air:', error);
        }
    };

    useEffect(() => {
        fetchAirQualityData();
    }, []);

    useEffect(() => {
        const mapContainer = document.getElementById('map');
        let map;

        if (!mapContainer._leaflet_id) {
            map = L.map(mapContainer).setView([51.505, -0.09], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Ajouter des marqueurs pour les données de qualité de l'air
            airQualityData.forEach(loc => {
                L.marker([loc.lat, loc.lng]).addTo(map)
                    .bindPopup(`Qualité de l'air: ${loc.air_quality}`)
                    .openPopup();
            });
        }

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [airQualityData]);

    return (
        <div className="map-container">
            <Navbar />
            <Sidebar />
            <div className="content-container">
                <h1>Carte Interactive de la Ville</h1>
                <button onClick={fetchAirQualityData}>Actualiser les données</button>
                <div id="map" style={{ height: 'calc(100vh - 150px)', marginTop: '10px' }}></div>
            </div>
        </div>
    );
};

export default Map;
