import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';
import { 
  MapPin,
  FileText,
  Map,
  BarChart,
  AlertCircle,
  Cloud,
  Users
} from 'lucide-react';

const UrbanistDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchWeatherData = (latitude, longitude) => {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=fr&appid=${apiKey}`;

      setProgress(40);

      axios
        .get(weatherUrl)
        .then((response) => {
          setWeatherData(response.data);
          setLoading(false);
          setProgress(100);
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération des données météo :", err);
          setError("Impossible de récupérer les données météo");
          setLoading(false);
          setProgress(100);
        });

      const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`;

      axios
        .get(reverseGeocodeUrl)
        .then((response) => {
          setCityName(response.data.address?.city || "Ville inconnue");
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération du nom de la ville :", err);
          setCityName("Ville inconnue");
        });
    };

    if (navigator.geolocation) {
      setProgress(20);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (err) => {
          console.error("Erreur de géolocalisation :", err);
          setError("Impossible de récupérer la géolocalisation");
          setLoading(false);
        }
      );
    } else {
      setError("La géolocalisation n'est pas supportée par ce navigateur");
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      
      <div className="pt-16 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Loading Progress Bar */}
          {loading && (
            <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
              <div 
                className="h-2 bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord Urbaniste</h1>
            <p className="text-gray-600 mt-2">Bienvenue, voici les dernières informations et projets pour votre ville.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Weather Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Météo</h3>
              {weatherData ? (
                <div className="flex items-center space-x-4">
                  <img 
                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                    className="w-16 h-16"
                  />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {weatherData.main.temp}°C
                    </p>
                    <p className="text-gray-600">{cityName}</p>
                    <p className="text-sm text-gray-500">
                      {weatherData.weather[0].description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse flex space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Link
                  to="/map"
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <Map className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Carte Interactive</span>
                </Link>
                <Link
                  to="/reports-liste"
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-8 h-8 text-green-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Rapports Citoyens</span>
                </Link>
                <Link
                  to="/historique-prediction"
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <BarChart className="w-8 h-8 text-purple-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Données Historiques</span>
                </Link>
                <Link
                  to="/urban-analysis"
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <MapPin className="w-8 h-8 text-red-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Analyse Urbaine</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Projets en Cours</h3>
            <div className="grid gap-4">
              {[
                'Rénovation du quartier Nord',
                'Aménagement des espaces verts',
                'Réhabilitation des infrastructures de transport'
              ].map((project, index) => (
                <div 
                  key={index}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-4" />
                  <span className="text-gray-700">{project}</span>
                </div>
              ))}
            </div>
            <Link 
              to="/urban-analysis"
              className="mt-4 inline-flex items-center text-sm text-green-600 hover:text-green-700"
            >
              Voir l'analyse urbaine complète →
            </Link>
          </div>

          {/* Latest Reports */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Derniers Rapports des Citoyens
            </h3>
            <div className="space-y-4">
              {[
                'Dégradation de la chaussée - Quartier Sud',
                'Problèmes de circulation - Centre-ville',
                'Demande d\'aménagement d\'un parc - Quartier Est'
              ].map((report, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="text-gray-700">{report}</p>
                </div>
              ))}
            </div>
            <Link 
              to="/reports-liste"
              className="mt-4 inline-flex items-center text-sm text-green-600 hover:text-green-700"
            >
              Voir tous les rapports →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrbanistDashboard;