// src/components/Navbar.js
import React from 'react';
import { FaHome, FaUser, FaComment, FaShieldAlt, FaCog } from 'react-icons/fa';
import '../styles/Bar/NavbarCitizen.css'; // Assure-toi que ce fichier CSS existe

const NavbarCitizen = () => {
  return (
    <div className="navbarCitizen">
      <h1>Urban Pulse</h1>
      <div className="navbar-search-Citizen">
        <input type="text" placeholder="Rechercher..." />
      </div>
      <div className="navbar-links-Citizen">
        <a href="dashboard-citizen" title="Dashboard"><FaHome /></a>
        <a href="Profile" title="Profil"><FaUser /></a> 
        <a href= "#Comment" title = "Commentaires et Feedback"><FaComment /></a>
        <a href="#Security" title="Sécurité et Confidentialité"><FaShieldAlt /></a>
        <a href="#settings" title="Paramètres et personalisation"><FaCog /></a>
      </div>
    </div>
  );
};

export default NavbarCitizen;

