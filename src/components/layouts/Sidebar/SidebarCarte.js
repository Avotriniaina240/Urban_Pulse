import React, { useState, useEffect, useRef } from 'react';
import { FaTachometerAlt, FaChartBar, FaUsers, FaFileAlt, FaBalanceScale, FaChartLine, FaMapMarkedAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../styles/Bar/SideCss/SidebarCarte.css';
import RegisterAdminPage from '../../../pages/RegisterAdminPage';
import AuthService from '../../../services/authService';

const SidebarCarte = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showComplaintMenu, setShowComplaintMenu] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [activePath, setActivePath] = useState('');
  const userMenuRef = useRef(null);
  const complaintMenuRef = useRef(null);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user && user.role) {
          setUserRole(user.role);
          localStorage.setItem('userRole', user.role);
        } else {
          const storedRole = localStorage.getItem('userRole');
          if (storedRole) {
            setUserRole(storedRole);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle utilisateur:', error);
      }
    };

    fetchUserRole();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      setUserRole('');
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
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

  const isActive = (path) => {
    return activePath === path ? 'active' : '';
  };

  return (
    <div className="sideCarte">
      <ul>
        {userRole === 'admin' && (
          <li className={isActive('/vue-ensemble')}><Link to="/vue-ensemble"><FaTachometerAlt /> {t('overview')}</Link></li>
        )}
        <li className={isActive('/urban-analysis')}><Link to="/urban-analysis"><FaChartBar /> {t('urban_analysis')}</Link></li>
        <li
          ref={complaintMenuRef}
          onMouseLeave={handleComplaintMouseLeave}
          className={isActive('/reports') || isActive('/reports-liste') || isActive('/manage-reports') || isActive('/analyze-reports') ? 'active' : ''}
        >
          <a onClick={handleComplaintMenuClick}>
            <FaFileAlt /> {t('reports_analysis')}
          </a>
          {showComplaintMenu && (
            <ul className="submenu-Carte">
              <li className={isActive('/reports')}><Link to="/reports">{t('file_complaint')}</Link></li>
              <li className={isActive('/reports-liste')}><Link to="/reports-liste">{t('complaint_list')}</Link></li>
              {userRole === 'admin' && (
                <>
                  <li className={isActive('/manage-reports')}><Link to="/manage-reports">{t('manage_complaints')}</Link></li>
                  <li className={isActive('/analyze-reports')}><Link to="/analyze-reports">{t('analyze_complaints')}</Link></li>
                </>
              )}
            </ul>
          )}
        </li>
        <li className={isActive('/comparison')}><Link to="/comparison"><FaBalanceScale /> {t('comparison')}</Link></li>
        <li className={isActive('/historique-prediction')}><Link to="/historique-prediction"><FaChartLine /> {t('historical_data')}</Link></li>
        <li className={isActive('/map')}><Link to="/map"><FaMapMarkedAlt /> {t('mapping')}</Link></li>
        {(userRole === 'urbaniste' || userRole === 'citoyen') && (
          <li className={isActive('/user-specific-route')}>
            <Link to="/user-specific-route">{t('user_specific_link')}</Link>
          </li>
        )}
        {userRole === 'admin' && (
          <li
            ref={userMenuRef}
            onMouseLeave={handleMouseLeave}
            className={isActive('/gestion-user') || isActive('/register-admin') ? 'active' : ''}
          >
            <a href="/gestion-user" onClick={handleUserMenuClick}>
              <FaUsers /> {t('user_management')}
            </a>
            {showUserMenu && (
              <ul className="submenu-Carte">
                <li className={isActive('/register-admin')}><Link to="/register-admin">{t('new_user')}</Link></li>
                <li className={isActive('/gestion-user')}><Link to="/gestion-user">{t('manage_user')}</Link></li>
              </ul>
            )}
          </li>
        )}
        <li>
          <div className="sidebar-logout-Carte" onClick={handleLogout}>
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