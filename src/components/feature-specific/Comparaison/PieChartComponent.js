import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartComponent = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>Pas de données disponibles pour le graphique circulaire</div>;
    }

    return (
        <PieChart width={400} height={400}>
            <Pie 
                data={data} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={150} 
                fill="#8884d8" 
                label
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
    );
};

export default PieChartComponent;