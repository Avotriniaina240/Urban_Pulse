import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const WeatherCharts = ({ trendData, cityName, analysisData }) => {
    const [selectedPoint, setSelectedPoint] = useState(null);

    return (
        <div className="chart-container-pre">
            <div className="chart-item-pre">
                <div className="chart-wrapper-pre">
                    <BarChart width={1000} height={400} data={trendData}>
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
                        <p><strong>Jours étudiés :</strong> {analysisData.daysStudied} jours</p>
                        <p><strong>Variation de température :</strong> Min: {analysisData.temperatureRange.min}°C, Max: {analysisData.temperatureRange.max}°C</p>
                        <p><strong>Variation de l'humidité :</strong> Min: {analysisData.humidityRange.min}%, Max: {analysisData.humidityRange.max}%</p>
                    </div>
                </div>
            </div>

            <div className="chart-item-pre">
                <div className="chart-wrapper-pre">
                    <LineChart
                        width={1000}
                        height={400}
                        data={trendData}
                        onClick={(e) => setSelectedPoint(e.activePayload ? e.activePayload[0].payload : null)}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8, fill: '#ff0000' }} />
                        <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
                    </LineChart>
                    <div className="chart-legend-pre">
                        <h3>Détails du Graphique Linéaire</h3>
                        <p><strong>Zone étudiée :</strong> {cityName}</p>
                        {selectedPoint ? (
                            <>
                                <p><strong>Point sélectionné :</strong> {selectedPoint.time}</p>
                                <p><strong>Température :</strong> {selectedPoint.temperature}°C</p>
                                <p><strong>Humidité :</strong> {selectedPoint.humidity}%</p>
                            </>
                        ) : (
                            <p>Cliquez sur un point pour afficher les détails.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCharts;