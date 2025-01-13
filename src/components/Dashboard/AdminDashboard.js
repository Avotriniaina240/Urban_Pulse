import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';
import { Link } from 'react-router-dom';
import { 
  Cloud, Sun, Wind, Users, FileText, 
  ChartBar, MapPin
} from 'lucide-react';

const AdminDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchWeather = (latitude, longitude) => {
      const weatherUrl = `${process.env.REACT_APP_WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&units=metric&lang=fr&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;

      axios
        .get(weatherUrl)
        .then((response) => {
          setWeatherData(response.data);
          setLoading(false);
          setProgress(100);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données météo :", error);
          setError("Impossible de récupérer les données météo");
          setLoading(false);
          setProgress(100);
        });

      const reverseGeocodeUrl = `${process.env.REACT_APP_GEOCODING_API_URL}?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`;

      axios
        .get(reverseGeocodeUrl)
        .then((response) => {
          if (response.data && response.data.address && response.data.address.city) {
            setCityName(response.data.address.city);
          } else {
            setCityName("Ville inconnue");
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération du nom de la ville :", error);
          setCityName("Ville inconnue");
        });
    };

    const fetchReports = () => {
      setTimeout(() => setProgress(40), 500);
    };

    const fetchProjects = () => {
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error("Erreur de géolocalisation :", error);
          setError("Impossible de récupérer la géolocalisation");
          setLoading(false);
          setProgress(100);
        }
      );
    } else {
      setError("La géolocalisation n'est pas supportée par ce navigateur");
      setLoading(false);
      setProgress(100);
    }

    fetchReports();
    fetchProjects();
  }, []);

  const getAirQualityIcon = (airQualityIndex) => {
    if (airQualityIndex <= 50) return <Sun className="text-yellow-500" />;
    if (airQualityIndex <= 100) return <Cloud className="text-gray-500" />;
    return <Wind className="text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      
      <div className="pt-16 lg:ml-64">
        <div className="p-6 lg:p-8">
          {loading && (
            <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
              <div className="h-2 bg-green-500 rounded-full transition-all duration-500" 
                   style={{ width: `${progress}%` }}></div>
            </div>
          )}

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
                    <p className="text-2xl font-bold text-gray-900">{weatherData.main.temp}°C</p>
                    <p className="text-gray-600">{cityName}</p>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse flex space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 lg:col-span-2">
              {[
                { title: 'Utilisateurs', icon: <Users className="w-6 h-6 text-green-500" />, value: '1,234' },
                { title: 'Rapports', icon: <FileText className="w-6 h-6 text-blue-500" />, value: '56' },
                { title: 'Projets', icon: <ChartBar className="w-6 h-6 text-green-500" />, value: '12' },
                { title: 'Zones', icon: <MapPin className="w-6 h-6 text-blue-500" />, value: '8' },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    {stat.icon}
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{stat.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Projets en Cours</h3>
            <div className="grid gap-4">
              {['Rénovation du quartier Nord', 'Aménagement des espaces verts', 'Réhabilitation des infrastructures de transport'].map((project, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-4"></div>
                  <span className="text-gray-700">{project}</span>
                </div>
              ))}
            </div>
            <Link to="/urban-analysis" className="mt-4 inline-flex items-center text-sm text-green-600 hover:text-green-700">
              Voir l'analyse urbaine complète →
            </Link>
          </div>

          {/* Quick Access */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Gestion des Utilisateurs', path: '/gestion-user' },
              { title: 'Gestion des Rapports', path: '/manage-reports' },
              { title: 'Analyse des Projets', path: '/analyze-reports' }
            ].map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="flex items-center justify-center px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium"
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Latest Reports */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Derniers Rapports des Citoyens</h3>
            <div className="space-y-4">
              {[
                'Dégradation de la chaussée - Quartier Sud',
                'Problèmes de circulation - Centre-ville',
                'Demande d\'aménagement d\'un parc - Quartier Est'
              ].map((report, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{report}</p>
                </div>
              ))}
            </div>
            <Link to="/reports-liste" className="mt-4 inline-flex items-center text-sm text-green-600 hover:text-green-700">
              Voir tous les rapports →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;