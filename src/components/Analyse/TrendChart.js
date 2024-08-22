import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Exemple de données pour tester
const exampleData = [
    { date: '2024-01-01', value1: 4000, value2: 2400 },
    { date: '2024-01-02', value1: 3000, value2: 1398 },
    { date: '2024-01-03', value1: 2000, value2: 9800 },
    // Ajoutez d'autres points de données ici
];

const TrendChart = ({ data, legendTitle }) => {
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
                    <Line 
                        type="monotone" 
                        dataKey="value1" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                        isAnimationActive={true}
                        dot={{ stroke: '#8884d8', strokeWidth: 2, r: 3 }} 
                    />
                    <Line 
                        type="monotone" 
                        dataKey="value2" 
                        stroke="#82ca9d" 
                        activeDot={{ r: 8 }} 
                        isAnimationActive={true}
                        dot={{ stroke: '#82ca9d', strokeWidth: 2, r: 3 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
            <div className="description-container1">
                <div className="description-item">
                    <span className="description-color" style={{ backgroundColor: '#8884d8' }}></span>
                    <span className="description-text">
                        <strong>Value1</strong>: Représente les ventes mensuelles réalisées par l'entreprise. Ce chiffre montre l'évolution des ventes au fil des mois.
                    </span>
                </div>
                <div className="description-item">
                    <span className="description-color" style={{ backgroundColor: '#82ca9d' }}></span>
                    <span className="description-text">
                        <strong>Value2</strong>: Représente les objectifs de ventes fixés par l'entreprise. Ce chiffre permet de comparer les performances réelles aux objectifs fixés.
                    </span>
                </div>
            </div>
        </div>
    );
};

// Utilisation du composant
const App = () => (
    <TrendChart data={exampleData} legendTitle="Évolution des Valeurs" />
);

export default App;
