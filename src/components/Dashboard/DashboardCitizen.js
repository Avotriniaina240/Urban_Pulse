import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';

const DashboardCitizen = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userReports, setUserReports] = useState([]); 
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchWeather = (latitude, longitude) => {
      const weatherUrl = `${process.env.REACT_APP_WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&units=metric&lang=fr&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;

      axios
        .get(weatherUrl)
        .then((response) => {
          setWeatherData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données météo :", error);
          setError("Impossible de récupérer les données météo");
          setLoading(false);
        });

      // Utilisation de l'API de géocodage inversé
      const reverseGeocodeUrl = `${process.env.REACT_APP_GEOCODING_API_URL}?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`;

      axios
        .get(reverseGeocodeUrl)
        .then((response) => {
          if (response.data && response.data.address && response.data.address.city) {
            setCityName(response.data.address.city); // Récupérer le nom de la ville
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
      // Logique pour récupérer les rapports de l'utilisateur (à implémenter)
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
        }
      );
    } else {
      setError("La géolocalisation n'est pas supportée par ce navigateur");
      setLoading(false);
    }

    fetchReports();
  }, []);

  const getAirQualityIcon = (airQualityIndex) => {
    if (airQualityIndex <= 50) {
      return 'Bon'; // Vous pouvez ajouter une icône spécifique ici
    } else if (airQualityIndex <= 100) {
      return 'Moyen'; // Ajoutez une icône pour moyen
    } else {
      return 'Mauvais'; // Ajoutez une icône pour mauvais
    }
  };

  return (
    <div className="urbaniste-dashboard-home">
      <Navbar />
      <Sidebar />
      <div className="dashboard-content">
        {/* Barre de progression */}
        {loading && (
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        )}
        {/* Section des indicateurs clés */}
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
  
        {/* Accès rapide aux fonctionnalités */}
        <div className={`quick-access ${loading ? '' : 'animate'}`}>
          <h2>Accès Rapide</h2>
          <div className="access-buttons">
          <Link to="/submit-report" className="button">Soumettre un Rapport</Link>
            <Link to="/view-reports" className="button">Voir Mes Rapports</Link>
            <Link to="/community-forum" className="button">Forum Communautaire</Link>
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
}

export default DashboardCitizen;
