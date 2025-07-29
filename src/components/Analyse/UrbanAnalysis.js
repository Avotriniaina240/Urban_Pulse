import React, { useState, useEffect } from 'react';
import { 
  Menu, Loader2, TrendingUp, Wind, Droplets, Thermometer, Sun, 
  MapPin, BarChart3, Activity, Plus,
  X, ChevronRight, Zap, Leaf, Users, Building
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, 
  BarChart, Bar, AreaChart, Area
} from 'recharts';
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
const GRADIENT_COLORS = [
  'from-indigo-500 to-purple-600',
  'from-purple-500 to-pink-600',
  'from-pink-500 to-rose-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-600'
];

// Composant Modal amélioré
const DataEntryModal = ({ isOpen, onClose, onFetchData, loading, error }) => {
  const [dataType, setDataType] = useState('ville');
  const [locations, setLocations] = useState(['']);
  const [coordinatePairs, setCoordinatePairs] = useState([{ latitude: '', longitude: '' }]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onFetchData(dataType, locations, coordinatePairs);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Configuration des données</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-2 text-indigo-100">Sélectionnez le type de données à analyser</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Type selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Type de données</label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="ville"> Ville</option>
              <option value="quartier">Quartier</option>
              <option value="coordonnées">Coordonnées GPS</option>
            </select>
          </div>

          {/* Location inputs */}
          {(dataType === 'ville' || dataType === 'quartier') && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                {dataType === 'ville' ? 'Noms des villes' : 'Noms des quartiers'}
              </label>
              <div className="space-y-3">
                {locations.map((location, index) => (
                  <div key={index} className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      value={location}
                      onChange={(e) => {
                        const newLocations = [...locations];
                        newLocations[index] = e.target.value;
                        setLocations(newLocations);
                      }}
                      placeholder={`${dataType} ${index + 1}`}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {locations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setLocations(locations.filter((_, i) => i !== index))}
                        className="absolute right-3 top-3 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setLocations([...locations, ''])}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 text-gray-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter {dataType === 'ville' ? 'une ville' : 'un quartier'}
                </button>
              </div>
            </div>
          )}

          {/* Coordinate inputs */}
          {dataType === 'coordonnées' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Coordonnées GPS</label>
              <div className="space-y-3">
                {coordinatePairs.map((pair, index) => (
                  <div key={index} className="relative bg-gray-50 p-4 rounded-xl">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={pair.latitude}
                          onChange={(e) => {
                            const newPairs = [...coordinatePairs];
                            newPairs[index].latitude = e.target.value;
                            setCoordinatePairs(newPairs);
                          }}
                          placeholder="Latitude"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          value={pair.longitude}
                          onChange={(e) => {
                            const newPairs = [...coordinatePairs];
                            newPairs[index].longitude = e.target.value;
                            setCoordinatePairs(newPairs);
                          }}
                          placeholder="Longitude"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      {coordinatePairs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setCoordinatePairs(coordinatePairs.filter((_, i) => i !== index))}
                          className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCoordinatePairs([...coordinatePairs, { latitude: '', longitude: '' }])}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 text-gray-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter des coordonnées
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  Lancer l'analyse
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant MetricCard
const MetricCard = ({ title, value, unit, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-3 bg-gradient-to-br ${color} rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value} <span className="text-lg text-gray-500">{unit}</span>
          </p>
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
          trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  </div>
);

// Composant principal
const UrbanAnalysis = () => {
  const [trendData, setTrendData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées pour la démonstration
  useEffect(() => {
    const mockData = [
    
    ];
    
    setTrendData(mockData);
    setPieChartData(mockData.map(data => ({
      name: data.city,
      value: data.temperature,
      population: data.population
    })));
  }, []);

  const fetchAndAnalyzeData = async (dataType, locations, coordinatePairs) => {
    setLoading(true);
    setError(null);
    
    // Simulation de l'appel API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Données simulées basées sur les entrées
      const mockWeatherData = locations.filter(loc => loc.trim()).map((location, index) => ({
        city: location,
        temperature: 20 + Math.random() * 10,
        humidity: 50 + Math.random() * 30,
        population: 100000 + Math.random() * 1000000,
        greenSpace: 10 + Math.random() * 15,
        airQuality: 30 + Math.random() * 40,
        date: new Date().toLocaleDateString()
      }));

      setTrendData(mockWeatherData);
      setPieChartData(mockWeatherData.map(data => ({
        name: data.city,
        value: data.temperature,
        population: data.population
      })));
      
      setIsModalOpen(false);
    } catch (err) {
      setError('Erreur lors de la récupération des données.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'trends', label: 'Tendances', icon: TrendingUp },
    { id: 'analysis', label: 'Analyse', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      
      <div className="lg:pl-64 pt-16">
        <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Analyse Urbaine
                  </h1>
                  <p className="text-gray-600 mt-1">Tableau de bord analytique des données urbaines</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  Nouvelle analyse
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-6">
            {/* Tabs */}
            <div className="flex gap-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600 shadow-lg border border-indigo-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Température moyenne"
                value={trendData.length ? (trendData.reduce((acc, item) => acc + item.temperature, 0) / trendData.length).toFixed(1) : '0'}
                unit="°C"
                icon={Thermometer}
                color="from-orange-400 to-red-500"
                trend={2.3}
              />
              <MetricCard
                title="Humidité moyenne"
                value={trendData.length ? (trendData.reduce((acc, item) => acc + item.humidity, 0) / trendData.length).toFixed(0) : '0'}
                unit="%"
                icon={Droplets}
                color="from-blue-400 to-cyan-500"
                trend={-1.2}
              />
              <MetricCard
                title="Population totale"
                value={trendData.length ? (trendData.reduce((acc, item) => acc + item.population, 0) / 1000000).toFixed(1) : '0'}
                unit="M"
                icon={Users}
                color="from-purple-400 to-indigo-500"
                trend={5.8}
              />
              <MetricCard
                title="Espaces verts"
                value={trendData.length ? (trendData.reduce((acc, item) => acc + item.greenSpace, 0) / trendData.length).toFixed(1) : '0'}
                unit="%"
                icon={Leaf}
                color="from-green-400 to-emerald-500"
                trend={-0.5}
              />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Line Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Analyse temporelle</h3>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Activity className="w-5 h-5" />
                    <span className="text-sm">Données en temps réel</span>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="city" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: 'none', 
                          borderRadius: '12px',
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                        }} 
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#8b5cf6" 
                        fillOpacity={1}
                        fill="url(#tempGradient)"
                        name="Température (°C)" 
                        strokeWidth={3}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="humidity" 
                        stroke="#06b6d4" 
                        fillOpacity={1}
                        fill="url(#humidityGradient)"
                        name="Humidité (%)" 
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Répartition des températures</h3>
                  <div className="flex items-center gap-2 text-gray-500">
                    <BarChart3 className="w-5 h-5" />
                    <span className="text-sm">Distribution</span>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${value.toFixed(1)}°C (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={3}
                        stroke="#ffffff"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            className="hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: 'none', 
                          borderRadius: '12px',
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3">
                  <Building className="w-8 h-8" />
                  <div>
                    <p className="text-indigo-100">Zones analysées</p>
                    <p className="text-2xl font-bold">{trendData.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3">
                  <Leaf className="w-8 h-8" />
                  <div>
                    <p className="text-emerald-100">Qualité de l'air moyenne</p>
                    <p className="text-2xl font-bold">
                      {trendData.length ? (trendData.reduce((acc, item) => acc + item.airQuality, 0) / trendData.length).toFixed(0) : '0'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8" />
                  <div>
                    <p className="text-orange-100">Dernière mise à jour</p>
                    <p className="text-lg font-semibold">Il y a 2 min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DataEntryModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onFetchData={fetchAndAnalyzeData}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default UrbanAnalysis;