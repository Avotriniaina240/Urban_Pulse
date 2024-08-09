
import React, { useState } from 'react';
import { FaChartBar, FaFileAlt, FaPlug, FaMapMarkedAlt, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Bar/SidebarCitizen.css';

const SidebarCitizen = () => {
  const [showLogoutForm, setShowLogoutForm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutForm(!showLogoutForm);
  };

  const handleLogout = () => {
    // Logique de déconnexion
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirection vers la page de connexion
  };

  return (
    <div className="sideCitizen">
    {/* <div>
     <img src="../image/pul.png" alt="Urban Pulse Logo" className="sidebar-logo" 
        width={10} height={65}  />
      </div>*/}
      <ul>
        <li><FaChartBar /> Analyse des Données Urbaines</li>
        <li><FaFileAlt /> Rapports et Analyses</li>
        <li><FaPlug /> Intégrations Externes</li>
        <li><FaMapMarkedAlt /> Cartographie et Géolocalisation</li>
        <li>
        <div className="sidebar-logout-Citizen">
            <FaSignOutAlt /> {/* Icône sans effet */}
            <span onClick={handleLogoutClick} className="logout-text-Citizen"><strong>Déconnexion</strong></span> {/* Texte cliquable */}
            {showLogoutForm && (
              <div className="logout-form-Citizen">
                <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                <button className='deco-Citizen' onClick={handleLogout}>Déconnexion</button>
                <button className='anu-Citizen' onClick={() => setShowLogoutForm(false)}>Annuler</button>
              </div>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default SidebarCitizen;
