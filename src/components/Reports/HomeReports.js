import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/Sidebar';
import '../styles/ATS/HomeReports.css';

const HomeReports = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="home-container">
        <div className="global-border">
          <div className="buttons-container">
            <Link to="/reports">
              <button className="home-button">Faire une Plainte</button>
            </Link>
            <Link to="/reports-liste">
              <button className="home-button">Voir la Liste des Plaintes</button>
            </Link>
            <Link to="/manage-reports">
              <button className="home-button">Gérer les Plaintes</button>
            </Link>
          </div>
        </div>
      </div>
      <div>
          <Link to="/analyze-reports">
            <button className="round-button">+</button>
          </Link>
          </div>
    </div>
    
  );
};

export default HomeReports;
