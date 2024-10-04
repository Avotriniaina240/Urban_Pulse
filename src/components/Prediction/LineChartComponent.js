import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const LineChartComponent = ({ data, setSelectedPoint }) => (
    <LineChart width={1000} height={400} data={data} onClick={(e) => setSelectedPoint(e.activePayload ? e.activePayload[0].payload : null)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8, fill: '#ff0000' }} />
        <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
    </LineChart>
);

export default LineChartComponent;
