import L from 'leaflet';
import { getColor, fetchWeatherData } from './MapUtils';
import { fetchAllData, getAirQualityDescriptionInFrench, getWeatherDescriptionInFrench } from '../../services/MapService';

// Exporter les fonctions avec des popups modernes utilisant Tailwind CSS
export const createMarker = (loc, selectedRole, mapInstance) => {
    const icon = L.AwesomeMarkers.icon({
        icon: selectedRole === 'pollution' ? 'cloud' : 'sun',
        markerColor: getColor(loc.airQuality.air_quality),
        prefix: 'fa',
        iconColor: 'red'
    });

    const marker = L.marker([loc.lat, loc.lon], { icon }).addTo(mapInstance);

    marker.on('click', () => {
        let popupContent = '';
        if (selectedRole === 'pollution') {
            popupContent = createPollutionPopupContent(loc.airQuality);
        } else if (selectedRole === 'meteo') {
            popupContent = createWeatherPopupContent(loc.weather);
        }
        marker.bindPopup(popupContent).openPopup();
    });

    return marker;
};

export const createPollutionPopupContent = (airQualityData) => {
    if (!Array.isArray(airQualityData) || airQualityData.length === 0) {
        return `
            <div class="bg-white p-2 rounded-lg shadow-lg min-w-[220px]">
                <div class="flex items-center gap-2 border-b pb-2 mb-2">
                    <span class="material-icons text-red-500">error_outline</span>
                    <h3 class="text-sm font-semibold text-gray-800">Données indisponibles</h3>
                </div>
            </div>
        `;
    }

    const airQuality = airQualityData[0];
    if (!airQuality.components) {
        return `
            <div class="bg-white p-2 rounded-lg shadow-lg min-w-[220px]">
                <div class="flex items-center gap-2 border-b pb-2 mb-2">
                    <span class="material-icons text-red-500">error_outline</span>
                    <h3 class="text-sm font-semibold text-gray-800">Composants non disponibles</h3>
                </div>
            </div>
        `;
    }

    const airQualityDescription = getAirQualityDescriptionInFrench(airQuality.air_quality);
    const qualityColor = getQualityColor(airQuality.air_quality);

    return `
        <div class="bg-white p-2 rounded-lg shadow-lg min-w-[220px]">
            <div class="flex items-center gap-2 border-b pb-2 mb-2">
                <span class="material-icons text-green-500">air</span>
                <h3 class="text-sm font-semibold text-gray-800">Qualité de l'air</h3>
            </div>

            <div class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white" style="background-color: ${qualityColor}20; color: ${qualityColor}">
                ${airQualityDescription}
            </div>

            <div class="grid grid-cols-2 gap-2 mt-2">
                <div class="text-xs font-medium text-gray-500">CO</div>
                <div class="text-xs text-gray-800" title="Monoxyde de carbone, gaz toxique produit par la combustion, notamment des moteurs à combustion et des cheminées.">${airQuality.components.co ?? 'N/A'} µg/m³</div>

                <div class="text-xs font-medium text-gray-500">NO₂</div>
                <div class="text-xs text-gray-800" title="Dioxyde d'azote, un gaz produit par les moteurs de véhicules et les usines. Il peut être nocif pour les voies respiratoires.">${airQuality.components.no2 ?? 'N/A'} µg/m³</div>

                <div class="text-xs font-medium text-gray-500">O₃</div>
                <div class="text-xs text-gray-800" title="Ozone, un gaz qui peut être bénéfique dans la stratosphère mais nuisible à la surface, surtout en cas de pollution.">${airQuality.components.o3 ?? 'N/A'} µg/m³</div>

                <div class="text-xs font-medium text-gray-500">PM2.5</div>
                <div class="text-xs text-gray-800" title="Particules fines (moins de 2.5 micromètres), pouvant pénétrer profondément dans les poumons et affecter la santé respiratoire.">${airQuality.components.pm2_5 ?? 'N/A'} µg/m³</div>

                <div class="text-xs font-medium text-gray-500">PM10</div>
                <div class="text-xs text-gray-800" title="Particules en suspension (moins de 10 micromètres), souvent générées par la poussière, les transports et l'industrie.">${airQuality.components.pm10 ?? 'N/A'} µg/m³</div>
            </div>
        </div>
    `;
};

export const createWeatherPopupContent = (weatherData) => {
    if (!weatherData) {
        return `
            <div class="bg-white p-2 rounded-lg shadow-lg min-w-[220px]">
                <div class="flex items-center gap-2 border-b pb-2 mb-2">
                    <span class="material-icons text-red-500">error_outline</span>
                    <h3 class="text-sm font-semibold text-gray-800">Données météo indisponibles</h3>
                </div>
            </div>
        `;
    }

    const description = getWeatherDescriptionInFrench(weatherData.weather);
    const weatherIcon = getWeatherIcon(description);

    return `
        <div class="bg-white p-2 rounded-lg shadow-lg min-w-[220px]">
            <div class="flex items-center gap-2 border-b pb-2 mb-2">
                <span class="material-icons text-yellow-500">${weatherIcon}</span>
                <h3 class="text-sm font-semibold text-gray-800">Météo</h3>
            </div>

            <div class="grid grid-cols-2 gap-2">
                <div class="text-xs font-medium text-gray-500">Température</div>
                <div class="text-xs text-gray-800">${weatherData.temperature ?? 'N/A'}°C</div>

                <div class="text-xs font-medium text-gray-500">Humidité</div>
                <div class="text-xs text-gray-800">${weatherData.humidity ?? 'N/A'}%</div>

                <div class="text-xs font-medium text-gray-500">Conditions</div>
                <div class="text-xs text-gray-800" title="Description générale des conditions météorologiques, comme ensoleillé, pluvieux, neigeux, etc.">${description}</div>
            </div>
        </div>
    `;
};

export const handleDrawCreated = async (event, drawnItemsLayer, selectedRole) => {
    const layer = event.layer;
    drawnItemsLayer.addLayer(layer);

    if (layer instanceof L.Marker) {
        const { lat, lng } = layer.getLatLng();
        let popupContent = '';

        try {
            const allData = await fetchAllData([{ lat, lon: lng }]);
            if (allData && allData.length > 0) {
                const locationData = allData[0];

                if (selectedRole === 'pollution') {
                    popupContent = createPollutionPopupContent(locationData.airQuality);
                } else if (selectedRole === 'meteo') {
                    popupContent = createWeatherPopupContent(locationData.weather);
                }
            } else {
                popupContent = `
                    <div class="bg-white p-4 rounded-lg shadow-lg min-w-[280px]">
                        <div class="flex items-center gap-2 border-b pb-3 mb-4">
                            <span class="material-icons text-red-500">error_outline</span>
                            <h3 class="text-lg font-semibold text-gray-800">Aucune donnée disponible</h3>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
            popupContent = `
                <div class="bg-white p-4 rounded-lg shadow-lg min-w-[280px]">
                    <div class="flex items-center gap-2 border-b pb-3 mb-4">
                        <span class="material-icons text-red-500">error_outline</span>
                        <h3 class="text-lg font-semibold text-gray-800">Erreur de chargement</h3>
                    </div>
                    <p class="text-sm text-gray-800">Veuillez réessayer plus tard.</p>
                </div>
            `;
        }

        layer.bindPopup(popupContent).openPopup();
    }
};

// Fonction utilitaire pour obtenir la couleur en fonction de la qualité de l'air
const getQualityColor = (quality) => {
    const colors = {
        1: '#10B981', // Excellent - Vert
        2: '#34D399', // Bon - Vert clair
        3: '#FBBF24', // Moyen - Jaune
        4: '#F59E0B', // Médiocre - Orange
        5: '#EF4444', // Mauvais - Rouge
    };
    return colors[quality] || '#6B7280';
};

// Fonction utilitaire pour obtenir l'icône météo
const getWeatherIcon = (description) => {
    if (description.includes('soleil')) return 'wb_sunny';
    if (description.includes('pluie')) return 'water_drop';
    if (description.includes('neige')) return 'ac_unit';
    if (description.includes('orage')) return 'thunderstorm';
    return 'cloud';
};
