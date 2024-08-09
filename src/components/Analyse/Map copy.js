import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/SidebarCarte';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import '../styles/Analyse/Map.css';
import axios from 'axios';

const Map = () => {
    const [airQualityData, setAirQualityData] = useState([]);
    const [drawingMode, setDrawingMode] = useState(false);
    const [map, setMap] = useState(null);
    const [drawnItems, setDrawnItems] = useState(null);
    const apiKey = '13c8b873a51de1239ad5606887a1565e';

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

    const fetchAllData = useCallback(async () => {
        const zones = [
            { lat: -21.4545, lon: 47.0833 },
            { lat: -21.4567, lon: 47.0850 },
            { lat: -21.4550, lon: 47.0860 },
            { lat: -22.0000, lon: 48.0000 }
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
        let mapInstance;

        if (!mapContainer._leaflet_id) {
            mapInstance = L.map(mapContainer).setView([-21.4545, 47.0833], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstance);

            const markers = L.markerClusterGroup();
            airQualityData.forEach(loc => {
                if (loc.components) {
                    const markerClass = getMarkerClass(loc.air_quality);

                    const icon = L.divIcon({
                        className: `marker-icon ${markerClass}`,
                        html: ''
                    });

                    const marker = L.marker([loc.lat, loc.lng], { icon });

                    marker.on('click', () => {
                        const popupContent = `
                            <div style="font-size: 14px;">
                                <b>Qualité de l'air: ${loc.air_quality}</b><br>
                                <strong>Composants:</strong><br>
                                CO: ${loc.components.co || 'N/A'} µg/m³<br>
                                NO2: ${loc.components.no2 || 'N/A'} µg/m³<br>
                                O3: ${loc.components.o3 || 'N/A'} µg/m³<br>
                                PM2.5: ${loc.components.pm2_5 || 'N/A'} µg/m³<br>
                                PM10: ${loc.components.pm10 || 'N/A'} µg/m³<br>
                            </div>
                        `;
                        marker.bindPopup(popupContent).openPopup();
                    });

                    markers.addLayer(marker);
                } else {
                    console.warn('Composants non trouvés pour', loc);
                }
            });
            mapInstance.addLayer(markers);

            const drawnItemsLayer = L.featureGroup().addTo(mapInstance);
            setDrawnItems(drawnItemsLayer);

            if (drawingMode) {
                const drawControl = new L.Control.Draw({
                    draw: {
                        polygon: true,
                        polyline: false,
                        rectangle: false,
                        circle: false,
                        marker: true
                    },
                    edit: {
                        featureGroup: drawnItemsLayer,
                        remove: true
                    }
                }).addTo(mapInstance);

                mapInstance.on(L.Draw.Event.CREATED, (event) => {
                    const layer = event.layer;
                    drawnItemsLayer.addLayer(layer);
                    if (layer instanceof L.Marker) {
                        const { lat, lng } = layer.getLatLng();
                        fetchAirQualityData(lat, lng).then(data => {
                            const popupContent = `
                                <div style="font-size: 14px;">
                                    <b>Qualité de l'air: ${data[0]?.air_quality || 'N/A'}</b><br>
                                    <strong>Composants:</strong><br>
                                    CO: ${data[0]?.components.co || 'N/A'} µg/m³<br>
                                    NO2: ${data[0]?.components.no2 || 'N/A'} µg/m³<br>
                                    O3: ${data[0]?.components.o3 || 'N/A'} µg/m³<br>
                                    PM2.5: ${data[0]?.components.pm2_5 || 'N/A'} µg/m³<br>
                                    PM10: ${data[0]?.components.pm10 || 'N/A'} µg/m³<br>
                                </div>
                            `;
                            layer.bindPopup(popupContent).openPopup();
                        });
                    }
                });
            }

            // Ajout de la légende
            const legend = L.control({ position: 'bottomright' });

            legend.onAdd = function () {
                const div = L.DomUtil.create('div', 'info legend');
                const grades = [1, 2, 3, 4];
                const labels = ['Bon', 'Modéré', 'Malsain', 'Très Malsain'];

                div.innerHTML = '<strong>Qualité de l\'air</strong><br>';
                grades.forEach((grade, index) => {
                    div.innerHTML +=
                        `<i style="background:${getColor(grade)}"></i> ${labels[index]}<br>`;
                });

                return div;
            };

            legend.addTo(mapInstance);

            setMap(mapInstance);
        }

        return () => {
            if (mapInstance) {
                mapInstance.remove();
            }
        };
    }, [airQualityData, drawingMode, fetchAirQualityData]);

    const getMarkerClass = (aqi) => {
        switch(aqi) {
            case 1: return 'marker-green';
            case 2: return 'marker-yellow';
            case 3: return 'marker-orange';
            case 4: return 'marker-red';
            default: return '';
        }
    };

    return (
        <div className="map-container">
            <Navbar />
            <Sidebar />
            <div className="content-container">
                <h1 className='h1-m'>Carte Interactive de la Ville</h1>
                <div className="toolbar">
                    <div className="search-bar-container">
                        <input
                            type="text"
                            id="search-bar"
                            placeholder="Entrez une adresse ou un lieu"
                            onChange={(e) => {
                                // Ajoutez ici la logique de recherche automatique si nécessaire
                            }}
                        />
                    </div>
                    <button onClick={fetchAllData} className="refresh-button">Actualiser les données</button>
                    <button  
                        onClick={() => setDrawingMode(!drawingMode)} 
                        className="draw-button"
                    >
                        {drawingMode ? 'Désactiver' : 'Mode édition'}
                    </button>
                </div>
                <div className="map" id="map" style={{ height: 'calc(100vh - 150px)', marginTop: '10px' }}></div>
            </div>
        </div>
    );
};

const getColor = (aqi) => {
    switch(aqi) {
        case 1: return 'green';
        case 2: return 'yellow';
        case 3: return 'orange';
        case 4: return 'red';
        default: return 'grey';
    }
};

export default Map;
