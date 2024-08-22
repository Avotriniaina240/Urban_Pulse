import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Analyse/Legend.css'; // Assurez-vous d'avoir un fichier CSS pour styliser la légende

const Legend = ({ items, title }) => {
    return (
        <div className="legend-container">
            {title && <h3 className="legend-title">{title}</h3>}
            <ul className="legend-list">
                {items.map((item, index) => (
                    <li key={index} className="legend-item">
                        <span
                            className="legend-color-box"
                            style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="legend-abbreviation">{item.abbreviation}</span>:&nbsp;
                        <span className="legend-label">{item.label}</span>
                        <p className="legend-description">{item.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

Legend.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            abbreviation: PropTypes.string.isRequired, // Nouvelle propriété pour les abréviations
            label: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired, // Nouvelle propriété pour les descriptions
            color: PropTypes.string.isRequired
        })
    ).isRequired,
    title: PropTypes.string
};

export default Legend;
