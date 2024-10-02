import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import '../styles/Admin/Profile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false); // Gère le statut du téléchargement de l'image

  // Récupérer les données utilisateur à partir de l'API backend
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId'); // Récupérer l'ID de l'utilisateur stocké localement
      if (!userId) {
        console.error('ID utilisateur non trouvé dans le localStorage');
        setError('ID utilisateur non trouvé. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Données utilisateur reçues:', data);
        setUserData(data);
        if (data.profile_picture_url) {
          setProfilePicture(data.profile_picture_url);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(`Erreur lors de la récupération des données : ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Gestion du changement d'image de profil
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true); // Active le statut de téléchargement
      const userId = localStorage.getItem('userId');
      const formData = new FormData();
      formData.append('profilePicture', file);

      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}/upload-profile-picture`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Erreur lors du téléchargement de l\'image');
        }

        const data = await response.json();
        const updatedProfileUrl = `http://localhost:5000/uploads/${data.fileUrl}`;
        setProfilePicture(updatedProfileUrl); // Met à jour l'image localement
        localStorage.setItem('profile_picture_url', updatedProfileUrl); // Enregistre dans le localStorage
      } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image:', error);
        setError(error.message);
      } finally {
        setUploading(false); // Désactive le statut de téléchargement
      }
    }
  };

  // Gestion de l'ouverture du modal pour l'image
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div className="loading-pro">Chargement...</div>;
  if (error) return <div className="error-pro">Erreur: {error}</div>;
  if (!userData) return <div className="error-pro">Aucune donnée utilisateur disponible. Veuillez réessayer.</div>;

  return (
    <div className="container-pro">
      <h1 className="title-pro">Profil</h1>
      <div className="card-pro">
        <div className="profile-picture-container">
          <img
            src={profilePicture || 'default-avatar.png'}
            alt={userData.username || 'Avatar'}
            className="avatar-pro"
            onClick={openModal}
          />
          <label className="upload-icon">
            <Plus size={24} color="#4a90e2" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
              disabled={uploading} // Désactive l'input pendant le téléchargement
            />
          </label>
        </div>
        <h2 className="subtitle-pro">{userData.username || 'Utilisateur inconnu'}</h2>
      </div>
      <div className="info-section-pro">
        <h3 className="section-title-pro">Détails</h3>
        <ul className="details-list-pro">
          <li><strong>Email:</strong> {userData.email || 'Non disponible'}</li>
          <li><strong>Téléphone:</strong> {userData.phone_number || 'Non disponible'}</li>
          <li><strong>Adresse:</strong> {userData.address || 'Non disponible'}</li>
          <li><strong>Date de naissance:</strong> {userData.date_of_birth ? new Date(userData.date_of_birth).toLocaleDateString() : 'Non disponible'}</li>
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal-pro" onClick={closeModal}>
          <div className="modal-content-pro" onClick={(e) => e.stopPropagation()}>
            <img
              src={profilePicture || 'default-avatar.png'}
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
