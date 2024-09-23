import { useState, useEffect } from 'react';

export const useGeolocation = () => {
    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('La géolocalisation n\'est pas supportée par ce navigateur.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setPosition({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                setError('Impossible de récupérer la position actuelle.');
            }
        );
    }, []);

    return { position, error };
};
