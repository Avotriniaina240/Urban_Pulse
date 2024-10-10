import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Importez axios pour les requêtes HTTP
import '../styles/Dash/UrbanistDashboard.css';

const AdminDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState(''); // État pour le nom de la ville
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userReports, setUserReports] = useState([]); // Pour stocker les rapports des utilisateurs
  const [projects, setProjects] = useState([]); // Pour stocker les projets en cours

  useEffect(() => {
    const fetchWeather = (latitude, longitude) => {
      const apiKey = '13c8b873a51de1239ad5606887a1565e';
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=fr&appid=${apiKey}`;

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
      const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`;

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
    
    };

    const fetchProjects = () => {
      // Remplacez cette URL par celle de votre API pour récupérer les projets
      axios.get('/api/projects') 
        .then((response) => {
          setProjects(response.data);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des projets :", error);
        });
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
    fetchProjects();
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
    <div className="admin-dashboard-home">
      <Navbar />
      <Sidebar />
      <div className="dashboard-content">
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
          {projects.length > 0 ? (
            <ul>
              {projects.slice(0, 5).map((project) => (
                <li key={project.id}>{project.name}</li>
              ))}
            </ul>
          ) : (
            <p></p>
          )}
        </div>

        {/* Liens vers d'autres fonctionnalités */}
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
}

export default AdminDashboard;
