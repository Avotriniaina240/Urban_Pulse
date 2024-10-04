import L from 'leaflet';
import { getColor, fetchWeatherData } from './MapUtils';
import { fetchAllData, getAirQualityDescriptionInFrench, getWeatherDescriptionInFrench } from '../../services/MapService';

export const createMarker = (loc, selectedRole, mapInstance) => {
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
            popupContent = createPollutionPopupContent(loc);
        } else if (selectedRole === 'meteo') {
            const weatherData = await fetchWeatherData(loc.lat, loc.lng);
            popupContent = createWeatherPopupContent(weatherData);
        }
        marker.bindPopup(popupContent).openPopup();
    });

    return marker;
};

export const createPollutionPopupContent = (loc) => {
    return `
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
};

export const createWeatherPopupContent = (weatherData) => {
    return `
        <div style="font-size: 14px;">
            <b>Météo :</b><br>
            Température : ${weatherData ? weatherData.temperature : 'N/A'} °C<br>
            Humidité : ${weatherData ? weatherData.humidity : 'N/A'}%<br>
            Description : ${weatherData ? weatherData.weather : 'N/A'}<br>
        </div>
    `;
};

export const handleDrawCreated = async (event, drawnItemsLayer, selectedRole) => {
    const layer = event.layer;
    drawnItemsLayer.addLayer(layer);

    if (layer instanceof L.Marker) {
        const { lat, lng } = layer.getLatLng();
        const airQuality = await fetchAllData([{ lat, lon: lng }]);
        const weatherData = await fetchWeatherData(lat, lng);

        let popupContent = '';
        if (selectedRole === 'pollution') {
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
            const weatherDescription = weatherData?.weather?.[0]?.description;
            const weatherDescriptionInFrench = getWeatherDescriptionInFrench(weatherDescription);

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
};