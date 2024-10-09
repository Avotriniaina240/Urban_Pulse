import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';
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
import { fetchAllData } from '../../services/MapService';
import { createMarker, handleDrawCreated } from './MapHelpers';

const Map = () => {
    const [airQualityData, setAirQualityData] = useState([]);
    const [map, setMap] = useState(null);
    const [drawingMode, setDrawingMode] = useState(false);
    const [drawnItems, setDrawnItems] = useState(null);
    const [selectedRole, setSelectedRole] = useState('pollution');

    const fetchData = useCallback(async () => {
        const zones = []; // Définissez vos zones ici
        try {
            const data = await fetchAllData(zones);
            setAirQualityData(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
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
                    createMarker(loc, selectedRole, mapInstance);
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

                mapInstance.on(L.Draw.Event.CREATED, (event) => handleDrawCreated(event, drawnItemsLayer, selectedRole));
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
                    <button onClick={fetchData} className="refresh-button">
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