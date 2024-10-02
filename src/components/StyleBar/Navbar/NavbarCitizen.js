import React, { useState, useEffect, useRef } from 'react';
import { FaHome, FaComment, FaBell, FaEllipsisH } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/Bar/NavCss/Navbar.css';
import SettingsPanel from '../../Parametres/SettingsPannel';

const NavbarCitizen = ({ onSearchChange }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const settingsRef = useRef(null); // Référence pour le panneau de paramètres
  const settingsButtonRef = useRef(null); // Référence pour le bouton de paramètres

  // Fonction pour récupérer et afficher les notifications
  const loadAndDisplayNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications');
      const data = await response.json();
      setNotifications(data);

      // Afficher les notifications
      data.forEach((notification) => {
        if (notification.type === 'success') {
          toast.success(notification.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (notification.type === 'error') {
          toast.error(notification.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        // Ajoutez d'autres types de notifications si nécessaire
      });
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  const handleNotification = () => {
    loadAndDisplayNotifications();
  };

  const toggleSettings = () => {
    setIsSettingsOpen(prevState => !prevState); // Inverse l'état
  };

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

    // Ajouter l'écouteur d'événement lors du montage
    document.addEventListener('mousedown', handleClickOutside);

    // Nettoyer l'écouteur d'événement lors du démontage
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsRef, settingsButtonRef]); // Ajout des dépendances

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <span className="logo-letter">U</span>
        <span className="logo-text">Urban Pulse</span>
      </div>
      <div className="navbar-links">
        <a href="admin-dashboard" title="Dashboard"><FaHome /></a>
        <a href="forum-page" title="Commentaires et Feedback"><FaComment /></a>
        <a href="#notification" title="Notification" onClick={handleNotification}>
          <FaBell />
        </a>
        <div 
          ref={settingsButtonRef} // Associer la référence à l'élément div
          title="Paramètres et personnalisation"
          onClick={toggleSettings}
          style={{ display: 'inline-block', cursor: 'pointer', color: '#000', marginLeft: '15px' }}
        >
          <FaEllipsisH />
        </div>
      </div>
      <ToastContainer />
      {/* Affichage du panneau de paramètres avec animation et référence */}
      {isSettingsOpen && (
        <div ref={settingsRef} style={{ position: 'absolute', top: '60px', right: '20px' }}>
          <SettingsPanel onClose={toggleSettings} />
        </div>
      )}
    </div>
  );
};

export default NavbarCitizen;
