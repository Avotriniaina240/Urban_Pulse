import React, { useState, useEffect } from 'react'; 
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';
import { fetchWeatherDataByCity, fetchWeatherDataByCoordinates } from '../../services/ServicePrediction';
import InputToolbar from './InputToolbar';
import BarChartComponent from './BarChartComponent';
import LineChartComponent from './LineChartComponent';
import { ChartCarousel } from './ChartCarousel';
import { motion } from 'framer-motion';
import { Thermometer, Clock, MapPin, Droplets, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, trend, trendValue, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all ${className}`}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-lg bg-blue-50">
          <Icon className="text-blue-500" size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </div>
      {trend && (
        <div className={`flex items-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
          <span className="text-sm font-medium">{trendValue}</span>
        </div>
      )}
    </div>
  </motion.div>
);

const ChartDetails = ({ chartType, cityName, daysStudied, temperatureRange, humidityRange, selectedPoint }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="-mt-4 space-y-4"
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {chartType === 'bar' ? 'Statistiques Détaillées' : 'Données en Temps Réel'}
      </h3>
      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
        {chartType === 'bar' ? 'Vue Globale' : 'Point Sélectionné'}
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {chartType === 'bar' ? (
        <>
          <StatCard
            icon={MapPin}
            title="Zone Étudiée"
            value={cityName}
            className="bg-gradient-to-br from-blue-50 to-white"
          />
          <StatCard
            icon={Clock}
            title="Période"
            value={`${daysStudied} jours`}
            className="bg-gradient-to-br from-purple-50 to-white"
          />
          <StatCard
            icon={Thermometer}
            title="Plage de Température"
            value={`${temperatureRange.min}°C - ${temperatureRange.max}°C`}
            trend={temperatureRange.max > 25 ? 'up' : 'down'}
            trendValue={`${(temperatureRange.max - temperatureRange.min).toFixed(1)}°C`}
            className="bg-gradient-to-br from-orange-50 to-white"
          />
          <StatCard
            icon={Droplets}
            title="Plage d'Humidité"
            value={`${humidityRange.min}% - ${humidityRange.max}%`}
            trend={humidityRange.max > 70 ? 'up' : 'down'}
            trendValue={`${(humidityRange.max - humidityRange.min).toFixed(1)}%`}
            className="bg-gradient-to-br from-green-50 to-white"
          />
        </>
      ) : selectedPoint ? (
        <>
          <StatCard
            icon={Clock}
            title="Heure"
            value={new Date(selectedPoint.time).toLocaleTimeString()}
            className="bg-gradient-to-br from-blue-50 to-white"
          />
          <StatCard
            icon={Thermometer}
            title="Température"
            value={`${selectedPoint.temperature}°C`}
            trend={selectedPoint.temperature > 20 ? 'up' : 'down'}
            trendValue={`${selectedPoint.temperature}°C`}
            className="bg-gradient-to-br from-orange-50 to-white"
          />
          <StatCard
            icon={Droplets}
            title="Humidité"
            value={`${selectedPoint.humidity}%`}
            trend={selectedPoint.humidity > 60 ? 'up' : 'down'}
            trendValue={`${selectedPoint.humidity}%`}
            className="bg-gradient-to-br from-green-50 to-white"
          />
        </>
      ) : (
        <div className="col-span-full text-center py-8 bg-gray-50 rounded-xl">
          <p className="text-gray-500 italic">
            Sélectionnez un point dans le graphique pour voir les détails
          </p>
        </div>
      )}
    </div>
  </motion.div>
);

const HistoricalAndPrediction = () => {
    const [trendData, setTrendData] = useState([]);
    const [locationsInput, setLocationsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [daysStudied, setDaysStudied] = useState(0);
    const [temperatureRange, setTemperatureRange] = useState({ min: null, max: null });
    const [humidityRange, setHumidityRange] = useState({ min: null, max: null });
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [cityName, setCityName] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const weatherData = await fetchWeatherDataByCity(locationsInput);
            setCityName(locationsInput);
            setTrendData(weatherData);
            calculateStats(weatherData);
        } catch (err) {
            setError(`Une erreur est survenue: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (weatherData) => {
        if (weatherData && weatherData.length > 0) {
            const startDate = new Date(weatherData[0]?.time);
            const endDate = new Date(weatherData[weatherData.length - 1]?.time);
            const diffDays = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));
            setDaysStudied(diffDays);

            const temperatures = weatherData.map(d => d.temperature);
            const humidities = weatherData.map(d => d.humidity);

            setTemperatureRange({
                min: Math.min(...temperatures),
                max: Math.max(...temperatures)
            });
            setHumidityRange({
                min: Math.min(...humidities),
                max: Math.max(...humidities)
            });
        }
    };

    const slides = [
        {
            content: (
                <div className="p-4">
                    <div className="h-[500px] w-full mt-2">
                        <BarChartComponent data={trendData} className="w-full h-full" />
                    </div>
                    <ChartDetails
                        chartType="bar"
                        cityName={cityName}
                        daysStudied={daysStudied}
                        temperatureRange={temperatureRange}
                        humidityRange={humidityRange}
                    />
                </div>
            )
        },
        {
            content: (
                <div className="p-4">
                    <div className="h-[500px] w-full">
                        <LineChartComponent 
                            data={trendData} 
                            setSelectedPoint={setSelectedPoint} 
                            className="w-full h-full" 
                        />
                    </div>
                    <ChartDetails
                        chartType="line"
                        selectedPoint={selectedPoint}
                    />
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6 ml-16 md:ml-64 pt-16 overflow-x-hidden">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="mb-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 gradient-text">
                                Données et Prédiction
                            </h1>
                            
                            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                                <InputToolbar
                                    locationsInput={locationsInput}
                                    setLocationsInput={setLocationsInput}
                                    fetchData={fetchData}
                                    loading={loading}
                                />
                                {loading && (
                                    <div className="flex items-center justify-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b8e4]"></div>
                                    </div>
                                )}
                                {error && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mt-4">
                                        {error}
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-lg shadow-sm">
                                <ChartCarousel activeIndex={activeIndex} setActiveIndex={setActiveIndex}>
                                    {slides.map((slide, index) => slide.content)}
                                </ChartCarousel>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HistoricalAndPrediction;