import React, { useState } from 'react';
import { AlertCircle, Loader2, TrendingUp, MapPin, Menu, Plus, X, Thermometer, Droplets, Wind, Search, Cloud, CloudRain, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock service functions
const fetchDataForLocations = async (locationsInput, coordinatesInput, neighborhoodsInput) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const locations = locationsInput.split(',').filter(loc => loc.trim());
  return locations.map((location, index) => ({
    id: index + 1,
    location: location.trim(),
    airQuality: Math.floor(Math.random() * 50) + 50,
    weather: {
      temperature: Math.floor(Math.random() * 20) + 15,
      humidity: Math.floor(Math.random() * 40) + 40,
      weather: ['Ensoleillé', 'Nuageux', 'Pluvieux'][Math.floor(Math.random() * 3)]
    }
  }));
};

const sortComparisonData = (data, sortBy) => {
  return [...data].sort((a, b) => {
    if (sortBy === 'temperature') return b.weather.temperature - a.weather.temperature;
    if (sortBy === 'humidity') return b.weather.humidity - a.weather.humidity;
    return b.airQuality - a.airQuality;
  });
};

// Enhanced ComparisonToolbar Component
const ComparisonToolbar = ({ onFetchData, onSortChange }) => {
  const [locations, setLocations] = useState(['']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddLocation = () => {
    if (locations.length < 5) {
      setLocations([...locations, '']);
    }
  };

  const handleRemoveLocation = (index) => {
    const newLocations = locations.filter((_, i) => i !== index);
    setLocations(newLocations);
  };

  const handleLocationChange = (index, value) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const locationString = locations.filter((loc) => loc.trim() !== '').join(',');
    await onFetchData(locationString, [], []);
    setIsLoading(false);
    setIsModalOpen(false);
  };

  const metrics = [
    { value: 'air', icon: Wind, label: 'Qualité de l\'air' },
    { value: 'temperature', icon: Thermometer, label: 'Température' },
    { value: 'humidity', icon: Droplets, label: 'Humidité' }
  ];

  return (
    <div className="space-y-6">
      {/* Main Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trier par critère
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none px-4 py-3 bg-white border-2 border-blue-200 text-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
              onChange={(e) => onSortChange(e.target.value)}
              defaultValue="air"
            >
              {metrics.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <Wind size={18} />
            </div>
          </div>
        </div>

        <div className="sm:pt-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
          >
            <Search size={20} />
            Comparer les villes
          </button>
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Comparer les Villes
                </h2>
                <p className="text-gray-600 text-sm">
                  Ajoutez jusqu'à 5 villes pour la comparaison
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              {locations.map((location, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => handleLocationChange(index, e.target.value)}
                    placeholder={`Entrez le nom de la ville ${index + 1}`}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  {locations.length > 1 && (
                    <button
                      onClick={() => handleRemoveLocation(index)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-50 rounded-full"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {locations.length < 5 && (
              <button
                onClick={handleAddLocation}
                className="w-full mb-6 px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <Plus size={20} className="transform group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium">Ajouter une ville</span>
              </button>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || locations.every((loc) => loc.trim() === '')}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Comparer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced ComparisonResults Component
const ComparisonResults = ({ data, sortBy }) => {
  const [currentChart, setCurrentChart] = useState(0);

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-gray-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mb-6">
          <MapPin className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Aucune donnée disponible
        </h3>
        <p className="text-gray-600">
          Utilisez le bouton "Comparer les villes" pour commencer votre analyse
        </p>
      </div>
    );
  }

  const MetricCard = ({ icon: Icon, label, value, unit = '' }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-2">
        <Icon className="text-blue-600" size={18} />
        <span className="text-gray-700 text-sm font-medium">{label}</span>
      </div>
      <span className="font-semibold text-gray-900">{value}{unit}</span>
    </div>
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const charts = [
    // Chart 1: Temperature and Humidity Line Chart
    <ResponsiveContainer key="line" width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="location" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="weather.temperature" name="Température (°C)" stroke="#3b82f6" strokeWidth={2} />
        <Line type="monotone" dataKey="weather.humidity" name="Humidité (%)" stroke="#10b981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>,

    // Chart 2: Air Quality Bar Chart
    <ResponsiveContainer key="bar" width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="location" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="airQuality" name="Qualité de l'air" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>,

    // Chart 3: Temperature Distribution Pie Chart
    <ResponsiveContainer key="pie" width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="weather.temperature"
          nameKey="location"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, value }) => `${name}: ${value}°C`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  ];

  const chartTitles = [
    "Température et Humidité",
    "Qualité de l'air",
    "Distribution des températures"
  ];

  return (
    <div className="space-y-8">
      {/* Charts Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {chartTitles[currentChart]}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentChart((prev) => (prev - 1 + charts.length) % charts.length)}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {currentChart + 1} / {charts.length}
              </span>
              <button
                onClick={() => setCurrentChart((prev) => (prev + 1) % charts.length)}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="h-80 w-full">
            {charts[currentChart]}
          </div>
        </div>
      </div>

      {/* Data Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
              sortBy === 'temperature' ? 'border-blue-200 bg-blue-50/50' :
              sortBy === 'humidity' ? 'border-green-200 bg-green-50/50' :
              'border-indigo-200 bg-indigo-50/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-full p-2 shadow-sm">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{item.location}</h3>
            </div>
            
            <div className="space-y-3">
              <MetricCard icon={Wind} label="Qualité de l'air" value={item.airQuality} />
              <MetricCard icon={Thermometer} label="Température" value={item.weather.temperature} unit="°C" />
              <MetricCard icon={Droplets} label="Humidité" value={item.weather.humidity} unit="%" />
              <MetricCard icon={CloudRain} label="Météo" value={item.weather.weather} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main ComparisonComponent
const ComparisonComponent = () => {
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('air_quality');

  const handleFetchData = async (locationsInput, coordinatesInput, neighborhoodsInput) => {
    console.log('Fetching data for:', { locationsInput, coordinatesInput, neighborhoodsInput });
    setLoading(true);
    setError(null);
    try {
      const uniqueData = await fetchDataForLocations(locationsInput, coordinatesInput, neighborhoodsInput);
      console.log('Fetched data:', uniqueData);
      setComparisonData(uniqueData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Une erreur est survenue lors de la récupération des données.');
      setComparisonData([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedData = sortComparisonData(comparisonData, sortBy);
  console.log('Sorted data:', sortedData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Comparateur de Locations
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analysez et comparez différentes villes selon leurs critères environnementaux
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Toolbar Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <ComparisonToolbar onFetchData={handleFetchData} onSortChange={setSortBy} />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-12">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                  <div className="absolute inset-0 h-12 w-12 border-4 border-blue-200 rounded-full animate-pulse"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Récupération des données...
                  </h3>
                  <p className="text-gray-600">
                    Analyse des informations météorologiques en cours
                  </p>
                </div>
                <div className="w-full max-w-md bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-red-100 rounded-full p-3">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Erreur de chargement
                  </h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {!loading && !error && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <ComparisonResults data={sortedData} sortBy={sortBy} />
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {comparisonData.length > 0 && !loading && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {comparisonData.length}
              </div>
              <div className="text-gray-600 font-medium">Villes analysées</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {sortBy.replace('_', ' ').toUpperCase()}
              </div>
              <div className="text-gray-600 font-medium">Critère de tri</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-green-600 mb-2">
                ✓
              </div>
              <div className="text-gray-600 font-medium">Analyse terminée</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonComponent;