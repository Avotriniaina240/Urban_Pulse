import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const LineChartComponent = ({ data, cityName, selectedPoint, setSelectedPoint }) => {
    return (
        <div className="chart-item-pre">
            <div className="chart-wrapper-pre">
                <LineChart
                    width={1000}
                    height={400}
                    data={data}
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
    );
};

export default LineChartComponent;