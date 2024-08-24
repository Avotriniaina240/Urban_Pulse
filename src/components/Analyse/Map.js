import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet-draw';
import 'leaflet-control-geocoder';
import '../styles/Analyse/Map.css';
import axios from 'axios';
import { FaSync, FaEdit } from 'react-icons/fa';

const Map = () => {
    const [airQualityData, setAirQualityData] = useState([]);
    const [map, setMap] = useState(null);
    const [drawingMode, setDrawingMode] = useState(false);
    const [drawnItems, setDrawnItems] = useState(null);
    const [selectedRole, setSelectedRole] = useState('pollution'); // Rôle sélectionné (pollution ou météo)
    const apiKey = '13c8b873a51de1239ad5606887a1565e';

    const fetchAirQualityData = useCallback(async (lat, lon) => {
        try {
            const response = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
            return response.data.list.map(item => ({
                lat: lat,
                lng: lon,
                air_quality: item.main.aqi,
                components: item.components || {}
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération des données sur la qualité de l\'air:', error);
            return [];
        }
    }, [apiKey]);

    const fetchWeatherData = useCallback(async (lat, lon) => {
        try {
            const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
            return {
                temperature: response.data.main.temp,
                humidity: response.data.main.humidity,
                weather: response.data.weather[0].description
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des données météorologiques:', error);
            return null;
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
                zones.map(async (zone) => {
                    const airQuality = await fetchAirQualityData(zone.lat, zone.lon);
                    const weather = await fetchWeatherData(zone.lat, zone.lon);
                    return { airQuality, weather, lat: zone.lat, lon: zone.lon };
                })
            );
            setAirQualityData(allData.flatMap(data => data.airQuality));
        } catch (error) {
            console.error('Erreur lors de la récupération des données pour toutes les zones:', error);
        }
    }, [fetchAirQualityData, fetchWeatherData]);

    useEffect(() => {
        const mapContainer = document.getElementById('map');
        let mapInstance;

        if (!mapContainer._leaflet_id) {
            mapInstance = L.map(mapContainer).setView([-21.4545, 47.0833], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstance);

            const updateMarkers = () => {
                airQualityData.forEach(loc => {
                    const icon = L.AwesomeMarkers.icon({
                        icon: selectedRole === 'pollution' ? 'cloud' : 'sun',
                        markerColor: getColor(loc.air_quality),
                        prefix: 'fa',
                        iconColor: 'red'
                    });

                    const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(mapInstance);

                    marker.on('click', async () => {
                        let popupContent = '';
                        if (selectedRole === 'pollution') {
                            popupContent = `
                                <div>
                                    <b>Qualité de l'air : Zone ${loc.air_quality}</b><br>
                                    <strong>Composants:</strong><br>
                                    CO : ${loc.components.co || 'N/A'} µg/m³<br>
                                    NO2 : ${loc.components.no2 || 'N/A'} µg/m³<br>
                                    O3 : ${loc.components.o3 || 'N/A'} µg/m³<br>
                                    PM2.5 : ${loc.components.pm2_5 || 'N/A'} µg/m³<br>
                                    PM10 : ${loc.components.pm10 || 'N/A'} µg/m³<br>
                                </div>
                            `;
                        } else if (selectedRole === 'meteo') {
                            const weatherData = await fetchWeatherData(loc.lat, loc.lng);
                            popupContent = `
                                <div style="font-size: 14px;">
                                    <b>Météo :</b><br>
                                    Température : ${weatherData ? weatherData.temperature : 'N/A'} °C<br>
                                    Humidité : ${weatherData ? weatherData.humidity : 'N/A'}%<br>
                                    Description : ${weatherData ? weatherData.weather : 'N/A'}<br>
                                </div>
                            `;
                        }
                        marker.bindPopup(popupContent).openPopup();
                    });
                });
            };

            updateMarkers(); // Initialiser les marqueurs

            const geocoder = L.Control.geocoder({
                defaultMarkGeocode: false
            }).on('markgeocode', function (e) {
                const bbox = e.geocode.bbox;
                const poly = L.polygon([
                    [bbox.getSouthEast().lat, bbox.getSouthEast().lng],
                    [bbox.getNorthEast().lat, bbox.getNorthEast().lng],
                    [bbox.getNorthWest().lat, bbox.getNorthWest().lng],
                    [bbox.getSouthWest().lat, bbox.getSouthWest().lng]
                ]).addTo(mapInstance);
                mapInstance.fitBounds(poly.getBounds());
            }).addTo(mapInstance);

            const drawnItemsLayer = L.featureGroup().addTo(mapInstance);
            setDrawnItems(drawnItemsLayer);

            if (drawingMode) {
                const drawControl = new L.Control.Draw({
                    draw: {
                        polygon: false,
                        polyline: false,
                        rectangle: false,
                        circle: false,
                        circlemarker: false,
                        marker: true
                    },
                    edit: {
                        featureGroup: drawnItemsLayer,
                        remove: true
                    }
                }).addTo(mapInstance);

                mapInstance.on(L.Draw.Event.CREATED, async (event) => {
                    const layer = event.layer;
                    drawnItemsLayer.addLayer(layer);
                    if (layer instanceof L.Marker) {
                        const { lat, lng } = layer.getLatLng();
                        const airQuality = await fetchAirQualityData(lat, lng);
                        const weatherData = await fetchWeatherData(lat, lng);
                        let popupContent = '';
                        if (selectedRole === 'pollution') {
                            popupContent = `
                                <div style="font-size: 14px;">
                                    <b>Qualité de l'air: Zone ${airQuality[0]?.air_quality || 'N/A'}</b><br>
                                    <strong>Composants:</strong><br>
                                    CO: ${airQuality[0]?.components.co || 'N/A'} µg/m³<br>
                                    NO2: ${airQuality[0]?.components.no2 || 'N/A'} µg/m³<br>
                                    O3: ${airQuality[0]?.components.o3 || 'N/A'} µg/m³<br>
                                    PM2.5: ${airQuality[0]?.components.pm2_5 || 'N/A'} µg/m³<br>
                                    PM10: ${airQuality[0]?.components.pm10 || 'N/A'} µg/m³<br>
                                </div>
                            `;
                        } else if (selectedRole === 'meteo') {
                            popupContent = `
                                <div style="font-size: 14px;">
                                    <b>Météo:</b><br>
                                    Température: ${weatherData ? weatherData.temperature : 'N/A'} °C<br>
                                    Humidité: ${weatherData ? weatherData.humidity : 'N/A'}%<br>
                                    Description: ${weatherData ? weatherData.weather : 'N/A'}<br>
                                </div>
                            `;
                        }
                        layer.bindPopup(popupContent).openPopup();
                    }
                });
            }

            const legend = L.control({ position: 'bottomright' });

            legend.onAdd = function () {
                const div = L.DomUtil.create('div', 'info legend');
                if (selectedRole === 'pollution') {
                    const grades = [1, 2, 3, 4];
                    const labels = ['Excellente', 'Admissible', 'Préoccupante', 'Dangereuse'];
                    div.innerHTML = '<strong>Qualité de l\'air</strong><br>';
                    grades.forEach((grade, index) => {
                        div.innerHTML +=
                            `<i style="background:${getColor(grade)}"></i> ${labels[index]}<br>`;
                    });
                } else if (selectedRole === 'meteo') {
                    div.innerHTML = '<strong>Météo</strong><br>';
                    div.innerHTML += '<i style="background:blue"></i> Température<br>';
                    div.innerHTML += '<i style="background:grey"></i> Humidité<br>';
                    div.innerHTML += '<i style="background:orange"></i> Description<br>';
                }
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
    }, [airQualityData, drawingMode, fetchAirQualityData, fetchWeatherData, selectedRole]);

    const getColor = (aqi) => {
        switch (aqi) {
            case 1: return 'green';
            case 2: return 'yellow';
            case 3: return 'orange';
            case 4: return 'red';
            default: return 'grey';
        }
    };

    return (
        <div className="map-container">
            <Navbar />
            <Sidebar />
            <div className="content-container">
                <h1 className='h1-m'>Carte Interactive de la Ville</h1>
                <div className="toolbar">
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="role-select"
                    >
                        <option value="pollution">Qualité de l'air</option>
                        <option value="meteo">Météo</option>
                    </select>
                    <button onClick={fetchAllData} className="refresh-button">
                        <FaSync /> Données
                    </button>
                    <button
                        onClick={() => setDrawingMode(!drawingMode)}
                        className="draw-button"
                    >
                        <FaEdit /> {drawingMode ? 'Désactiver' : 'Mode édition'}
                    </button>
                </div>

                <div className="map" id="map" style={{ height: 'calc(100vh - 150px)', marginTop: '10px' }}></div>
            </div>
        </div>
    );
};

export default Map;
