import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import '../styles/ATS/Reports.css';

const Reports = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Simuler l'envoi des données
    console.log('Signalement soumis:', { description, location, image });
    alert('Signalement soumis avec succès');
    // Réinitialiser le formulaire après la soumission
    setDescription('');
    setLocation('');
    setImage(null);
  };

  return (
    <div>
      <Navbar/>
      <Sidebar/>
      <div className="home-container">
        <div className="global-border">
          <div className="buttons-container">
            <Link to="/reports">
              <button className="home-button">Faire une Plainte</button>
            </Link>
            <Link to="/reports-liste">
              <button className="home-button">Voir la Liste des Plaintes</button>
            </Link>
            <Link to="/manage-reports">
              <button className="home-button">Gérer les Plaintes</button>
            </Link>
          </div>
        </div>
      </div>
        <form onSubmit={handleSubmit} className="report-form">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez le problème"
            required
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Localisation"
            required
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button type="submit">Soumettre</button>
        </form>
      </div>
  );
};

export default Reports;
