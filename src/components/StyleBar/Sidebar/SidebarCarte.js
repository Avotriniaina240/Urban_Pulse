import React, { useState, useEffect, useRef } from 'react';
import { FaTachometerAlt, FaChartBar, FaUsers, FaFileAlt, FaBalanceScale, FaMapMarkedAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link, Route, Routes } from 'react-router-dom';
import '../../styles/Bar/SidebarCarte.css';
import RegisterAdmin from '../../Authentification/RegisterAdmin'; // Assurez-vous que le chemin est correct

const SidebarCarte = () => {
  const [showLogoutForm, setShowLogoutForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogoutClick = () => {
    setShowLogoutForm(!showLogoutForm);
  };

  const handleUserMenuClick = (event) => {
    event.preventDefault();
    setShowUserMenu(!showUserMenu);
  };

  const handleMouseLeave = (event) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.relatedTarget)) {
      setShowUserMenu(false);
    }
  };

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
    <div className="sideCarte">
      {/* <div>
     <img src="../image/pul.png" alt="Urban Pulse Logo" className="sidebar-logo" 
        width={10} height={65}  />
      </div>*/}
      <ul>
        <li><Link to="/vue-ensemble"><FaTachometerAlt /> Vue d'Ensemble</Link></li>
        <li><Link to="/urban-analysis"><FaChartBar /> Analyse des Données Urbaines</Link></li>
        <li><Link to="/home-reports"><FaFileAlt /> Rapports et Analyses</Link></li>
        <li><Link to="/comparison"><FaBalanceScale /> Comparaison</Link></li>
        <li><Link to="/map"><FaMapMarkedAlt /> Cartographie et Géolocalisation</Link></li>
        <li
          ref={userMenuRef}
          onMouseLeave={handleMouseLeave}
        >
          <a href="/gestion-user" onClick={handleUserMenuClick}>
            <FaUsers /> Gestion des Utilisateurs
          </a>
          {showUserMenu && (
            <ul className="submenu-Carte">
              <li><Link to="/register-admin">Nouveau Utilisateur</Link></li>
              <li><Link to="/gestion-user">Gérer Utilisateur</Link></li>
            </ul>
          )}
        </li>
        <li>
          <div className="sidebar-logout-Carte">
            <FaSignOutAlt />
            <span onClick={handleLogoutClick} className="logout-text-Carte"><strong>Déconnexion</strong></span>
          </div>
        </li>
      </ul>

      <Routes>
        <Route path="/nouveau-utilisateur" element={<RegisterAdmin />} />
      </Routes>
    </div>
  );
};

export default SidebarCarte;