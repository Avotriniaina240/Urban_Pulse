// src/components/Notifications.js
import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import '../styles/Admin/Notifications.css'; // Assure-toi de créer ce fichier CSS

const Notifications = () => {
  const [show, setShow] = useState(false);

  const toggleNotifications = () => {
    setShow(!show);
  };

  return (
    <div className="notifications-container">
      <button className="notifications-button" onClick={toggleNotifications}>
        <FaBell />
      </button>
      {show && (
        <div className="notifications-dropdown">
          <p><strong>Notification 1:</strong> Vous avez un nouveau message.</p>
          <p><strong>Notification 2:</strong> La mise à jour est disponible.</p>
          <p><strong>Notification 3:</strong> Votre compte a été mis à jour.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
