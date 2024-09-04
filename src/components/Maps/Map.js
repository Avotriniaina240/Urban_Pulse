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
import { FaSync, FaEdit } from 'react-icons/fa';
import { fetchAirQualityData, fetchWeatherData, getColor } from './MapUtils';

const Map = () => {
    const [airQualityData, setAirQualityData] = useState([]);
    const [map, setMap] = useState(null);
    const [drawingMode, setDrawingMode] = useState(false);
    const [drawnItems, setDrawnItems] = useState(null);
    const [selectedRole, setSelectedRole] = useState('pollution');

    const fetchAllData = useCallback(async () => {
        const zones = [];
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
            console.error('Erreur lors de la récupération des données pour toutes les zones :', error);
        }
    }, []);

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

            updateMarkers();

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

                // Fonction pour convertir la description de la qualité de l'air en français
                const getAirQualityDescriptionInFrench = (airQualityIndex) => {
                    console.log('Air Quality Index Received:', airQualityIndex); // Log pour vérifier la valeur reçue
                    if (!airQualityIndex) return 'Description non disponible';
                    switch (true) {
                        case (airQualityIndex <= 50):
                            return 'Bonne';
                        case (airQualityIndex <= 100):
                            return 'Modérée';
                        case (airQualityIndex <= 150):
                            return 'Insuffisante';
                        case (airQualityIndex <= 200):
                            return 'Mauvaise';
                        case (airQualityIndex > 200):
                            return 'Très mauvaise';
                        default:
                            return 'Description non disponible';
                    }
                };

                // Fonction pour convertir la description météo en français
                const getWeatherDescriptionInFrench = (description) => {
                    console.log('Description Received:', description); // Log pour vérifier la valeur reçue
                    if (!description) return 'non disponible';
                    switch (description.toLowerCase()) {
                        case 'clear sky':
                            return 'Ciel dégagé';
                        case 'few clouds':
                            return 'Quelques nuages';
                        case 'scattered clouds':
                            return 'Nuages épars';
                        case 'broken clouds':
                            return 'Nuages fragmentés';
                        case 'shower rain':
                            return 'Averses';
                        case 'rain':
                            return 'Pluie';
                        case 'thunderstorm':
                            return 'Orage';
                        case 'snow':
                            return 'Neige';
                        case 'mist':
                            return 'Brume';
                        default:
                            return 'non disponible';
                    }
                };

                // Fonction pour gérer les événements de création sur la carte
                mapInstance.on(L.Draw.Event.CREATED, async (event) => {
                    const layer = event.layer;
                    drawnItemsLayer.addLayer(layer);

                    if (layer instanceof L.Marker) {
                        const { lat, lng } = layer.getLatLng();
                        const airQuality = await fetchAirQualityData(lat, lng);
                        const weatherData = await fetchWeatherData(lat, lng);

                        let popupContent = '';
                        if (selectedRole === 'pollution') {
                            // Utiliser la fonction pour obtenir la description de la qualité de l'air
                            const airQualityIndex = airQuality[0]?.air_quality;
                            const airQualityDescription = getAirQualityDescriptionInFrench(airQualityIndex);

                            popupContent = `
                                <div class="air-quality-container">
                                    <b>Zone ${airQualityIndex || 'N/A'}</b><br>
                                    <b>Qualité : ${airQualityDescription}</b><br>
                                    <strong>Composants:</strong><br>
                                    🌫️ <span class="component">CO:</span> ${airQuality[0]?.components.co || 'N/A'} µg/m³<br>
                                    🌪️ <span class="component">NO2:</span> ${airQuality[0]?.components.no2 || 'N/A'} µg/m³<br>
                                    🌬️ <span class="component">O3:</span> ${airQuality[0]?.components.o3 || 'N/A'} µg/m³<br>
                                    🌫️ <span class="component">PM2.5:</span> ${airQuality[0]?.components.pm2_5 || 'N/A'} µg/m³<br>
                                    🌫️ <span class="component">PM10:</span> ${airQuality[0]?.components.pm10 || 'N/A'} µg/m³<br>
                                </div>
                            `;
                        } else if (selectedRole === 'meteo') {
                            // Assurez-vous que weatherData.weather et weatherData.weather[0] sont définis
                            const weatherDescription = weatherData?.weather?.[0]?.description;
                            const weatherDescriptionInFrench = getWeatherDescriptionInFrench(weatherDescription);

                            console.log('Weather Description:', weatherDescriptionInFrench); // Log pour vérifier la description de la météo

                            popupContent = `
                                <div class="meteo-container">
                                    <b>Météo:</b><br>
                                    🌡️ <span class="temperature">Température: ${weatherData ? weatherData.temperature : 'N/A'} °C</span><br>
                                    💧 <span class="humidity">Humidité: ${weatherData ? weatherData.humidity : 'N/A'}%</span><br>
                                    📝 Description: ${weatherDescriptionInFrench}<br>
                                </div>
                            `;
                        }

                        layer.bindPopup(popupContent).openPopup();
                    }
                });
            }

            setMap(mapInstance);
        }

        return () => {
            if (mapInstance) {
                mapInstance.remove();
            }
        };
    }, [airQualityData, drawingMode, selectedRole]);

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