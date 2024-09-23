import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BarChartComponent = ({ data, cityName, daysStudied, temperatureRange, humidityRange }) => {
    return (
        <div className="chart-item-pre">
            <div className="chart-wrapper-pre">
                <BarChart width={1000} height={400} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="temperature" stackId="a" fill="#8884d8" />
                    <Bar dataKey="humidity" stackId="a" fill="#82ca9d" />
                </BarChart>
                <div className="chart-legend-pre">
                    <h3>Détails du Graphique à Barres</h3>
                    <p><strong>Zone étudiée :</strong> {cityName}</p>
                    <p><strong>Jours étudiés :</strong> {daysStudied} jours</p>
                    <p><strong>Variation de température :</strong> Min: {temperatureRange.min}°C, Max: {temperatureRange.max}°C</p>
                    <p><strong>Variation de l'humidité :</strong> Min: {humidityRange.min}%, Max: {humidityRange.max}%</p>
                </div>
            </div>
        </div>
    );
};

export default BarChartComponent;