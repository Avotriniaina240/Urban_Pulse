import React, { useState, useEffect } from 'react';
import '../styles/ATS/SettingsPannel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faBell, faGlobe, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Importer le hook useNavigate

const SettingsPanel = ({ onClose }) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate(); // Initialiser le hook useNavigate

  // Utiliser useEffect pour gérer l'application du mode sombre
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark-mode', isDarkMode);
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Fonction pour gérer les clics sur le profil
  const handleProfileClick = () => {
    navigate('/Profile'); // Rediriger vers la page de profil
  };

  return (
    <div className="settings-panel show">
      {/* Section Profil */}
      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={handleProfileClick}
        >
          <h4>
            <FontAwesomeIcon icon={faUser} className="icon" /> Profil
          </h4>
        </div>
      </div>

      {/* Section Thème */}
      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => setIsThemeOpen(!isThemeOpen)}
        >
          <h4>
            <FontAwesomeIcon icon={faSun} className="icon" /> Thème
          </h4>
          <span className="toggle-icon">{isThemeOpen ? '-' : '+'}</span>
        </div>
        {isThemeOpen && (
          <div className="settings-section-content show">
            <label>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={handleToggleDarkMode}
              />
              <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} className="icon" /> Mode sombre
            </label>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
        >
          <h4>
            <FontAwesomeIcon icon={faBell} className="icon" /> Notifications
          </h4>
          <span className="toggle-icon">{isNotificationsOpen ? '-' : '+'}</span>
        </div>
        {isNotificationsOpen && (
          <div className="settings-section-content show">
            <label>
              <input type="checkbox" />
              Activer les notifications
            </label>
          </div>
        )}
      </div>

      {/* Langue */}
      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => setIsLanguageOpen(!isLanguageOpen)}
        >
          <h4>
            <FontAwesomeIcon icon={faGlobe} className="icon" /> Langue
          </h4>
          <span className="toggle-icon">{isLanguageOpen ? '-' : '+'}</span>
        </div>
        {isLanguageOpen && (
          <div className="settings-section-content show">
            <label>
              <input type="radio" name="language" />
              Français
            </label>
            <label>
              <input type="radio" name="language" />
              Anglais
            </label>
          </div>
        )}
      </div>

      {/* Confidentialité */}
      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
        >
          <h4>
            <FontAwesomeIcon icon={faLock} className="icon" /> Confidentialité
          </h4>
          <span className="toggle-icon">{isPrivacyOpen ? '-' : '+'}</span>
        </div>
        {isPrivacyOpen && (
          <div className="settings-section-content show">
            <label>
              <input type="checkbox" />
              Activer la confidentialité renforcée
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
