import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const InputSection = ({ onFetchData, loading, error }) => {
    const [locationsInput, setLocationsInput] = useState('');

    return (
        <div className="input-section-pre">
            <div className="input-toolbar-pre">
                <input
                    type="text"
                    placeholder="Entrez les noms de villes (séparés par des virgules)"
                    value={locationsInput}
                    onChange={(e) => setLocationsInput(e.target.value)}
                />
                <button className='btnpre' onClick={() => onFetchData(locationsInput)} disabled={loading}>
                    <FontAwesomeIcon icon={faSpinner} />
                </button>
            </div>
            {loading && <p>Chargement des données...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default InputSection;