import React, { useState } from 'react';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import ModalEntreeDonnees from './ModalEntreeDonnees';
import GraphiquesUrbains from './GraphiquesUrbains';
import { fetchWeatherData, fetchWeatherDataByCoords } from './serviceMeteo';
import '../styles/Analyse/UrbanAnalysis.css';

const UrbanAnalysis = () => {
    const [trendData, setTrendData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (dataType, locations, coordinatePairs) => {
        setLoading(true);
        setError(null);
        try {
            let weatherData = [];

            if (dataType === 'ville' || dataType === 'quartier') {
                const locationList = locations.filter(location => location.trim()).map(location => location.trim());
                weatherData = await Promise.all(locationList.map(location => fetchWeatherData(location)));
            } else if (dataType === 'coordonnées') {
                const weatherDataPromises = coordinatePairs
                    .filter(pair => pair.latitude && pair.longitude)
                    .map(pair => fetchWeatherDataByCoords(pair.latitude, pair.longitude));
                weatherData = await Promise.all(weatherDataPromises);
            }

            const newTrendData = weatherData.map((data) => ({
                city: data.city,
                temperature: data.temperature,
                humidity: data.humidity,
                date: data.date
            }));

            const newPieChartData = weatherData.map(data => ({
                name: data.city,
                value: data.temperature
            }));

            setTrendData(newTrendData);
            setPieChartData(newPieChartData);
            setIsModalOpen(false);
        } catch (err) {
            setError('Les informations saisies ne sont pas correctes.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <div className="main-urban">
                <Sidebar />
                <div className="content-urban">
                    <div className="header">
                        <h1 className='urb-h1'>Analyse des Données Urbaines</h1>
                    </div>
                    <button className='btn-open-modal' onClick={() => setIsModalOpen(true)}>
                        Ouvrir le Menu
                    </button>
                    <ModalEntreeDonnees 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)}
                        onFetchData={fetchData}
                        loading={loading}
                        error={error}
                    />
                    <GraphiquesUrbains 
                        trendData={trendData}
                        pieChartData={pieChartData}
                    />
                </div>
            </div>
        </div>
    );
};

export default UrbanAnalysis;