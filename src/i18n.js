// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          overview: "Overview",
          urban_analysis: "Urban Data Analysis",
          reports_analysis: "Reports and Analysis",
          file_complaint: "File a Complaint",
          complaint_list: "Complaint List",
          manage_complaints: "Manage Complaints",
          analyze_complaints: "Analyze Complaints",
          comparison: "Comparison",
          historical_data: "Historical Data and Prediction",
          mapping: "Mapping and Geolocation",
          user_management: "User Management",
          new_user: "New User",
          manage_user: "Manage User",
          logout: "Logout",
        }
      },
      fr: {
        translation: {
          overview: "Vue d'Ensemble",
          urban_analysis: "Analyse des Données Urbaines",
          reports_analysis: "Rapports et Analyses",
          file_complaint: "Faire une Plainte",
          complaint_list: "Liste des Plaintes",
          manage_complaints: "Gérer les Plaintes",
          analyze_complaints: "Analyse des Plaintes",
          comparison: "Comparaison",
          historical_data: "Données Historique et Prédiction",
          mapping: "Cartographie et Géolocalisation",
          user_management: "Gestion des Utilisateurs",
          new_user: "Nouveau Utilisateur",
          manage_user: "Gérer Utilisateur",
          logout: "Déconnexion",
        }
      }
    },

    fr: {
      "urban_pulse": "Urban Pulse",
      "dashboard": "Tableau de bord",
      "comments_and_feedback": "Commentaires et Feedback",
      "notifications": "Notifications",
      "settings_and_customization": "Paramètres et personnalisation"
    },
    

    en: {
      "urban_pulse": "Urban Pulse",
      "dashboard": "Dashboard",
      "comments_and_feedback": "Comments and Feedback",
      "notifications": "Notifications",
      "settings_and_customization": "Settings and Customization"
    },
    

    lng: "fr", 
    fallbackLng: "fr", 
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
