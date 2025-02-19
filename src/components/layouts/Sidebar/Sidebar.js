import React, { useState, useEffect, useRef } from 'react';
import { FaTachometerAlt, FaChartBar, FaUsers, FaFileAlt, FaBalanceScale, FaChartLine, FaMapMarkedAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link, Route, Routes } from 'react-router-dom';
import '../../styles/Bar/SideCss/Sidebar.css';
import RegisterAdminPage from '../../../pages/RegisterAdminPage';

const Sidebar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Fonction pour gérer le clic sur le menu utilisateur
  const handleUserMenuClick = (event) => {
    event.preventDefault();
    setShowUserMenu((prevShowUserMenu) => !prevShowUserMenu);
  };

  // Fonction pour gérer la sortie de la souris du menu utilisateur
  const handleMouseLeave = (event) => {
    // Vérifie si 'relatedTarget' est un noeud DOM valide
    if (!event.relatedTarget || !userMenuRef.current) return;

    // Si la souris quitte l'élément et qu'il n'est pas contenu dans 'userMenuRef', on cache le menu
    if (!userMenuRef.current.contains(event.relatedTarget)) {
      setShowUserMenu(false);
    }
  };

  // Utilisation d'un effet pour détecter les clics en dehors du menu utilisateur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="side">
      <ul>
        <li><Link to="/vue-ensemble"><FaTachometerAlt /> Vue d'Ensemble</Link></li>
        <li><Link to="/urban-analysis"><FaChartBar /> Analyse des Données Urbaines</Link></li>
        <li><Link to="/home-reports"><FaFileAlt /> Rapports et Analyses</Link></li>
        <li><Link to="/comparison"><FaBalanceScale /> Comparaison</Link></li>
        <li><Link to="/historique-prediction"><FaChartLine /> Données Historique et Prediction</Link></li>
        <li><Link to="/map"><FaMapMarkedAlt /> Cartographie et Géolocalisation</Link></li>
        <li
          ref={userMenuRef}
          onMouseLeave={handleMouseLeave}
        >
          <a href="/gestion-user" onClick={handleUserMenuClick}>
            <FaUsers /> Gestion des Utilisateurs
          </a>
          {showUserMenu && (
            <ul className="submenu">
              <li><Link to="/register-admin">Nouveau Utilisateur</Link></li>
              <li><Link to="/gestion-user">Gérer Utilisateur</Link></li>
            </ul>
          )}
        </li>
        
        {/* Déconnexion */}
        <li>
          <div className="sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt />
            <span className="logout-text"><strong>Déconnexion</strong></span>
          </div>
        </li>
      </ul>

      {/* Routes pour gérer la navigation */}
      <Routes>
        <Route path="/nouveau-utilisateur" element={<RegisterAdminPage />} />
      </Routes>
    </div>
  );
};

export default Sidebar;
