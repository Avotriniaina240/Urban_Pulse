// src/components/AdminDashboard.js
import React from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import UrbanPulseInfo from '../Autres/UrbanPulseInfo';
import '../styles/Dash/AdminDashboard.css'; // Gardez cette ligne si vous avez des styles pour la mise en page

const AdminDashboard = () => {
  return (
    <div className="dashboard-Admin-P">
      <Navbar />
      <div className="main-content-Admin-P">
        <Sidebar />
        <div className="content-Admin-P">
          <h1 className='h1-Admin-P'>G - Urban Pulse</h1>
          {/* Ajout du composant UrbanPulseInfo */}
          <UrbanPulseInfo />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
