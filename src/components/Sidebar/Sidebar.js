import React, { useState, useEffect, useRef } from 'react';
import { FaTachometerAlt, FaChartBar, FaUsers, FaFileAlt, FaPlug, FaMapMarkedAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link, Route, Routes } from 'react-router-dom';
import '../styles/Bar/Sidebar.css';
import RegisterAdmin from '../Authentification/RegisterAdmin'; // Assurez-vous que le chemin est correct

const Sidebar = () => {
  const [showLogoutForm, setShowLogoutForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogoutClick = () => {
    setShowLogoutForm(!showLogoutForm);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
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
    <div className="side">
      <ul>
        <li><Link to="/vue-ensemble"><FaTachometerAlt /> Vue d'Ensemble</Link></li>
        <li><Link to="/urban-analysis"><FaChartBar /> Analyse des Données Urbaines</Link></li>
        <li><FaFileAlt /> Rapports et Analyses</li>
        <li><FaPlug /> Intégrations Externes</li>
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
        <li>
          <div className="sidebar-logout">
            <FaSignOutAlt />
            <span onClick={handleLogoutClick} className="logout-text"><strong>Déconnexion</strong></span>
            {showLogoutForm && (
              <div className="logout-form">
                <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                <button className='deco' onClick={handleLogout}>Déconnexion</button>
                <button className='anu' onClick={() => setShowLogoutForm(false)}>Annuler</button>
              </div>
            )}
          </div>
        </li>
      </ul>

      <Routes>
        <Route path="/nouveau-utilisateur" element={<RegisterAdmin />} />
      </Routes>
    </div>
  );
};

export default Sidebar;
