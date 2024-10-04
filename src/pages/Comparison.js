import React from 'react';
import ComparisonComponent from '../components/feature-specific/Comparaison/ComparisonComponent';
import Navbar from '../components/layouts/Navbar/Navbar';
import Sidebar from '../components/layouts/Sidebar/SidebarCarte';
import '../styles/Comparison.css';

const Comparison = () => {
  return (
    <div className="comparison-container">
      <Navbar />
      <Sidebar />
      <div className="content-container-comparison">
        <h1 className="h1-cp">Comparaison des Zones</h1>
        <ComparisonComponent />
      </div>
    </div>
  );
};

export default Comparison;