import React, { useState, useEffect } from 'react';
import '../styles/ATS/SettingsPannel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faBell, faGlobe, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next'; 

const SettingsPanel = ({ onClose }) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('fr');

  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); 

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark-mode', isDarkMode);
    }
  }, [isDarkMode]);

  useEffect(() => {
    i18n.changeLanguage(language); 
  }, [language, i18n]);

  const handleToggleDarkMode = () => setIsDarkMode(!isDarkMode);


  const handleProfileClick = () => {
    navigate('/Profile'); 
  };


  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="settings-panel show">

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
              English
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
