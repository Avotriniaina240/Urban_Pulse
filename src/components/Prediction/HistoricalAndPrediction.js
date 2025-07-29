import React, { useState, useEffect } from 'react'; 
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';
import { fetchWeatherDataByCity, fetchWeatherDataByCoordinates } from '../../services/ServicePrediction';
import InputToolbar from './InputToolbar';
import BarChartComponent from './BarChartComponent';
import LineChartComponent from './LineChartComponent';
import { ChartCarousel } from './ChartCarousel';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Thermometer, 
  Clock, 
  MapPin, 
  Droplets, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Eye,
  Wind,
  Sun,
  Moon,
  Cloud,
  Zap,
  Activity,
  BarChart3,
  LineChart
} from 'lucide-react';

// Composant StatCard avec design moderne et couleurs bleues
const StatCard = ({ icon: Icon, title, value, trend, trendValue, className, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500',
    secondary: 'bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-500',
    success: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-500',
    warning: 'bg-gradient-to-br from-amber-500 via-orange-600 to-red-500',
    info: 'bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { type: "spring", stiffness: 300, damping: 25 }
      }}
      className={`relative overflow-hidden p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-white/20 hover:shadow-xl transition-all duration-300 group ${variants[variant]} ${className}`}
    >
      {/* Effet de lumière subtle */}
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-300"></div>
      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all duration-300"></div>
      
      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300"
          >
            <Icon className="text-white drop-shadow-sm" size={24} />
          </motion.div>
          <div>
            <p className="text-sm text-white/80 font-medium mb-1">{title}</p>
            <p className="text-[15px] font-bold text-white drop-shadow-sm">{value}</p>
          </div>
        </div>
        
        <AnimatePresence>
          {trend && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full backdrop-blur-sm ${
                trend === 'up' 
                  ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30' 
                  : 'bg-red-500/20 text-red-100 border border-red-400/30'
              }`}
            >
              <motion.div
                animate={{ y: trend === 'up' ? [-1, 1, -1] : [1, -1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </motion.div>
              <span className="text-sm font-semibold">{trendValue}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Composant ChartDetails avec design moderne
const ChartDetails = ({ chartType, cityName, daysStudied, temperatureRange, humidityRange, selectedPoint }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="mt-8 space-y-6"
  >
    {/* Header avec glassmorphism et couleurs bleues */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl backdrop-blur-sm border border-blue-200/20">
      <div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          {chartType === 'bar' ? (
            <>
              <BarChart3 className="text-blue-600" size={28} />
              Statistiques Détaillées
            </>
          ) : (
            <>
              <LineChart className="text-indigo-600" size={28} />
              Données en Temps Réel
            </>
          )}
        </h3>
        <p className="text-gray-600 mt-2 text-sm">
          {chartType === 'bar' 
            ? 'Vue d\'ensemble complète des données météorologiques collectées' 
            : 'Informations détaillées du point de données sélectionné'
          }
        </p>
      </div>
      <motion.span 
        whileHover={{ scale: 1.05 }}
        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-bold shadow-lg backdrop-blur-sm"
      >
        {chartType === 'bar' ? '📊 Vue Globale' : '🎯 Point Actif'}
      </motion.span>
    </div>

{/* Grid de statistiques */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 px-1 py-1 text-[10px]">
  <AnimatePresence mode="wait">
    {chartType === 'bar' ? (
      <>
        <StatCard
          icon={MapPin}
          title="Zone"
          value={cityName}
          variant="primary"
          ultraCompact
        />
        <StatCard
          icon={Clock}
          title="Période"
          value={`${daysStudied} jours`}
          variant="secondary"
          ultraCompact
        />
        <StatCard
          icon={Thermometer}
          title="Température"
          value={`${temperatureRange.min}° - ${temperatureRange.max}°`}
          trend={temperatureRange.max > 25 ? 'up' : 'down'}
          trendValue={`Δ${(temperatureRange.max - temperatureRange.min).toFixed(1)}°`}
          variant="warning"
          ultraCompact
        />
        <StatCard
          icon={Droplets}
          title="Humidité"
          value={`${humidityRange.min}% - ${humidityRange.max}%`}
          trend={humidityRange.max > 70 ? 'up' : 'down'}
          trendValue={`Δ${(humidityRange.max - humidityRange.min).toFixed(1)}%`}
          variant="success"
          ultraCompact
        />
      </>
    ) : selectedPoint ? (
      <>
        <StatCard
          icon={Clock}
          title="Heure"
          value={new Date(selectedPoint.time).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          variant="info"
          ultraCompact
        />
        <StatCard
          icon={Thermometer}
          title="Température"
          value={`${selectedPoint.temperature}°C`}
          trend={selectedPoint.temperature > 20 ? 'up' : 'down'}
          trendValue={selectedPoint.temperature > 20 ? 'Chaud' : 'Frais'}
          variant="warning"
          ultraCompact
        />
        <StatCard
          icon={Droplets}
          title="Humidité"
          value={`${selectedPoint.humidity}%`}
          trend={selectedPoint.humidity > 60 ? 'up' : 'down'}
          trendValue={selectedPoint.humidity > 60 ? 'Humide' : 'Sec'}
          variant="success"
          ultraCompact
        />
        <StatCard
          icon={Activity}
          title="Statut"
          value="Direct"
          variant="secondary"
          ultraCompact
        />
      </>
    ) : (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="col-span-full"
      >
        <div className="text-center py-6 px-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-dashed border-blue-200 relative overflow-hidden text-[10px]">
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${25 + (i % 3) * 25}%`,
                }}
                animate={{
                  y: [-5, 5, -5],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.7, 1.1, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
              className="w-10 h-10 mx-auto mb-2 p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow"
            >
              <Zap className="w-full h-full text-white" />
            </motion.div>
            <h3 className="text-[11px] font-bold text-gray-700 mb-1">
              Sélectionnez un Point
            </h3>
            <p className="text-gray-600 max-w-xs mx-auto leading-snug text-[10px]">
              Cliquez sur un point du graphique pour voir les détails météo.
            </p>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>



    {/* Barre de progression animée pour la vue en barres */}
    {chartType === 'bar' && (
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600 rounded-full transform origin-left shadow-sm"
      />
    )}
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
                <div className="p-6">
                    <div className="h-[500px] w-full mt-2 bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-4 shadow-inner border border-blue-100/50 backdrop-blur-sm">
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
                <div className="p-6">
                    <div className="h-[500px] w-full bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-4 shadow-inner border border-blue-100/50 backdrop-blur-sm">
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

    // Pattern d'arrière-plan subtil
    const backgroundPattern = {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2393C5FD' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.3
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Background pattern */}
            <div 
                className="absolute inset-0" 
                style={backgroundPattern}
            ></div>
            
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="relative z-10 flex-1 p-4 md:p-8 ml-16 md:ml-64 pt-16 overflow-x-hidden">
                    <div className="max-w-[1400px] mx-auto">
                        {/* Header avec animation moderne */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            
                            {/* Barre de recherche avec glassmorphism */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-3 mt-12 h-[75px]"
                            >
                                <InputToolbar
                                    locationsInput={locationsInput}
                                    setLocationsInput={setLocationsInput}
                                    fetchData={fetchData}
                                    loading={loading}
                                />
                                
                                <AnimatePresence>
                                    {loading && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex items-center justify-center py-8"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="relative">
                                                    <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
                                                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-blue-600 font-semibold">Analyse en cours...</p>
                                                    <p className="text-blue-500 text-sm">Traitement des données météorologiques</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="bg-gradient-to-r from-red-50 to-pink-50 text-red-700 p-4 rounded-xl mt-4 border border-red-200 shadow-sm backdrop-blur-sm"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="text-red-500">⚠️</span>
                                                <span className="font-medium">{error}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>

                        {/* Section des graphiques avec design moderne */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
                        >
                            {/* Navigation des onglets modernisée */}
                            <div className="flex border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                                {[
                                    { id: 0, label: 'Vue en Barres', icon: BarChart3, color: 'blue' },
                                    { id: 1, label: 'Évolution Temporelle', icon: LineChart, color: 'indigo' }
                                ].map((tab) => (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => setActiveIndex(tab.id)}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex-1 px-6 py-5 font-semibold transition-all flex items-center justify-center gap-3 ${
                                            activeIndex === tab.id
                                                ? `text-${tab.color}-600 bg-white border-b-2 border-${tab.color}-500 shadow-sm`
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                        }`}
                                    >
                                        <tab.icon size={20} />
                                        {tab.label}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Contenu des graphiques avec ChartCarousel */}
                            <ChartCarousel activeIndex={activeIndex} setActiveIndex={setActiveIndex}>
                                {slides.map((slide, index) => slide.content)}
                            </ChartCarousel>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HistoricalAndPrediction;