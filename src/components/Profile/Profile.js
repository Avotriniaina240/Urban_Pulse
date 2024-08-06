import React from 'react';
import '../styles/Admin/Profile.css';

const Profile = () => {
  return (
    <div className="user-profile">
      <div className="profile-header">
        <img src="profile-picture-url" alt="Profile" className="profile-picture" />
        <h2>Nom d'utilisateur</h2>
        <button>Modifier le Profil</button>
      </div>

      <div className="profile-section">
        <h3>Informations Personnelles</h3>
        <p>Email: user@example.com</p>
        <p>Numéro de téléphone: +123456789</p>
      </div>

      <div className="profile-section">
        <h3>Détails du Compte</h3>
        <p>Date de création du compte: 01/01/2023</p>
        <p>Dernière connexion: 05/08/2024</p>
      </div>

      <div className="profile-section">
        <h3>Préférences</h3>
        <p>Langue: Français</p>
        <p>Notifications: Activées</p>
      </div>

      <div className="profile-section">
        <h3>Sécurité</h3>
        <button>Changer le mot de passe</button>
        <p>2FA: Activé</p>
      </div>

      <div className="profile-section">
        <h3>Activités Récentes</h3>
        <ul>
          <li>Connexion à 10:00 le 05/08/2024</li>
          <li>Modification du profil à 09:30 le 01/08/2024</li>
        </ul>
      </div>

      <div className="profile-section">
        <h3>Rôles et Permissions</h3>
        <p>Rôle: Citoyen</p>
      </div>

      <div className="profile-section">
        <h3>Informations Additionnelles</h3>
        <p>Adresse: 123 Rue Principale</p>
        <p>Date de naissance: 15/07/1990</p>
      </div>

      <div className="profile-section">
        <h3>Intégrations et Connexions</h3>
        <p>Compte Google: Connecté</p>
      </div>

      <div className="profile-section">
        <h3>Centre de Support</h3>
        <button>Contacter le Support</button>
        <p>Tickets de support: 3 ouverts</p>
      </div>
    </div>
  );
};

export default Profile;
