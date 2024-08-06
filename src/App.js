import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Page from './components/Pages/page'; 
import Login from './components/Authentification/Login'; 
import Register from './components/Authentification/Register'; 
import AdminDashboard from './components/Dashboard/AdminDashboard'; 
import UrbanistDashboard from './components/Dashboard/UrbanistDashboard';
import VueEnsemble from './components/Dashboard/VueEnsemble';
import GestionUser from './components/Dashboard/GestionUser';
import Profile from './components/Profile/Profile';
import DashboardCitizen from './components/Dashboard/DashboardCitizen';
import RegisterAdmin from './components/Authentification/RegisterAdmin';
import UrbanAnalysis from './components/Analyse/UrbanAnalysis';
import Map from './components/Analyse/Map';
import ForgotPassword from './components/Authentification/ForgotPassword'; // Importez le composant ForgotPassword
import ResetPassword from './components/Authentification/ResetPassword'; // Importez le composant ResetPassword


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/urbanist-dashboard" element={<UrbanistDashboard />} />
        <Route path="/dashboard-citizen/*" element={<DashboardCitizen />} /> 
        <Route path="/vue-ensemble/*" element={<VueEnsemble />} />
        <Route path="/gestion-user" element={<GestionUser />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/urban-analysis" element={<UrbanAnalysis />} />
        <Route path="/map" element={<Map />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Ajoutez la route ForgotPassword */}
        <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Ajoutez la route ResetPassword */}
      </Routes>
    </Router>
  );
};

export default App;
