// src/components/AdminDashboard.js
import React from 'react';
import Navbar from '../Navbar/NavbarUrbanist';
import Sidebar from '../Sidebar/SidebarUrbanist';
import '../styles/Dash/UrbanistDashboard.css'; // Gardez cette ligne si vous avez des styles pour la mise en page

const UrbanistDashboard = () => {
  return (
    <div className="dashboard-Urbanist">
      <Navbar />
      <div className="main-content-Urbanist">
        <Sidebar />
        <div className="content-Urbanist">
          <h1 className='h1-Urbanist'>Urbanist - Dashboard</h1>
          {/* Ajout du composant UrbanPulseInfo */}
        </div>
      </div>
    </div>


  );
};

export default UrbanistDashboard;
