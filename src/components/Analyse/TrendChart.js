import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const TrendChart = ({ data, legendTitle }) => {
    if (!data || data.length === 0) {
        return <p>Aucune donnée disponible pour afficher le graphique.</p>;
    }

    // Dynamiquement extraire les clés pour les lignes, en supposant que chaque clé représente une série de données
    const lineKeys = Object.keys(data[0]).filter(key => key !== 'date');
    
    return (
        <div>
            {legendTitle && <h3 className="legend-title">{legendTitle}</h3>}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(tick) => new Date(tick).toLocaleDateString('fr-FR')}
                    />
                    <YAxis />
                    <Tooltip 
                        formatter={(value) => [value, 'Valeur']} 
                        labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString('fr-FR')}`} 
                    />
                    <Legend 
                        wrapperStyle={{ paddingTop: "10px", textAlign: "center" }} 
                    />
                    {lineKeys.map((key, index) => (
                        <Line 
                            key={key}
                            type="monotone" 
                            dataKey={key} 
                            stroke={index % 2 === 0 ? '#8884d8' : '#82ca9d'} 
                            activeDot={{ r: 8 }} 
                            isAnimationActive={true}
                            dot={{ stroke: index % 2 === 0 ? '#8884d8' : '#82ca9d', strokeWidth: 2, r: 3 }} 
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
            {legendTitle && (
                <div className="description-container1">
                    {lineKeys.map((key, index) => (
                        <div className="description-item" key={key}>
                            <span className="description-color" style={{ backgroundColor: index % 2 === 0 ? '#8884d8' : '#82ca9d' }}></span>
                            <span className="description-text">
                                <strong>{key}</strong>: Représente les données associées à la série <strong>{key}</strong>. Ce chiffre montre l'évolution au fil du temps.
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrendChart;
