
import React from 'react';
import { FaHome, FaUser, FaComment, FaShieldAlt, FaCog } from 'react-icons/fa';
import '../../styles/Bar/NavCss/NavbarUrbanist.css'; // Assure-toi que ce fichier CSS existe

const NavbarUrbanist = () => {
  return (
    <div className="navbarUrbanist">
      <h1>Urban Pulse</h1>
      <div className="navbar-search-Urbnaist">
        <input type="text" placeholder="Rechercher..." />
      </div>
      <div className="navbar-links-Urbanist">
        <a href="urbanist-dashboard" title="Dashboard"><FaHome /></a>
        <a href="Profile" title="Profil"><FaUser /></a> 
        <a href= "#Comment" title = "Commentaires et Feedback"><FaComment /></a>
        <a href="#Security" title="Sécurité et Confidentialité"><FaShieldAlt /></a>
        <a href="#settings" title="Paramètres et personalisation"><FaCog /></a>
      </div>
    </div>
  );
};

export default NavbarUrbanist;

