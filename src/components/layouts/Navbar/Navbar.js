import React, { useState, useEffect, useRef } from 'react';
import { FaHome, FaComment, FaBell, FaEllipsisH } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/Bar/NavCss/Navbar.css';
import SettingsPanel from '../../Parametres/SettingsPannel';
import AuthService from '../../../services/authService'; // Importez votre service d'authentification

const Navbar = ({ onSearchChange }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userRole, setUserRole] = useState(''); // État pour stocker le rôle de l'utilisateur
  const settingsRef = useRef(null);
  const settingsButtonRef = useRef(null);

  // Fonction pour récupérer et afficher les notifications
  const loadAndDisplayNotifications = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_NOTIFICATIONS_API_URL);
      const data = await response.json();
      setNotifications(data);
      
      // ... le reste de votre code
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };
  
  const handleNotification = () => {
    loadAndDisplayNotifications();
  };

  const toggleSettings = () => {
    setIsSettingsOpen(prevState => !prevState);
  };

  // Récupérer le rôle de l'utilisateur
  const fetchUserRole = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user && user.role) {
        setUserRole(user.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  // Appel pour récupérer le rôle lorsque le composant est monté
  useEffect(() => {
    fetchUserRole();
  }, []);

  // Gérer le clic en dehors du panneau de paramètres
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingsRef.current &&
        settingsButtonRef.current &&
        !settingsRef.current.contains(event.target) &&
        !settingsButtonRef.current.contains(event.target)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsRef, settingsButtonRef]);

  // Déterminer le lien de tableau de bord en fonction du rôle
  const getDashboardLink = () => {
    switch (userRole) {
      case 'admin':
        return 'admin-dashboard';
      case 'citizen':
        return 'dashboard-citizen';
      case 'urbanist':
        return 'urbanist-dashboard';
      default:
        return 'dashboard'; // Lien par défaut si aucun rôle n'est trouvé
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <span className="logo-letter">Urban Pulse</span>
      </div>
      <div className="navbar-links">
        <a href={getDashboardLink()} title="Dashboard"><FaHome /></a>
        <a href="forum-page" title="Commentaires et Feedback"><FaComment /></a>
        <a href="#notification" title="Notification" onClick={handleNotification}>
          <FaBell />
        </a>
        <div 
          ref={settingsButtonRef}
          title="Paramètres et personnalisation"
          onClick={toggleSettings}
          style={{ display: 'inline-block', cursor: 'pointer', color: '#000', marginLeft: '15px' }}
        >
          <FaEllipsisH />
        </div>
      </div>
      <ToastContainer />
      {isSettingsOpen && (
        <div ref={settingsRef} style={{ position: 'absolute', top: '60px', right: '20px' }}>
          <SettingsPanel onClose={toggleSettings} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
