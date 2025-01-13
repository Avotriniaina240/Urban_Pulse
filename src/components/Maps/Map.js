import React, { useEffect, useState, useCallback } from 'react';
import L from 'leaflet';
import { Layers, Filter, Search, Edit } from 'lucide-react';
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';
import { handleDrawCreated } from './MapHelpers';
import { fetchAllData } from '../../services/MapService';

// Leaflet CSS imports
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';

// Leaflet plugins
import 'leaflet-draw';
import 'leaflet-control-geocoder';

// Marker icons configuration
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [20, 33],
    iconAnchor: [10, 33],
    popupAnchor: [1, -28],
    shadowSize: [33, 33]
});

const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const Map = () => {
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [drawingMode, setDrawingMode] = useState(false);
    const [drawnItems, setDrawnItems] = useState(null);
    const [selectedRole, setSelectedRole] = useState('pollution');
    const [cityName, setCityName] = useState("");
    const [error, setError] = useState(null);
    const [airQualityData, setAirQualityData] = useState([]);
    const [mapInitialized, setMapInitialized] = useState(false);

    // Data fetching
    const fetchData = useCallback(async () => {
        try {
            const data = await fetchAllData();
            setAirQualityData(data || []);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    }, []);

    // City name retrieval
    const getCityName = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
            );
            const data = await response.json();
            return data.address.city || data.address.town || data.address.village || "Ville inconnue";
        } catch (error) {
            console.error("Erreur lors de la récupération du nom de la ville:", error);
            return "Ville inconnue";
        }
    };

    // User location effect
    useEffect(() => {
        if (!userLocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const location = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(location);
                    const city = await getCityName(location[0], location[1]);
                    setCityName(city);
                },
                () => {
                    const defaultLocation = [-21.4545, 47.0833];
                    setUserLocation(defaultLocation);
                    getCityName(defaultLocation[0], defaultLocation[1]).then(setCityName);
                }
            );
        }
    }, []);

    // Data fetching effect
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Map initialization effect
    useEffect(() => {
        if (userLocation && !mapInitialized) {
            const mapInstance = L.map('modern-map', {
                center: userLocation,
                zoom: 13,
                zoomControl: false,
            });

            L.control.zoom({
                position: 'bottomright'
            }).addTo(mapInstance);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(mapInstance);
            
            if (cityName) {
                L.marker(userLocation, { icon: blueIcon })
                    .addTo(mapInstance)
                    .bindPopup(cityName)
                    .openPopup();
            }

            // Geocoder setup
            L.Control.geocoder({
                defaultMarkGeocode: false,
                position: 'topright',
                placeholder: 'Rechercher une adresse...'
            })
            .on('markgeocode', function(e) {
                const bbox = e.geocode.bbox;
                const poly = L.polygon([
                    bbox.getSouthEast(),
                    bbox.getNorthEast(),
                    bbox.getNorthWest(),
                    bbox.getSouthWest()
                ]).addTo(mapInstance);
                mapInstance.fitBounds(poly.getBounds());
            })
            .addTo(mapInstance);

            const drawnItemsLayer = new L.FeatureGroup();
            drawnItemsLayer.addTo(mapInstance);
            setDrawnItems(drawnItemsLayer);

            setMap(mapInstance);
            setMapInitialized(true);
            setLoading(false);
        }
    }, [userLocation, cityName, mapInitialized]);

    // Drawing controls effect
    useEffect(() => {
        if (map && drawingMode) {
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
                    featureGroup: drawnItems,
                    remove: true
                }
            });

            map.addControl(drawControl);

            const drawCreatedHandler = (event) => {
                handleDrawCreated(event, drawnItems, selectedRole);
            };

            map.on(L.Draw.Event.CREATED, drawCreatedHandler);

            return () => {
                map.removeControl(drawControl);
                map.off(L.Draw.Event.CREATED, drawCreatedHandler);
            };
        }
    }, [map, drawingMode, drawnItems, selectedRole]);

    // Air quality markers effect
    useEffect(() => {
        if (map && airQualityData.length > 0) {
            const markers = [];

            airQualityData.forEach((loc) => {
                if (loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
                    const marker = L.marker([loc.latitude, loc.longitude], { icon: redIcon })
                        .addTo(map);
                    
                    if (loc.name) {
                        marker.bindPopup(loc.name);
                    }

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
                    markers.push(marker);
                }
            });

            return () => {
                markers.forEach(marker => {
                    if (map) {
                        map.removeLayer(marker);
                    }
                });
            };
        }
    }, [map, airQualityData]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex h-screen pt-16"> {/* Added pt-16 to account for Navbar height */}
                <Sidebar />
                <div className="flex-1 overflow-hidden" style={{ marginLeft: '256px' }}> {/* Adjusted for Sidebar width */}
                    <div className="p-4 h-full flex flex-col">
                        {/* Control Panel */}
                        <div className="bg-white rounded-lg shadow-sm p-2 mb-4">
                            <div className="flex justify-between items-center gap-4 mt-2">
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="px-4 py-2 w-96 rounded-lg border border-gray-200 focus:ring-2 focus:ring-lime-500"
                                >
                                    <option value="pollution">Qualité de l'air</option>
                                    <option value="meteo">Météo</option>
                                </select>

                                <button 
                                    onClick={() => setDrawingMode(!drawingMode)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                        drawingMode 
                                            ? 'bg-gradient-to-r from-[#9fdc23] to-[#00b8e4] text-white' 
                                            : 'bg-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                    <Edit className="w-5 h-5" />
                                    <span>{drawingMode ? 'Mode Edition' : 'Mode Edition'}</span>
                                </button>

                            </div>
                        </div>

                        {/* Filter Panel */}
                        {isFilterOpen && (
                            <div className="absolute top-32 right-8 z-50 bg-white rounded-lg shadow-lg p-4 w-64 border border-gray-200">
                                <h3 className="font-medium text-gray-900 mb-3">Filtres</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" className="rounded text-lime-500" />
                                        <span className="text-sm text-gray-600">Qualité de l'air</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" className="rounded text-lime-500" />
                                        <span className="text-sm text-gray-600">Météo</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {/* Map Container */}
                        <div className="relative flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                            {loading && (
                                <div className="absolute inset-0 bg-white bg-opacity-75 z-40 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
                                </div>
                            )}
                            <div id="modern-map" className="absolute inset-0" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Map;