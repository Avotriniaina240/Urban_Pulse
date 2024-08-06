import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/alerts');
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div>
      <h2>Alertes</h2>
      <ul>
        {alerts.map(alert => (
          <li key={alert.id}>
            <strong>{alert.type}:</strong> {alert.message} <br />
            {new Date(alert.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alerts;
