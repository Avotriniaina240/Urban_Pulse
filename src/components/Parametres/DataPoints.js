import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataPoints = () => {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const fetchDataPoints = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data_points');
        setDataPoints(response.data);
      } catch (error) {
        console.error('Error fetching data points:', error);
      }
    };

    fetchDataPoints();
  }, []);

  return (
    <div>
      <h2>Points de Données</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Valeur</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {dataPoints.map(point => (
            <tr key={point.id}>
              <td>{point.id}</td>
              <td>{point.type}</td>
              <td>{point.value}</td>
              <td>{point.latitude}</td>
              <td>{point.longitude}</td>
              <td>{new Date(point.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataPoints;
