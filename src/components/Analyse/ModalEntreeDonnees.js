import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';

const ModalEntreeDonnees = ({ isOpen, onClose, onFetchData, loading, error }) => {
    const [dataType, setDataType] = useState('ville');
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

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content-urb">
                <button className="btn-close" onClick={onClose}>×</button>
                <h2>Choisir le type de données</h2>
                <select value={dataType} onChange={(e) => setDataType(e.target.value)}>
                    <option value="ville">Ville</option>
                    <option value="quartier">Quartier</option>
                    <option value="coordonnées">Coordonnées</option>
                </select>
                {dataType === 'ville' && (
                    <>
                        <h2>Entrez les villes</h2>
                        {locations.map((location, index) => (
                            <div key={index} className="location-input-group">
                                <input
                                    type="text"
                                    placeholder="Nom de la ville"
                                    value={location}
                                    onChange={(e) => handleLocationChange(index, e.target.value)}
                                />
                                <button className="btn-remove" onClick={() => removeLocationField(index)}>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>
                        ))}
                        <button className="btn-add" onClick={addLocationField}>
                            Ajouter une Ville
                        </button>
                    </>
                )}

                {dataType === 'quartier' && (
                    <>
                        <h2>Entrez les quartiers</h2>
                        {locations.map((location, index) => (
                            <div key={index} className="location-input-group">
                                <input
                                    type="text"
                                    placeholder="Nom du quartier"
                                    value={location}
                                    onChange={(e) => handleLocationChange(index, e.target.value)}
                                />
                                <button className="btn-remove" onClick={() => removeLocationField(index)}>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>
                        ))}
                        <button className="btn-add" onClick={addLocationField}>
                            Ajouter un Quartier
                        </button>
                    </>
                )}

                {dataType === 'coordonnées' && (
                    <>
                        <h2>Entrez les coordonnées</h2>
                        {coordinatePairs.map((pair, index) => (
                            <div key={index} className="coordinate-input-group">
                                <input
                                    type="number"
                                    placeholder="Latitude"
                                    name="latitude"
                                    value={pair.latitude}
                                    onChange={(e) => handleCoordinateChange(index, e)}
                                />
                                <input
                                    type="number"
                                    placeholder="Longitude"
                                    name="longitude"
                                    value={pair.longitude}
                                    onChange={(e) => handleCoordinateChange(index, e)}
                                />
                                <button className="btn-remove" onClick={() => removeCoordinatePair(index)}>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>
                        ))}
                        <button className="btn-add" onClick={addCoordinatePair}>
                            Ajouter une Coordonnée
                        </button>
                    </>
                )}

                <button className='btnana-urb' onClick={() => onFetchData(dataType, locations, coordinatePairs)} disabled={loading}>
                    {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSpinner} />}
                </button>
                {loading && <p>Chargement des données...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default ModalEntreeDonnees;