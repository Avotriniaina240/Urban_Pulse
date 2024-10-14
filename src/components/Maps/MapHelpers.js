import L from 'leaflet';
import { getColor, fetchWeatherData } from './MapUtils';
import { fetchAllData, getAirQualityDescriptionInFrench, getWeatherDescriptionInFrench } from '../../services/MapService';

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
    // Vérifiez d'abord si airQualityData est un tableau et contient un élément
    if (!Array.isArray(airQualityData) || airQualityData.length === 0) {
        console.error("Aucune donnée de qualité de l'air reçue ou les données sont vides.");
        return `<div>Erreur: Les données de qualité de l'air sont indisponibles.</div>`;
    }

    const airQuality = airQualityData[0];  // Accéder au premier élément du tableau

    // Vérifiez ensuite si les composants existent
    if (!airQuality.components) {
        console.error("Les composants des données de qualité de l'air sont absents ou invalides.");
        return `<div>Erreur: Les composants de la qualité de l'air ne sont pas disponibles.</div>`;
    }

    const airQualityDescription = getAirQualityDescriptionInFrench(airQuality.air_quality);

    return `
        <div>
            <b>Qualité de l'air : ${airQualityDescription}</b><br>
            <strong>Composants:</strong><br>
            CO : ${airQuality.components.co ?? 'N/A'} µg/m³<br>
            NO2 : ${airQuality.components.no2 ?? 'N/A'} µg/m³<br>
            O3 : ${airQuality.components.o3 ?? 'N/A'} µg/m³<br>
            PM2.5 : ${airQuality.components.pm2_5 ?? 'N/A'} µg/m³<br>
            PM10 : ${airQuality.components.pm10 ?? 'N/A'} µg/m³<br>
        </div>
    `;
};


export const createWeatherPopupContent = (weatherData) => {
    console.log('Creating weather popup content with:', weatherData);

    if (!weatherData) {
        return "<div>Données météorologiques non disponibles.</div>";
    }

    const description = getWeatherDescriptionInFrench(weatherData.weather);

    // Définir des emojis en fonction de la description météo
    let weatherEmoji = '🌥️'; // Par défaut, nuageux
    if (description.includes('soleil')) {
        weatherEmoji = '☀️';
    } else if (description.includes('pluie')) {
        weatherEmoji = '🌧️';
    } else if (description.includes('neige')) {
        weatherEmoji = '❄️';
    } else if (description.includes('orage')) {
        weatherEmoji = '⚡';
    }

    console.log('Translated description:', description);

    return `
        <div style="font-size: 14px; font-family: Arial, sans-serif; color: #333;">
            <div style="font-size: 16px; font-weight: bold;">${weatherEmoji} Météo</div>
            <div style="margin-top: 8px;">
                <b style="color: #007BFF;">🌡️ Température :</b> ${weatherData.temperature ?? 'N/A'} °C<br>
                <b style="color: #007BFF;">💧 Humidité :</b> ${weatherData.humidity ?? 'N/A'}%<br>
                <b style="color: #007BFF;">📜 Description :</b> ${description} ${weatherEmoji}<br>
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
            const locationData = allData[0];

            if (selectedRole === 'pollution') {
                popupContent = createPollutionPopupContent(locationData.airQuality);
            } else if (selectedRole === 'meteo') {
                popupContent = createWeatherPopupContent(locationData.weather);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
            popupContent = "<div>Erreur lors du chargement des données. Veuillez réessayer plus tard.</div>";
        }

        layer.bindPopup(popupContent).openPopup();
    }
};