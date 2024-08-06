// src/components/Settings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: '',
    notificationsEnabled: false,
    otherSetting: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(settings);

  useEffect(() => {
    // Charger les paramètres actuels depuis l'API
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/settings');
        setSettings(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/settings', formData);
      setSettings(formData);
      setIsEditing(false);
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="settings-container">
      <h2>Paramètres</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="theme">Thème:</label>
            <input
              type="text"
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="notificationsEnabled"
                checked={formData.notificationsEnabled}
                onChange={handleChange}
              />
              Activer les notifications
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="otherSetting">Autre Paramètre:</label>
            <input
              type="text"
              id="otherSetting"
              name="otherSetting"
              value={formData.otherSetting}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Sauvegarder</button>
          <button type="button" onClick={() => setIsEditing(false)}>Annuler</button>
        </form>
      ) : (
        <div>
          <p><strong>Thème:</strong> {settings.theme}</p>
          <p><strong>Notifications:</strong> {settings.notificationsEnabled ? 'Activées' : 'Désactivées'}</p>
          <p><strong>Autre Paramètre:</strong> {settings.otherSetting}</p>
          <button onClick={() => setIsEditing(true)}>Modifier</button>
        </div>
      )}
    </div>
  );
};

export default Settings;
