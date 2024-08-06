
import React, { useState } from 'react';
import { FaChartBar, FaFileAlt, FaPlug, FaMapMarkedAlt, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Bar/SidebarRA.css';

const SidebarRA = () => {
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
    <div className="sideRA">
      <ul>
        <li><FaChartBar /> Analyse des Données Urbaines</li>
        <li><FaFileAlt /> Rapports et Analyses</li>
        <li><FaPlug /> Intégrations Externes</li>
        <li><FaMapMarkedAlt /> Cartographie et Géolocalisation</li>
        <li>
        <div className="sidebar-logout-RA">
            <FaSignOutAlt /> {/* Icône sans effet */}
            <span onClick={handleLogoutClick} className="logout-text-RA"><strong>Déconnexion</strong></span> {/* Texte cliquable */}
            {showLogoutForm && (
              <div className="logout-form-RA">
                <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                <button className='deco-RA' onClick={handleLogout}>Déconnexion</button>
                <button className='anu-RA' onClick={() => setShowLogoutForm(false)}>Annuler</button>
              </div>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default SidebarRA;
