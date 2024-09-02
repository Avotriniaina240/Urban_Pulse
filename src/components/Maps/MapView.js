import React, { useEffect, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet-draw';
import 'leaflet-control-geocoder';
import { FaSync, FaEdit } from 'react-icons/fa';
import { fetchAirQualityData, fetchWeatherData, getColor } from './MapUtils';

const MapView = ({ markers }) => {
    const [map, setMap] = useState(null);
    const [drawingMode, setDrawingMode] = useState(false);
    const [drawnItems, setDrawnItems] = useState(null);
    const [selectedRole, setSelectedRole] = useState('pollution');

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
    
        } catch (error) {
            console.error('Erreur lors de la récupération des données pour toutes les zones :', error);
        }
    }, []);

    useEffect(() => {
        const mapInstance = L.map('map').setView([-21.4545, 47.0833], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        markers.forEach(marker => {
            L.marker([marker.lat, marker.lon])
                .addTo(mapInstance)
                .bindPopup(`<b>${marker.name}</b><br>${marker.description}`);
        });

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

        return () => {
            mapInstance.remove();
        };
    }, [markers, drawingMode, selectedRole]);

    return (
        <div className="map-container">
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
            <div id="map" style={{ marginTop: '30px', borderRadius: '10px', height: '400px', width: '130%', right: '32.5%' }} />
        </div>
    );
};

export default MapView;