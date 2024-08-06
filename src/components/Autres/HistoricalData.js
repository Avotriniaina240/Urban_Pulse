import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistoricalData = () => {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/historical_data');
        setHistoricalData(response.data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchHistoricalData();
  }, []);

  return (
    <div>
      <h2>Données Historiques</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data Point ID</th>
            <th>Valeur</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {historicalData.map(data => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.data_point_id}</td>
              <td>{data.value}</td>
              <td>{new Date(data.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoricalData;
