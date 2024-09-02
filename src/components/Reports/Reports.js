import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/SidebarCarte';
import { toast } from 'react-toastify'; // Importer la fonction toast
import '../styles/ATS/Reports.css';

const Reports = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('pending'); // Valeur par défaut pour le statut

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('description', description);
    formData.append('location', location);
    formData.append('status', status); // Ajouter le champ status
    if (image) {
      formData.append('image', image);
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        toast.success('Signalement soumis avec succès !');
        setDescription('');
        setLocation('');
        setImage(null);
        setStatus('pending'); // Réinitialiser le statut
      } else {
        const error = await response.text(); // Lire comme texte pour éviter les erreurs de parsing JSON
        console.error('Erreur lors de la soumission des données:', error);
        toast.error('Erreur lors de la soumission des données: ' + error);
      }
    } catch (error) {
      console.error('Erreur de réseau:', error);
      toast.error('Erreur de réseau');
    }
  };
  

  return (
    <div>
      <Navbar />
      <Sidebar />
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
      <div className="report-form-wrapper">
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
    </div>
  );
};

export default Reports;
