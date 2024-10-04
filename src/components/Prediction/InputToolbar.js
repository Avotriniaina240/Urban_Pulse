import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const InputToolbar = ({ locationsInput, setLocationsInput, fetchData, loading }) => (
    <div className="input-toolbar-pre">
        <input
            className='input-pred'
            type="text"
            placeholder="Entrez le nom de la ville"
            value={locationsInput}
            onChange={(e) => setLocationsInput(e.target.value)}
        />
        <button className="btnpre" onClick={fetchData} disabled={loading}>
            <FontAwesomeIcon icon={faSpinner} className={loading ? "fa-spin" : ""} />
        </button>
    </div>
);

export default InputToolbar;
