import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import TrendChart from '../Analyse/TrendChart';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const GraphiquesUrbains = ({ trendData, pieChartData }) => {
    return (
        <div className="chart-container-urb">
            <div className="chart-item">
                <h2 className="pie-chart-title">Répartition des Températures</h2>
                <PieChart width={400} height={400}>
                    <Pie 
                        data={pieChartData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={150} 
                        fill="#8884d8" 
                        label
                    >
                        {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
            </div>
            <div className="chart-item-char">
                <TrendChart data={trendData} legendTitle="Évolution des Températures" />
            </div>
        </div>
    );
};

export default GraphiquesUrbains;