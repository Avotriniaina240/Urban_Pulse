import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TrendChart = ({ data, legendTitle }) => {
    if (!data || data.length === 0) {
        return <div>Pas de données disponibles pour le graphique de tendance</div>;
    }

    return (
        <LineChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" name={legendTitle} />
        </LineChart>
    );
};

export default TrendChart;