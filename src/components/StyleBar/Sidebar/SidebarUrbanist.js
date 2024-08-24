
import React, {  } from 'react';
import { FaChartBar, FaFileAlt, FaPlug, FaMapMarkedAlt, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/Bar/SideCss/SidebarUrbanist.css';

const SidebarUrbanist = () => {

  const handleLogout = () => {
    // Logique de déconnexion
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirection vers la page de connexion
  };

  return (
    <div className="sideUrbanist">
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
        <div className="sidebar-logout-Urbanist">
            <FaSignOutAlt /> {/* Icône sans effet */}
            <span onClick={handleLogout} className="logout-text-Urbanist"><strong>Déconnexion</strong></span> {/* Texte cliquable */}
        </div>
        </li>
      </ul>
    </div>
  );
};

export default SidebarUrbanist;
