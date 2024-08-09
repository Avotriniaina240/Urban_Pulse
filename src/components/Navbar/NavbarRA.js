
import React from 'react';
import { FaHome, FaUser, FaComment, FaShieldAlt, FaCog } from 'react-icons/fa';
import '../styles/Bar/NavbarRA.css'; // Assure-toi que ce fichier CSS existe

const NavbarRA = () => {
  return (
    <div className="navbarRA">
      <img src="../image/45.jpg" alt="Urban Pulse Logo" className="navbar-logo" 
        width={100} height={64} />
      <h1>Urban Pulse</h1>
      <div className="navbar-search-RA">
        <input type="text" placeholder="Rechercher..." />
      </div>
      <div className="navbar-links-RA">
        <a href="dashboard-RA" title="Dashboard"><FaHome /></a>
        <a href="Profile" title="Profil"><FaUser /></a> 
        <a href= "#Comment" title = "Commentaires et Feedback"><FaComment /></a>
        <a href="#Security" title="Sécurité et Confidentialité"><FaShieldAlt /></a>
        <a href="#settings" title="Paramètres et personalisation"><FaCog /></a>
      </div>
    </div>
  );
};

export default NavbarRA;

