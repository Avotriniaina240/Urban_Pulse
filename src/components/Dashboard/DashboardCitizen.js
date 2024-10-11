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

  return (
    <div className="citizen-dashboard-home">
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
                    <p><strong>Météo à {cityName} :</strong> {weatherData.main.temp}°C</p> 
                    <p><br/> <strong>Qualité de l'air :</strong> {weatherData.weather[0].description}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Aperçu des rapports soumis par l'utilisateur */}
        <div className={`user-reports ${loading ? '' : 'animate'}`}>
          <h2>Mes Rapports</h2>
          {userReports.length > 0 ? (
            <ul>
              {userReports.slice(0, 5).map((report) => (
                <li key={report.id}>{report.title} - {report.status}</li>
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
            <Link to="/submit-report" className="button">Soumettre un Rapport</Link>
            <Link to="/view-reports" className="button">Voir Mes Rapports</Link>
            <Link to="/community-forum" className="button">Forum Communautaire</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCitizen;
