import React, { useState, useEffect } from 'react';
import { Menu, Loader2, TrendingUp, Wind, Droplets, Thermometer, Sun } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, 
  BarChart, Bar 
} from 'recharts';
import { fetchWeatherData, fetchWeatherDataByCoords } from './serviceMeteo';
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Composant Modal pour la saisie des données
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Entrer les données</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ville">Ville</option>
            <option value="quartier">Quartier</option>
            <option value="coordonnées">Coordonnées</option>
          </select>

          {(dataType === 'ville' || dataType === 'quartier') && (
            <div className="space-y-3">
              {locations.map((location, index) => (
                <input
                  key={index}
                  value={location}
                  onChange={(e) => {
                    const newLocations = [...locations];
                    newLocations[index] = e.target.value;
                    setLocations(newLocations);
                  }}
                  placeholder={`${dataType} ${index + 1}`}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
              <button
                type="button"
                onClick={() => setLocations([...locations, ''])}
                className="w-full p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Ajouter un {dataType}
              </button>
            </div>
          )}

          {dataType === 'coordonnées' && (
            <div className="space-y-3">
              {coordinatePairs.map((pair, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="number"
                    value={pair.latitude}
                    onChange={(e) => {
                      const newPairs = [...coordinatePairs];
                      newPairs[index].latitude = e.target.value;
                      setCoordinatePairs(newPairs);
                    }}
                    placeholder="Latitude"
                    className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={pair.longitude}
                    onChange={(e) => {
                      const newPairs = [...coordinatePairs];
                      newPairs[index].longitude = e.target.value;
                      setCoordinatePairs(newPairs);
                    }}
                    placeholder="Longitude"
                    className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setCoordinatePairs([...coordinatePairs, { latitude: '', longitude: '' }])}
                className="w-full p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Ajouter des coordonnées
              </button>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-[#33b1e1] to-[#8bc540] text-white rounded-lg hover:opacity-80 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Valider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant principal UrbanAnalysis
const UrbanAnalysis = () => {
  const [trendData, setTrendData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [urbanMetrics, setUrbanMetrics] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [forecasts, setForecasts] = useState(null);

  // Fonctions d'analyse urbaine
  const calculateUrbanMetrics = (data) => {
    return {
      densityScore: data.population / data.area,
      walkabilityIndex: (data.amenities * 0.4) + (data.connectivity * 0.3) + (data.sidewalks * 0.3),
      greenSpaceRatio: data.greenSpace / data.population,
      transitAccessibility: (data.busStops * 0.3) + (data.metroStations * 0.4) + (data.trainStations * 0.3),
      heatIslandIndex: data.temperature + (data.buildingDensity * 0.4) - (data.vegetation * 0.3),
      airQualityIndex: (data.pm25 * 0.35) + (data.no2 * 0.25) + (data.o3 * 0.25) + (data.co * 0.15)
    };
  };

  const analyzeTrends = (data) => {
    return {
      temperatureTrend: data.map((item, i, arr) => i === 0 ? 0 : 
        ((item.temperature - arr[i-1].temperature) / arr[i-1].temperature) * 100),
      populationGrowth: data.map((item, i, arr) => i === 0 ? 0 : 
        ((item.population - arr[i-1].population) / arr[i-1].population) * 100),
      landUseChanges: data.map((item, i, arr) => i === 0 ? {} : {
        residential: item.residential - arr[i-1].residential,
        commercial: item.commercial - arr[i-1].commercial,
        greenSpace: item.greenSpace - arr[i-1].greenSpace
      })
    };
  };

  const generateForecasts = (data) => {
    const lastPoint = data[data.length - 1];
    const growthRate = 0.02; // Taux de croissance exemple
    
    return {
      population: Array(5).fill(0).map((_, i) => 
        lastPoint.population * Math.pow(1 + growthRate, i + 1)),
      temperature: Array(5).fill(0).map((_, i) => 
        lastPoint.temperature + (0.1 * (i + 1))),
      landUse: Array(5).fill(0).map((_, i) => ({
        residential: lastPoint.residential * Math.pow(1 + growthRate, i + 1),
        commercial: lastPoint.commercial * Math.pow(1 + growthRate, i + 1),
        greenSpace: lastPoint.greenSpace * Math.pow(1 - growthRate/2, i + 1)
      }))
    };
  };

  const fetchAndAnalyzeData = async (dataType, locations, coordinatePairs) => {
    setLoading(true);
    setError(null);
    try {
      let weatherData = [];
      if (dataType === 'ville' || dataType === 'quartier') {
        weatherData = await Promise.all(
          locations
            .filter(location => location.trim())
            .map(location => fetchWeatherData(location))
        );
      } else if (dataType === 'coordonnées') {
        weatherData = await Promise.all(
          coordinatePairs
            .filter(pair => pair.latitude && pair.longitude)
            .map(pair => fetchWeatherDataByCoords(pair.latitude, pair.longitude))
        );
      }

      setTrendData(weatherData.map(data => ({
        city: data.city,
        temperature: data.temperature,
        humidity: data.humidity,
        date: data.date
      })));

      setPieChartData(weatherData.map(data => ({
        name: data.city,
        value: data.temperature
      })));

      // Calculer les métriques et analyses
      const metrics = weatherData.map(data => calculateUrbanMetrics(data));
      const trends = analyzeTrends(weatherData);
      const forecastData = generateForecasts(weatherData);

      setUrbanMetrics(metrics);
      setAnalysisResults(trends);
      setForecasts(forecastData);
      setIsModalOpen(false);
    } catch (err) {
      setError('Erreur lors de la récupération ou de l\'analyse des données.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <div className="lg:pl-64 pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center p-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#33b1e1] to-[#8bc540] text-white rounded-lg hover:opacity-80 transition-colors"
            >
              <Menu className="w-4 h-4" />
              Ajouter des données
            </button>
          </div>

          {/* Graphiques des tendances */}
          <div className="grid lg:grid-cols-2 gap-6 p-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Tendances Temporelles</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="city" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Température" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humidité" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Distribution des Températures</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}°C`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Métriques urbaines */}
            {urbanMetrics && (
              <div className="bg-white rounded-lg shadow-sm p-6 col-span-2">
                <h3 className="text-lg font-semibold mb-4">Métriques Urbaines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(urbanMetrics[0]).map(([key, value]) => (
                    <div key={key} className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">{key}</h4>
                      <p className="text-2xl font-bold mt-2">{value.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prévisions */}
            {forecasts && (
              <div className="bg-white rounded-lg shadow-sm p-6 col-span-2">
                <h3 className="text-lg font-semibold mb-4">Prévisions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Population</h4>
                    <div className="mt-2">
                      {forecasts.population.map((value, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>Année {index + 1}</span>
                          <span className="font-bold">{Math.round(value).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Température</h4>
                    <div className="mt-2">
                      {forecasts.temperature.map((value, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>Année {index + 1}</span>
                          <span className="font-bold">{value.toFixed(1)}°C</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Utilisation des Sols</h4>
                    <div className="mt-2">
                      {forecasts.landUse.map((data, index) => (
                        <div key={index} className="mb-2">
                          <div className="text-sm font-medium">Année {index + 1}</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Résidentiel: {Math.round(data.residential)}%</div>
                            <div>Commercial: {Math.round(data.commercial)}%</div>
                            <div>Espaces verts: {Math.round(data.greenSpace)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Graphique d'analyse des tendances */}
            {analysisResults && (
              <>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Évolution de la Température</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analysisResults.temperatureTrend.map((value, index) => ({
                        time: `Point ${index + 1}`,
                        variation: value
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="variation" stroke="#8884d8" name="Variation (%)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Évolution de la Population</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analysisResults.populationGrowth.map((value, index) => ({
                        time: `Point ${index + 1}`,
                        croissance: value
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="croissance" fill="#82ca9d" name="Croissance (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
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