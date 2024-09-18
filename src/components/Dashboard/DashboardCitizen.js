// src/components/AdminDashboard.js
import React from 'react';
import Navbar from '../StyleBar/Navbar/NavbarCitizen';
import '../styles/Dash/DashboardCitizen.css'; // Gardez cette ligne si vous avez des styles pour la mise en page

const DashboardCitizen = () => {
  return (
    <div className="dashboardCitizen">
      <Navbar />
      <div className="main-content-Citizen">
        <div className="content-Citizen">
          <h1 className='h1-Citizen'>Citizen - Dashboard</h1>
          {/* Ajout du composant UrbanPulseInfo */}
        </div>
      </div>
    </div>


  );
};

export default DashboardCitizen;
