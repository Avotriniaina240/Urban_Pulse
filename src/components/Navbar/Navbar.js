import React from 'react';
import { FaHome, FaUser, FaComment, FaShieldAlt, FaCog } from 'react-icons/fa';
import '../styles/Bar/Navbar.css';

const Navbar = ({ onSearchChange }) => {
  return (
    <div className="navbar">
      <h1>Urban Pulse</h1>
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Rechercher..."
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {/*<Notifications />*/}
      <div className="navbar-links">
        <a href="admin-dashboard" title="Dashboard"><FaHome /></a>
        <a href="Profile" title="Profil"><FaUser /></a> 
        <a href="#Comment" title="Commentaires et Feedback"><FaComment /></a>
        <a href="#Security" title="Sécurité et Confidentialité"><FaShieldAlt /></a>
        <a href="#settings" title="Paramètres et personalisation"><FaCog /></a>
      </div>
    </div>
  );
};

export default Navbar;
