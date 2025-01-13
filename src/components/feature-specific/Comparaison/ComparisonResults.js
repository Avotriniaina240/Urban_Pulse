import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Cloud, Thermometer, Droplets, CloudRain, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ComparisonResults = ({ data, sortBy }) => {
  const [currentChart, setCurrentChart] = useState(0);

  if (!data?.length) {
    return (
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex items-center gap-2 justify-center p-4 bg-gray-50 rounded-lg">
        <Cloud size={20} className="text-[#33b1e1]" />
        <p className="text-gray-600">Sélectionnez des villes pour commencer</p>
      </motion.div>
    );
  }

  const MetricCard = ({ icon: Icon, label, value, unit = '' }) => (
    <div className="flex items-center justify-between p-2 bg-white/80 rounded">
      <div className="flex items-center gap-1.5">
        <Icon className="text-[#33b1e1]" size={16} />
        <span className="text-gray-600 text-sm">{label}</span>
      </div>
      <span className="font-medium">{value}{unit}</span>
    </div>
  );

  const COLORS = ['#8bc540', '#ff9800', '#33b1e1', '#e91e63'];

  const charts = [
    // Chart 1: Temperature and Humidity Line Chart
    <ResponsiveContainer key="line">
      <LineChart data={data} margin={{top:10, right:10, left:10, bottom:10}}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="location" />
        <YAxis />
        <Tooltip />
        <Legend align="center" verticalAlign="top" height={36} />
        <Line type="monotone" dataKey="weather.temperature" name="Temp 🌡️" stroke="#8bc540" />
        <Line type="monotone" dataKey="weather.humidity" name="Hum 💧" stroke="#ff9800" />
      </LineChart>
    </ResponsiveContainer>,

    // Chart 2: Air Quality Bar Chart
    <ResponsiveContainer key="bar">
      <BarChart data={data} margin={{top:10, right:10, left:10, bottom:10}}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="location" />
        <YAxis />
        <Tooltip />
        <Legend align="center" verticalAlign="top" height={36} />
        <Bar dataKey="airQuality" name="Qualité de l'air" fill="#33b1e1" />
      </BarChart>
    </ResponsiveContainer>,

    // Chart 3: Temperature Distribution Pie Chart
    <ResponsiveContainer key="pie">
      <PieChart>
        <Pie
          data={data}
          dataKey="weather.temperature"
          nameKey="location"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend align="center" verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  ];

  const chartTitles = [
    "Température et Humidité",
    "Qualité de l'air",
    "Distribution des températures"
  ];

  return (
    <div className="space-y-4 ml-3 w-[98%] mt-3">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-3 bg-white rounded-lg shadow border border-[#33b1e1]/20">
        <div className="relative">
          <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-10">
            <button
              onClick={() => setCurrentChart((prev) => (prev - 1 + charts.length) % charts.length)}
              className="p-1 rounded-full bg-white shadow hover:bg-gray-50"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
          </div>
          
          <div className="text-center mb-2 font-medium text-gray-700">
            {chartTitles[currentChart]}
          </div>

          <div className="h-[300px] w-[98%]">
            {charts[currentChart]}
          </div>

          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
            <button
              onClick={() => setCurrentChart((prev) => (prev + 1) % charts.length)}
              className="p-1 rounded-full bg-white shadow hover:bg-gray-50"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-[100%]">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{opacity:0}}
            animate={{opacity:1}}
            transition={{delay: index * 0.1}}
            className={`p-3 rounded-lg mb-4 shadow hover:shadow-md transition ${
              sortBy === 'temperature' ? 'bg-[#8bc540]/10' :
              sortBy === 'humidity' ? 'bg-orange-50' :
              'bg-white'
            }`}
          >
            <h3 className="text-base font-bold mb-2">{item.location}</h3>
            <div className="space-y-2">
              <MetricCard icon={Cloud} label="Air" value={item.airQuality} />
              <MetricCard icon={Thermometer} label="Temp" value={item.weather.temperature} unit="°C" />
              <MetricCard icon={Droplets} label="Hum" value={item.weather.humidity} unit="%" />
              <MetricCard icon={CloudRain} label="Météo" value={item.weather.weather} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonResults;