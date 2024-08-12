import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/SidebarCarte';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import 'leaflet-draw';
import '../styles/Analyse/Map.css';
import axios from 'axios';
import { FaSync, FaEdit } from 'react-icons/fa';

const Map = () => {
    const [airQualityData, setAirQualityData] = useState([]);
    const [trafficData, setTrafficData] = useState([]);
    const [drawingMode, setDrawingMode] = useState(false);
    const [map, setMap] = useState(null);
    const [drawnItems, setDrawnItems] = useState(null);
    const [selectedRole, setSelectedRole] = useState('pollution'); // Rôle sélectionné (pollution, météo, ou trafic)
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

    const fetchTrafficData = useCallback(async (lat, lon) => {
        try {
            const response = await axios.get(`https://api.example.com/traffic?lat=${lat}&lon=${lon}&apikey=${apiKey}`);
            return response.data.traffic || []; // Assurez-vous de modifier cela en fonction de la structure de la réponse
        } catch (error) {
            console.error('Erreur lors de la récupération des données de trafic:', error);
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
                zones.map(async (zone) => {
                    const airQuality = await fetchAirQualityData(zone.lat, zone.lon);
                    const weather = await fetchWeatherData(zone.lat, zone.lon);
                    const traffic = await fetchTrafficData(zone.lat, zone.lon);
                    return { airQuality, weather, traffic, lat: zone.lat, lon: zone.lon };
                })
            );
            setAirQualityData(allData.flatMap(data => data.airQuality));
            setTrafficData(allData.flatMap(data => data.traffic));
        } catch (error) {
            console.error('Erreur lors de la récupération des données pour toutes les zones:', error);
        }
    }, [fetchAirQualityData, fetchWeatherData, fetchTrafficData]);

    useEffect(() => {
        const mapContainer = document.getElementById('map');
        let mapInstance;

        if (!mapContainer._leaflet_id) {
            mapInstance = L.map(mapContainer).setView([-21.4545, 47.0833], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstance);

            const markers = L.markerClusterGroup();
            
            const updateMarkers = () => {
                markers.clearLayers();

                airQualityData.forEach(loc => {
                    if (loc.components) {
                        const marker = L.circleMarker([loc.lat, loc.lng], {
                            color: getColor(loc.air_quality),
                            radius: 8,
                            fillOpacity: 0.7,
                            weight: 2
                        });

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
                            } else if (selectedRole === 'traffic') {
                                const traffic = await fetchTrafficData(loc.lat, loc.lng);
                                popupContent = `
                                    <div style="font-size: 14px;">
                                        <b>Trafic:</b><br>
                                        ${traffic.length > 0 
                                            ? traffic.map(t => `<div>${t.description || 'Pas de description'}: ${t.severity || 'Inconnu'}</div>`).join('<br>')
                                            : 'Aucune donnée de trafic disponible'}
                                    </div>
                                `;
                            }
                            marker.bindPopup(popupContent).openPopup();
                        });

                        markers.addLayer(marker);
                    } else {
                        console.warn('Composants non trouvés pour', loc);
                    }
                });

                trafficData.forEach(loc => {
                    const marker = L.circleMarker([loc.lat, loc.lng], {
                        color: 'blue',
                        radius: 8,
                        fillOpacity: 0.7,
                        weight: 2
                    });

                    marker.bindPopup(`
                        <div style="font-size: 14px;">
                            <b>Trafic:</b><br>
                            Description: ${loc.description || 'N/A'}<br>
                            Gravité: ${loc.severity || 'N/A'}
                        </div>
                    `);

                    markers.addLayer(marker);
                });

                mapInstance.addLayer(markers);
            };

            updateMarkers(); // Appeler updateMarkers pour initialiser les marqueurs

            // Ajouter la barre de recherche
                const geocoder = L.Control.geocoder({
                    defaultMarkGeocode: false
                }).on('markgeocode', function(e) {
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
                            fetchWeatherData(lat, lng).then(weatherData => {
                                fetchTrafficData(lat, lng).then(traffic => {
                                    let popupContent = '';
                                    if (selectedRole === 'pollution') {
                                        popupContent = `
                                            <div style="font-size: 14px;">
                                                <b>Qualité de l'air: Zone ${data[0]?.air_quality || 'N/A'}</b><br>
                                                <strong>Composants:</strong><br>
                                                CO: ${data[0]?.components.co || 'N/A'} µg/m³<br>
                                                NO2: ${data[0]?.components.no2 || 'N/A'} µg/m³<br>
                                                O3: ${data[0]?.components.o3 || 'N/A'} µg/m³<br>
                                                PM2.5: ${data[0]?.components.pm2_5 || 'N/A'} µg/m³<br>
                                                PM10: ${data[0]?.components.pm10 || 'N/A'} µg/m³<br>
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
                                    } else if (selectedRole === 'traffic') {
                                        popupContent = `
                                            <div style="font-size: 14px;">
                                                <b>Trafic:</b><br>
                                                ${traffic.length > 0 
                                                    ? traffic.map(t => `<div>${t.description || 'Pas de description'}: ${t.severity || 'Inconnu'}</div>`).join('<br>')
                                                    : 'Aucune donnée de trafic disponible'}
                                            </div>
                                        `;
                                    }
                                    layer.bindPopup(popupContent).openPopup();
                                });
                            });
                        });
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
                } else if (selectedRole === 'traffic') {
                    div.innerHTML = '<strong>Trafic</strong><br>';
                    div.innerHTML += '<i style="background:blue"></i> Description<br>';
                    div.innerHTML += '<i style="background:red"></i> Gravité<br>';
                }
                return div;
            };

            legend.addTo(mapInstance);

            setMap(mapInstance);
        } else {
             // Mettre à jour les marqueurs si la carte existe déjà
        }

        return () => {
            if (mapInstance) {
                mapInstance.remove();
            }
        };
    }, [airQualityData, trafficData, drawingMode, fetchAirQualityData, fetchWeatherData, fetchTrafficData, selectedRole]);

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
                        <option value="traffic">Trafic</option>
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
