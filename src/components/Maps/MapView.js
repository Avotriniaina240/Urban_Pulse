import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ markers }) => {
    const style = {
        marginTop: '30px',
        borderRadius: '10px',
        height: '400px',
        width: '130%',
        right: '32.5%',
    }

    useEffect(() => {
        const map = L.map('map').setView([-21.4545, 47.0833], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        markers.forEach(marker => {
            L.marker([marker.lat, marker.lo1n])
                .addTo(map)
                .bindPopup(`<b>${marker.name}</b><br>${marker.description}`);
        });

        return () => {
            map.remove();
        };
    }, [markers]);

    return <div id="map" style={style} />;


};

export default MapView;
