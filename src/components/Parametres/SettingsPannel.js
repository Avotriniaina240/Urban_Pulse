import React, { useState, useEffect } from 'react';
import '../styles/ATS/SettingsPannel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faBell, faGlobe, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Importer le hook useNavigate
import { useTranslation } from 'react-i18next'; // Importer useTranslation

const SettingsPanel = ({ onClose }) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('fr'); // État pour la langue

  const navigate = useNavigate(); // Initialiser le hook useNavigate
  const { t, i18n } = useTranslation(); // Utiliser useTranslation pour obtenir t et i18n

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark-mode', isDarkMode);
    }
  }, [isDarkMode]);

  // Utiliser useEffect pour appliquer la langue
  useEffect(() => {
    i18n.changeLanguage(language); // Changer la langue avec i18n
  }, [language, i18n]);

  const handleToggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Fonction pour gérer les clics sur le profil
  const handleProfileClick = () => {
    navigate('/Profile'); // Rediriger vers la page de profil
  };

  // Fonction pour gérer la sélection de langue
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
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
            <FontAwesomeIcon icon={faUser} className="icon" /> {t('profile')}
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
            <FontAwesomeIcon icon={faSun} className="icon" /> {t('theme')}
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
              <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} className="icon" /> {t('dark_mode')}
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
            <FontAwesomeIcon icon={faBell} className="icon" /> {t('notifications')}
          </h4>
          <span className="toggle-icon">{isNotificationsOpen ? '-' : '+'}</span>
        </div>
        {isNotificationsOpen && (
          <div className="settings-section-content show">
            <label>
              <input type="checkbox" />
              {t('enable_notifications')}
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
            <FontAwesomeIcon icon={faGlobe} className="icon" /> {t('language')}
          </h4>
          <span className="toggle-icon">{isLanguageOpen ? '-' : '+'}</span>
        </div>
        {isLanguageOpen && (
          <div className="settings-section-content show">
            <label>
              <input
                type="radio"
                name="language"
                value="fr"
                checked={language === 'fr'}
                onChange={handleLanguageChange}
              />
              Français
            </label>
            <label>
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === 'en'}
                onChange={handleLanguageChange}
              />
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
            <FontAwesomeIcon icon={faLock} className="icon" /> {t('privacy')}
          </h4>
          <span className="toggle-icon">{isPrivacyOpen ? '-' : '+'}</span>
        </div>
        {isPrivacyOpen && (
          <div className="settings-section-content show">
            <label>
              <input type="checkbox" />
              {t('enable_strict_privacy')}
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
