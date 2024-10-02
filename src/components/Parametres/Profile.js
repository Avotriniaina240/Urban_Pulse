import React, { useState, useEffect } from 'react';
import '../styles/Admin/Profile.css';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    profilePictureUrl: '',
    role: '' // Ajout du rôle
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const address = localStorage.getItem('address');
    const dateOfBirth = localStorage.getItem('dateOfBirth');
    const profilePictureUrl = localStorage.getItem('profilePictureUrl');
    const role = localStorage.getItem('role'); // Récupération du rôle

    // Vérification si les informations essentielles sont disponibles
    if (username && email) {
      setUserInfo({
        username,
        email,
        phoneNumber,
        address,
        dateOfBirth,
        profilePictureUrl,
        role // Ajout du rôle aux informations de l'utilisateur
      });
    } else {
      setErrorMessage('Les informations de l\'utilisateur ne sont pas disponibles.');
    }
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container-pro">
      <h1 className="title-pro">Profil</h1>
      <div className="card-pro">
        <div className="profile-picture-container">
          <img
            src={userInfo.profilePictureUrl || 'default-avatar.png'}
            alt="Avatar"
            className="avatar-pro"
            onClick={openModal}
          />
        </div>
        <h2 className="subtitle-pro">{userInfo.username}</h2>
        <p>Email : {userInfo.email}</p>
        <p>Téléphone : {userInfo.phoneNumber || 'Information non disponible'}</p>
        <p>Adresse : {userInfo.address || 'Information non disponible'}</p>
        <p>Date de naissance : {userInfo.dateOfBirth || 'Information non disponible'}</p>
        <p>Rôle : {userInfo.role || 'Information non disponible'}</p> {/* Affichage du rôle */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      {isModalOpen && (
        <div className="modal-pro" onClick={closeModal}>
          <div className="modal-content-pro" onClick={(e) => e.stopPropagation()}>
            <img
              src={userInfo.profilePictureUrl || 'default-avatar.png'}
              alt="Image de profil"
              className="modal-image-pro"
            />
            <button className="close-modal-pro" onClick={closeModal}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
