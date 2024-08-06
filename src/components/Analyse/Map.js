import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import '../styles/Analyse/Map.css';
import axios from 'axios';

const Map = () => {
    const [airQualityData, setAirQualityData] = useState([]);
    const apiKey = '13c8b873a51de1239ad5606887a1565e';

    // Fonction pour récupérer les données de qualité de l'air pour une zone
    const fetchAirQualityData = useCallback(async (lat, lon) => {
        try {
            const response = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
            const data = response.data.list.map(item => ({
                lat: lat,
                lng: lon,
                air_quality: item.main.aqi,
                components: item.components || {}
            }));
            return data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données sur la qualité de l\'air:', error);
            return [];
        }
    }, [apiKey]);

    // Fonction pour récupérer les données de toutes les zones
    const fetchAllData = useCallback(async () => {
        const zones = [
            { lat: -21.4545, lon: 47.0833 }, // Zone 1
            { lat: -21.4567, lon: 47.0850 }, // Zone 2
            { lat: -21.4550, lon: 47.0860 }  // Zone 3 (ajoutez autant de zones que nécessaire)
            
        ];

        try {
            const allData = await Promise.all(
                zones.map(zone => fetchAirQualityData(zone.lat, zone.lon))
            );
            setAirQualityData(allData.flat());
        } catch (error) {
            console.error('Erreur lors de la récupération des données pour toutes les zones:', error);
        }
    }, [fetchAirQualityData]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    useEffect(() => {
        const mapContainer = document.getElementById('map');
        let map;

        if (!mapContainer._leaflet_id) {
            map = L.map(mapContainer).setView([-21.4545, 47.0833], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            const markers = L.markerClusterGroup();

            airQualityData.forEach(loc => {
                if (loc.components) {
                    const marker = L.circleMarker([loc.lat, loc.lng], {
                        color: getColor(loc.air_quality),
                        radius: 8,
                        fillOpacity: 0.7,
                        weight: 2
                    })
                    .bindPopup(`
                        <div style="font-size: 14px;">
                            <b>Qualité de l'air: ${loc.air_quality}</b><br>
                            <strong>Composants:</strong><br>
                            CO: ${loc.components.co || 'N/A'} µg/m³<br>
                            NO2: ${loc.components.no2 || 'N/A'} µg/m³<br>
                            O3: ${loc.components.o3 || 'N/A'} µg/m³<br>
                            PM2.5: ${loc.components.pm2_5 || 'N/A'} µg/m³<br>
                            PM10: ${loc.components.pm10 || 'N/A'} µg/m³<br>
                        </div>
                    `);
                    markers.addLayer(marker);
                } else {
                    console.warn('Composants non trouvés pour', loc);
                }
            });

            map.addLayer(markers);

            // Ajouter la légende
            const legend = L.control({ position: 'bottomright' });

            legend.onAdd = function () {
                const div = L.DomUtil.create('div', 'info legend');
                const grades = [1, 2, 3, 4];

                for (let i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + getColor(grades[i]) + '"></i> ' +
                        (grades[i] === 1 ? 'Bon' :
                        grades[i] === 2 ? 'Modéré' :
                        grades[i] === 3 ? 'Insatisfaisant' :
                        'Mauvais') + '<br>';
                }

                return div;
            };

            legend.addTo(map);
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
                <h1 className='h1-m'>Carte Interactive de la Ville</h1>
                <button onClick={fetchAllData}>Actualiser les données</button>
                <div className="map" id="map" style={{ height: 'calc(100vh - 150px)', marginTop: '10px' }}></div>
            </div>
        </div>
    );
};

const getColor = (aqi) => {
    switch(aqi) {
        case 1: return 'green'; // Bon
        case 2: return 'yellow'; // Modéré
        case 3: return 'orange'; // Insatisfaisant
        case 4: return 'red'; // Mauvais
        default: return 'grey'; // Très mauvais
    }
};

export default Map;
2