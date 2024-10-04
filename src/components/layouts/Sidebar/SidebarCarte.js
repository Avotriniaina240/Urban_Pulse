import React, { useState, useEffect, useRef } from 'react';
import { FaTachometerAlt, FaChartBar, FaUsers, FaFileAlt, FaBalanceScale, FaChartLine, FaMapMarkedAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Importer le hook useTranslation
import '../../styles/Bar/SideCss/SidebarCarte.css';
import RegisterAdminPage from '../../../pages/RegisterAdminPage';

const SidebarCarte = () => {
  const { t } = useTranslation(); // Utiliser le hook useTranslation
  const [showLogoutForm, setShowLogoutForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showComplaintMenu, setShowComplaintMenu] = useState(false); 
  const userMenuRef = useRef(null);
  const complaintMenuRef = useRef(null); 

  const handleLogoutClick = () => {
    setShowLogoutForm((prevShowLogoutForm) => !prevShowLogoutForm);
  };

  const handleUserMenuClick = (event) => {
    event.preventDefault();
    setShowUserMenu((prevShowUserMenu) => !prevShowUserMenu);
  };

  const handleComplaintMenuClick = (event) => {
    event.preventDefault();
    setShowComplaintMenu((prevShowComplaintMenu) => !prevShowComplaintMenu); 
  };

  const handleMouseLeave = (event) => {
    if (!event.relatedTarget || !userMenuRef.current) return;
    if (userMenuRef.current && event.relatedTarget instanceof Node && !userMenuRef.current.contains(event.relatedTarget)) {
      setShowUserMenu(false);
    }
  };

  const handleComplaintMouseLeave = (event) => {
    if (!event.relatedTarget || !complaintMenuRef.current) return;
    if (complaintMenuRef.current && event.relatedTarget instanceof Node && !complaintMenuRef.current.contains(event.relatedTarget)) {
      setShowComplaintMenu(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (complaintMenuRef.current && !complaintMenuRef.current.contains(event.target)) {
        setShowComplaintMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sideCarte">
      <ul>
        <li><Link to="/vue-ensemble"><FaTachometerAlt /> {t('overview')}</Link></li>
        <li><Link to="/urban-analysis"><FaChartBar /> {t('urban_analysis')}</Link></li>

        {/* Sous-menu pour Rapports et Analyses */}
        <li
          ref={complaintMenuRef}
          onMouseLeave={handleComplaintMouseLeave}
        >
          <a onClick={handleComplaintMenuClick}>
            <FaFileAlt /> {t('reports_analysis')}
          </a>
          {showComplaintMenu && (
            <ul className="submenu-Carte">
              <li><Link to="/reports">{t('file_complaint')}</Link></li>
              <li><Link to="/reports-liste">{t('complaint_list')}</Link></li>
              <li><Link to="/manage-reports">{t('manage_complaints')}</Link></li>
              <li><Link to="/analyze-reports">{t('analyze_complaints')}</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="/comparison"><FaBalanceScale /> {t('comparison')}</Link></li>
        <li><Link to="/historique-prediction"><FaChartLine /> {t('historical_data')}</Link></li>
        <li><Link to="/map"><FaMapMarkedAlt /> {t('mapping')}</Link></li>

        {/* Menu utilisateur */}
        <li
          ref={userMenuRef}
          onMouseLeave={handleMouseLeave}
        >
          <a href="/gestion-user" onClick={handleUserMenuClick}>
            <FaUsers /> {t('user_management')}
          </a>
          {showUserMenu && (
            <ul className="submenu-Carte">
              <li><Link to="/register-admin">{t('new_user')}</Link></li>
              <li><Link to="/gestion-user">{t('manage_user')}</Link></li>
            </ul>
          )}
        </li>

        {/* Déconnexion */}
        <li>
          <div className="sidebar-logout-Carte" onClick={handleLogoutClick}>
            <FaSignOutAlt />
            <span className="logout-text-Carte"><strong>{t('logout')}</strong></span>
          </div>
        </li>
      </ul>

      {/* Gestion des routes */}
      <Routes>
        <Route path="/nouveau-utilisateur" element={<RegisterAdminPage />} />
      </Routes>
    </div>
  );
};

export default SidebarCarte;
