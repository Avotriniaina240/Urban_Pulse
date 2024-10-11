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
  const [userReports, setUserReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [progress, setProgress] = useState(0); // Ajout de l'état pour la barre de progression

  useEffect(() => {
    const fetchWeather = (latitude, longitude) => {
      const weatherUrl = `${process.env.REACT_APP_WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&units=metric&lang=fr&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;

      axios
        .get(weatherUrl)
        .then((response) => {
          setWeatherData(response.data);
          setLoading(false);
          setProgress(100); // Remplir la barre de progression à 100% une fois terminé
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données météo :", error);
          setError("Impossible de récupérer les données météo");
          setLoading(false);
          setProgress(100); // Remplir la barre à 100% même en cas d'erreur
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
      // Simulation du chargement des rapports
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
              </div>
            )
          )}
        </div>

        {/* Aperçu des projets en cours */}
        <div className={`projects-overview ${loading ? '' : 'animate'}`}>
          <h2>Projets en Cours</h2>
          {projects.length > 0 ? (
            <ul>
              {projects.slice(0, 5).map((project) => (
                <li key={project.id}>{project.name}</li>
              ))}
            </ul>
          ) : (
            <p>Aucun projet en cours</p>
          )}
        </div>

        {/* Accès rapide */}
        <div className={`quick-access ${loading ? '' : 'animate'}`}>
          <h2>Accès Rapide</h2>
          <div className="access-buttons">
            <Link to="/user-management" className="button">Gestion des Utilisateurs</Link>
            <Link to="/report-management" className="button">Gestion des Rapports</Link>
            <Link to="/project-management" className="button">Gestion des Projets</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
