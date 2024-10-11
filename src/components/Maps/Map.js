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
import { handleDrawCreated } from './MapHelpers';

// Importez les icônes localement
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configurez les icônes par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

// Définition de l'icône personnalisée
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [20, 33], 
    iconAnchor: [10, 33], 
    popupAnchor: [1, -28], 
    shadowSize: [33, 33]  
});

const Map = () => {
    const [airQualityData, setAirQualityData] = useState([]);
    const [map, setMap] = useState(null);
    const [drawingMode, setDrawingMode] = useState(false);
    const [drawnItems, setDrawnItems] = useState(null);
    const [selectedRole, setSelectedRole] = useState('pollution');
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        const zones = []; // Définissez vos zones ici
        try {
            const data = await fetchAllData(zones);
            console.log('Données brutes récupérées:', data);
            if (Array.isArray(data) && data.length > 0) {
                console.log('Exemple de donnée:', data[0]);
            } else {
                console.warn('Les données récupérées ne sont pas un tableau ou sont vides');
            }
            setAirQualityData(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            setError(`Erreur de récupération des données: ${error.message}`);
        }
    }, []);

    useEffect(() => {
        const mapContainer = document.getElementById('map');
        let mapInstance;

        if (!mapContainer._leaflet_id) {
            try {
                mapInstance = L.map(mapContainer).setView([-21.4545, 47.0833], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(mapInstance);

                const updateMarkers = () => {
                    airQualityData.forEach((loc, index) => {
                        try {
                            console.log(`Création du marqueur ${index}:`, loc);
                            if (loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
                                const marker = L.marker([loc.latitude, loc.longitude], { icon: redIcon }).addTo(mapInstance);
                                if (loc.name) {
                                    marker.bindPopup(loc.name);
                                }
                                
                                // Ajout de l'animation
                                const animateMarker = () => {
                                    if (marker._icon) {
                                        marker._icon.style.transition = 'transform 0.3s ease-in-out';
                                        marker._icon.style.transform = 'translateY(-10px)';
                                        setTimeout(() => {
                                            marker._icon.style.transform = 'translateY(0)';
                                        }, 300);
                                    }
                                };
                                
                                marker.on('mouseover', animateMarker);
                                console.log(`Marqueur ${index} créé avec animation:`, marker);
                            } else {
                                console.warn(`Données invalides pour le marqueur ${index}:`, loc);
                            }
                        } catch (error) {
                            console.error(`Erreur lors de la création du marqueur ${index}:`, error);
                            setError(`Erreur de création de marqueur: ${error.message}`);
                        }
                    });
                };

                // Appel de updateMarkers seulement après que les données sont chargées
                if (airQualityData.length > 0) {
                    updateMarkers();
                }

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
                            marker: {
                                icon: redIcon
                            }
                        },
                        edit: {
                            featureGroup: drawnItemsLayer,
                            remove: true
                        }
                    }).addTo(mapInstance);

                    mapInstance.on(L.Draw.Event.CREATED, (event) => handleDrawCreated(event, drawnItemsLayer, selectedRole));
                }
                setMap(mapInstance);
            } catch (error) {
                console.error('Erreur lors de l\'initialisation de la carte:', error);
                setError(`Erreur d'initialisation de la carte: ${error.message}`);
            }
        }

        return () => {
            if (mapInstance) {
                mapInstance.remove();
            }
        };
    }, [airQualityData, drawingMode, selectedRole]);

    // Fonction de débogage pour vérifier le chargement des ressources
    const checkResourceLoading = () => {
        const resources = performance.getEntriesByType("resource");
        resources.forEach(resource => {
            if (resource.initiatorType === "img" || resource.initiatorType === "css") {
                console.log(`Resource ${resource.name} loaded in ${resource.duration}ms`);
            }
        });
    };

    useEffect(() => {
        checkResourceLoading();
    }, []);

    return (
        <div className="map-map">
            <Navbar />
            <Sidebar />
        <div className="map-container">
            <div className="content-container">
                {error && <div className="error-message">{error}</div>}
                <div className="map" id="map" style={{ height: 'calc(100vh - 150px)', marginTop: '10px', position: 'relative' }}>
                    {/* Déplacez le sélecteur ici */}
                    <div className="select-ss" style={{position: 'absolute', top: '80px', right: '1px', width: '32px', zIndex: '1000', padding: '10px', borderRadius: '5px' }}>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="role-select"
                        >
                            <option value="pollution">Qualité de l'air</option>
                            <option value="meteo">Météo</option>
                        </select>
                    </div>
                    <button 
                        onClick={(e) => {
                            e.preventDefault(); 
                            setDrawingMode(!drawingMode); 
                        }} 
                        className="draw"
                        type="button"
                    >
                        <FaEdit/> {drawingMode}
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Map;
