import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dash/UrbanistDashboard.css';

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
    if (airQualityIndex <= 50) {
      return '🌞 Bon'; 
    } else if (airQualityIndex <= 100) {
      return '☁️ Moyen'; 
    } else {
      return '💨 Mauvais'; 
    }
  };

  return (
    <div className="admin-dashboard-home">
      <Navbar />
      <Sidebar />
      <div className="dashboard-content">
        {/* Barre de progression */}
        {loading && (
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        )}

<div className={`key-indicators ${loading ? '' : 'animate'}`}>
          <h2>Indicateurs Clés</h2>
          {loading ? (
            <p>Chargement des données météo...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            weatherData && (
              <div className="indicators-container">
                <div className="indicator">
                  <div className="indicator-content">
                    <img 
                      src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
                      alt={weatherData.weather[0].description} 
                      className="weather-icon" 
                    />
                    <p><strong>Météo à {cityName} :</strong> {weatherData.main.temp}°C, {weatherData.weather[0].description}</p>
                  </div>
                </div>
                <div className="indicator">
                  <div className="indicator-content">
                    <p><strong>Qualité de l'air :</strong> {getAirQualityIcon(weatherData.main.aqi)}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Aperçu des projets en cours */}
        <div className={`projects-overview ${loading ? '' : 'animate'}`}>
          <h2>Projets en Cours</h2>
          <ul>
            <li>Rénovation du quartier Nord</li>
            <li>Aménagement des espaces verts</li>
            <li>Réhabilitation des infrastructures de transport</li>
          </ul>
          <Link to="/urban-analysis" className="dashboard-link">
            Voir l'analyse urbaine complète
          </Link>
        </div>

        {/* Accès rapide */}
        <div className={`quick-access ${loading ? '' : 'animate'}`}>
          <h2>Accès Rapide</h2>
          <div className="access-buttons">
            <Link to="/gestion-user" className="button">Gestion des Utilisateurs</Link>
            <Link to="/manage-reports" className="button">Gestion des Rapports</Link>
            <Link to="/analyze-reports" className="button">Analyse des Projets</Link>
          </div>
        </div>

                {/* Derniers rapports soumis */}
                <div className={`latest-reports ${loading ? '' : 'animate'}`}>
          <h2>Derniers Rapports des Citoyens</h2>
          <ul>
            <li>Dégradation de la chaussée - Quartier Sud</li>
            <li>Problèmes de circulation - Centre-ville</li>
            <li>Demande d'aménagement d'un parc - Quartier Est</li>
          </ul>
          <Link to="/reports-liste" className="dashboard-link">
            Voir tous les rapports
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
