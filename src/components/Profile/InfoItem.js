import React from 'react';

const InfoItem = ({ icon, label, value, isEditing, name, onChange, type = 'text' }) => (
  <li className="info-item">
    {icon}
    <div className="info-details">
      <span className="info-label">{label}:</span>
      {isEditing ? (
        <input 
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="info-input"
        />
      ) : (
        <span className="info-value">{value || 'Non défini'}</span>
      )}
    </div>
  </li>
);

export default InfoItem;
