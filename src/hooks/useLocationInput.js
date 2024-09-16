// src/hooks/useLocationInput.js
import { useState } from 'react';

const useLocationInput = () => {
    const [locations, setLocations] = useState(['']);
    const [coordinatePairs, setCoordinatePairs] = useState([{ latitude: '', longitude: '' }]);

    const handleLocationChange = (index, value) => {
        const newLocations = [...locations];
        newLocations[index] = value;
        setLocations(newLocations);
    };

    const addLocationField = () => {
        setLocations([...locations, '']);
    };

    const removeLocationField = (index) => {
        const newLocations = locations.filter((_, i) => i !== index);
        setLocations(newLocations);
    };

    const handleCoordinateChange = (index, e) => {
        const { name, value } = e.target;
        const newPairs = [...coordinatePairs];
        newPairs[index] = { ...newPairs[index], [name]: value };
        setCoordinatePairs(newPairs);
    };

    const addCoordinatePair = () => {
        setCoordinatePairs([...coordinatePairs, { latitude: '', longitude: '' }]);
    };

    const removeCoordinatePair = (index) => {
        const newPairs = coordinatePairs.filter((_, i) => i !== index);
        setCoordinatePairs(newPairs);
    };

    return {
        locations,
        coordinatePairs,
        handleLocationChange,
        addLocationField,
        removeLocationField,
        handleCoordinateChange,
        addCoordinatePair,
        removeCoordinatePair
    };
};

export default useLocationInput;