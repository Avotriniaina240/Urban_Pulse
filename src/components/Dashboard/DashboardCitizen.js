import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';
import { 
  Cloud, 
  Sun, 
  Wind,
  FileText,
  Users,
  MessageSquare,
  AlertCircle,
  BarChart3
} from 'lucide-react';

const DashboardCitizen = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userReports, setUserReports] = useState([]); 
  const [progress, setProgress] = useState(0);
  const [animationLoaded, setAnimationLoaded] = useState(false);

  useEffect(() => {
    // Animation séquentielle au chargement
    setTimeout(() => setAnimationLoaded(true), 100);
  }, []);

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
  }, []);

  const getAirQualityIcon = (airQualityIndex) => {
    if (airQualityIndex <= 50) return <Sun className="w-6 h-6 text-yellow-500" />;
    if (airQualityIndex <= 100) return <Cloud className="w-6 h-6 text-gray-500" />;
    return <Wind className="w-6 h-6 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />
      <Sidebar />
      
      <div className="pt-16 lg:ml-64">
        <div className="p-6 lg:p-8">
          {loading && (
            <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out animate-pulse" 
                   style={{ width: `${progress}%` }}></div>
            </div>
          )}

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 ${animationLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {/* Weather Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-500 hover:-translate-y-2 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3">
                    <Sun className="w-4 h-4 text-white" />
                  </div>
                  Météo
                </h3>
                {weatherData ? (
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                        alt={weatherData.weather[0].description}
                        className="w-16 h-16 drop-shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {weatherData.main.temp}°C
                      </p>
                      <p className="text-gray-600 font-medium">{cityName}</p>
                      <p className="text-sm text-gray-500">
                        {weatherData.weather[0].description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse flex space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { 
                    title: 'Soumettre un Rapport', 
                    icon: <AlertCircle className="w-8 h-8" />, 
                    link: '/submit-report', 
                    gradient: 'from-green-400 to-emerald-500' 
                  },
                  { 
                    title: 'Mes Rapports', 
                    icon: <FileText className="w-8 h-8" />, 
                    link: '/view-reports', 
                    gradient: 'from-blue-400 to-cyan-500' 
                  },
                  { 
                    title: 'Forum Communautaire', 
                    icon: <MessageSquare className="w-8 h-8" />, 
                    link: '/community-forum', 
                    gradient: 'from-purple-400 to-pink-500' 
                  }
                ].map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 group flex flex-col items-center justify-center`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${action.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300 mb-4`}>
                        <span className="text-white">{action.icon}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 text-center group-hover:text-gray-700 transition-colors">
                        {action.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className={`mt-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-700 delay-200 ${animationLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} group`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                Projets en Cours
              </h3>
              <div className="grid gap-4">
                {[
                  'Rénovation du quartier Nord',
                  'Aménagement des espaces verts',
                  'Réhabilitation des infrastructures de transport'
                ].map((project, index) => (
                  <div key={index} className="flex items-center p-4 bg-gradient-to-r from-gray-50/80 to-white/80 rounded-xl hover:from-blue-50/80 hover:to-purple-50/80 transition-all duration-300 hover:shadow-md hover:scale-[1.02] group/item">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mr-4 group-hover/item:animate-pulse shadow-lg"></div>
                    <span className="text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors">{project}</span>
                  </div>
                ))}
              </div>
              <Link to="/urban-analysis" className="mt-6 inline-flex items-center text-sm bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover:from-green-700 hover:to-emerald-700 font-semibold transition-all duration-300 hover:scale-105">
                Voir l'analyse urbaine complète →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCitizen;