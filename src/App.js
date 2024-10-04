import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './i18n';
import LoginPage from './pages/LoginPage';
import { ROUTES } from './constants/routes';
import RegisterPage from './pages/RegisterPage';
import SettingsPannel from './components/Parametres/SettingsPannel'; 
import Page from './components/Parametres/page'; 
import AdminDashboard from './components/Dashboard/AdminDashboard'; 
import UrbanistDashboard from './components/Dashboard/UrbanistDashboard';
import VueEnsemble from './components/Dash-personnalise/VueEnsemble/VueEnsemble';
import GestionUser from './components/Dash-personnalise/GestionUser/GestionUser';
import Profile from './components/Parametres/Profile';
import DashboardCitizen from './components/Dashboard/DashboardCitizen';
import RegisterAdminPage from './pages/RegisterAdminPage';
import UrbanAnalysis from './components/Analyse/UrbanAnalysis';
import Map from './components/Maps/Map';
import ForgotPassword from './components/Authentification/ForgotPassword'; 
import ResetPassword from './components/Authentification/ResetPassword'; 
import HomeReports from './components/Reports/HomeReports';
import Reports from './components/Reports/Reports';
import ReportsListe from './components/Reports/ReportsListe';
import ManageReports from './components/Reports/ManageReports';
import AnalyzeReports from './components/Reports/AnalyzeReports';
import Comparison from './pages/Comparison';
import ForumPage from './components/Discussion/ForumPage';
import HistoricalAndPrediction from './components/Prediction/HistoricalAndPrediction';
import { StatisticsProvider } from './components/Reports/StatisticsContext'

const App = () => {
  return (
    <StatisticsProvider>
      <Router>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path="settings/*" element={<SettingsPannel />} /> 
          <Route path="/" element={<Page />} /> 
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/urbanist-dashboard" element={<UrbanistDashboard />} />
          <Route path="/dashboard-citizen/*" element={<DashboardCitizen />} /> 
          <Route path="/vue-ensemble/*" element={<VueEnsemble />} />
          <Route path="/gestion-user" element={<GestionUser />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register-admin" element={<RegisterAdminPage />} />
          <Route path="/urban-analysis" element={<UrbanAnalysis />} />
          <Route path="/map/*" element={<Map />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/home-reports/*" element={<HomeReports />} />
          <Route path="/reports-liste/*" element={<ReportsListe />} />
          <Route path="/manage-reports/*" element={<ManageReports />} />
          <Route path="/reports/*" element={<Reports />} />
          <Route path="/analyze-reports/*" element={<AnalyzeReports />} />
          <Route path="/comparison/*" element={<Comparison />} />
          <Route path="/forum-page/*" element={<ForumPage />} />
          <Route path="/historique-prediction/*" element={<HistoricalAndPrediction />} />
        </Routes>
      </Router>
      <ToastContainer />
    </StatisticsProvider>
  );
};

export default App;
