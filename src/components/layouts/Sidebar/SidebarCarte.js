import React, { useState, useEffect, useRef } from 'react';
import { FaTachometerAlt, FaChartBar, FaUsers, FaFileAlt, FaBalanceScale, FaChartLine, FaMapMarkedAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../styles/Bar/SideCss/SidebarCarte.css';
import RegisterAdminPage from '../../../pages/RegisterAdminPage';
import AuthService from '../../../services/authService';

const SidebarCarte = () => {
  const { t } = useTranslation();
  const [showLogoutForm, setShowLogoutForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showComplaintMenu, setShowComplaintMenu] = useState(false);
  const [userRole, setUserRole] = useState('');
  const userMenuRef = useRef(null);
  const complaintMenuRef = useRef(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        console.log('User data from AuthService:', user);
        if (user && user.role) {
          setUserRole(user.role);
          localStorage.setItem('userRole', user.role);
          console.log('Role set in localStorage:', user.role);
        } else {
          console.log('No user data or role found');
          const storedRole = localStorage.getItem('userRole');
          if (storedRole) {
            setUserRole(storedRole);
            console.log('Role retrieved from localStorage:', storedRole);
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    console.log('userRole state updated:', userRole);
  }, [userRole]);

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

  console.log('Rendering SidebarCarte component. userRole:', userRole);

  return (
    <div className="sideCarte">
      <ul>
        {userRole === 'admin' && (
          <li><Link to="/vue-ensemble"><FaTachometerAlt /> {t('overview')}</Link></li>
        )}
        <li><Link to="/urban-analysis"><FaChartBar /> {t('urban_analysis')}</Link></li>
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
              {userRole === 'admin' && (
                <>
                  <li><Link to="/manage-reports">{t('manage_complaints')}</Link></li>
                  <li><Link to="/analyze-reports">{t('analyze_complaints')}</Link></li>
                </>
              )}
            </ul>
          )}
        </li>
        <li><Link to="/comparison"><FaBalanceScale /> {t('comparison')}</Link></li>
        <li><Link to="/historique-prediction"><FaChartLine /> {t('historical_data')}</Link></li>
        <li><Link to="/map"><FaMapMarkedAlt /> {t('mapping')}</Link></li>
        {(userRole === 'urbaniste' || userRole === 'citoyen') && (
          <li>
            <Link to="/user-specific-route">{t('user_specific_link')}</Link>
          </li>
        )}
        {userRole === 'admin' && (
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
        )}
        <li>
          <div className="sidebar-logout-Carte" onClick={handleLogoutClick}>
            <FaSignOutAlt />
            <span className="logout-text-Carte"><strong>{t('logout')}</strong></span>
          </div>
        </li>
      </ul>

      <Routes>
        <Route path="/nouveau-utilisateur" element={<RegisterAdminPage />} />
      </Routes>
    </div>
  );
};

export default SidebarCarte;
