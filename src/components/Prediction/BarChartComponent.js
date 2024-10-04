import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BarChartComponent = ({ data }) => (
    <BarChart width={1000} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="temperature" stackId="a" fill="#8884d8" />
        <Bar dataKey="humidity" stackId="a" fill="#82ca9d" />
    </BarChart>
);

export default BarChartComponent;
