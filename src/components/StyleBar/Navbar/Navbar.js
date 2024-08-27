import React from 'react';
import { FaHome, FaUser, FaComment, FaBell, FaCog } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/Bar/NavCss/Navbar.css';

// Fonction pour afficher les notifications de signalement
const handleNotification = () => {
  const notifications = [
    "Signalement : Comportement inapproprié détecté dans le forum.",
    "Signalement : Langage abusif signalé par plusieurs utilisateurs.",
    "Signalement : Spam suspecté dans les commentaires.",
    "Signalement : Contenu offensant détecté dans un post.",
    "Signalement : Tentative de phishing rapportée par un utilisateur."
  ];

  notifications.forEach((message, index) => {
    setTimeout(() => {
      toast.info(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }, index * 2000); // Affiche chaque notification avec un délai de 1 seconde entre elles
  });
};

const Navbar = ({ onSearchChange }) => {
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <span className="logo-letter">U</span>
        <span className="logo-text">Urban Pulse</span>
      </div>
      <div className="navbar-links">
        <a href="admin-dashboard" title="Dashboard"><FaHome /></a>
        <a href="Profile" title="Profil"><FaUser /></a>
        <a href="forum-page" title="Commentaires et Feedback"><FaComment /></a>
        <a href="#notification" title="Notification" onClick={handleNotification}>
          <FaBell />
        </a>
        <a href="#settings" title="Paramètres et personnalisation"><FaCog /></a>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Navbar;
