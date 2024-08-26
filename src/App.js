import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Page from './components/Parametres/page'; 
import Login from './components/Authentification/Login'; 
import Register from './components/Authentification/Register'; 
import AdminDashboard from './components/Dashboard/AdminDashboard'; 
import UrbanistDashboard from './components/Dashboard/UrbanistDashboard';
import VueEnsemble from './components/Dashboard/VueEnsemble';
import GestionUser from './components/Dashboard/GestionUser';
import Profile from './components/Parametres/Profile';
import DashboardCitizen from './components/Dashboard/DashboardCitizen';
import RegisterAdmin from './components/Authentification/RegisterAdmin';
import UrbanAnalysis from './components/Analyse/UrbanAnalysis';
import Map from './components/Maps/Map';
import ForgotPassword from './components/Authentification/ForgotPassword'; // Importez le composant ForgotPassword
import ResetPassword from './components/Authentification/ResetPassword'; // Importez le composant ResetPassword
import HomeReports from './components/Reports/HomeReports';
import Reports from './components/Reports/Reports';
import ReportsListe from './components/Reports/ReportsListe';
import ManageReports from './components/Reports/ManageReports';
import AnalyzeReports from './components/Reports/AnalyzeReports';
import Comparison from './components/Analyse/Comparison';
import ForumHeader from './components/Discussion/ForumHeader';
import DiscussionDetail from './components/Discussion/DiscussionDetail';
import DiscussionItem from './components/Discussion/DiscussionItem';
import DiscussionList from './components/Discussion/DiscussionList';
import ForumPage from './components/Discussion/ForumPage';




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
        <Route path="/map/*" element={<Map />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Ajoutez la route ForgotPassword */}
        <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Ajoutez la route ResetPassword */}
        <Route path="/home-reports/*" element={<HomeReports />} />
        <Route path="/reports-liste/*" element={<ReportsListe />} />
        <Route path="/manage-reports/*" element={<ManageReports />} />
        <Route path="/reports/*" element={<Reports />} />
        <Route path="/analyze-reports/*" element={<AnalyzeReports />} />
        <Route path="/comparison/*" element={<Comparison />} />
        <Route path="/forum-header/*" element={<ForumHeader />} />
        <Route path="/discussion-detail/*" element={<DiscussionDetail />} />
        <Route path="/discussion-item/*" element={<DiscussionItem />} />
        <Route path="/discussion-list/*" element={<DiscussionList />} />
        <Route path="/forum-page/*" element={<ForumPage />} />
      </Routes>
    </Router>
  );
};

export default App;
