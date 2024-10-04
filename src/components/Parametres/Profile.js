import React, { useState, useEffect } from 'react';
import { Plus, Mail, Phone, MapPin, Calendar, User, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import du hook useNavigate
import '../styles/Admin/Profile.css';

const UserProfile = () => {
  const [infoUtilisateur, setInfoUtilisateur] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    profilePictureUrl: '',
    role: ''
  });
  const [modalOuvert, setModalOuvert] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [messageErreur, setMessageErreur] = useState('');
  const navigate = useNavigate(); // Utilisation du hook useNavigate

  useEffect(() => {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const address = localStorage.getItem('address');
    const dateOfBirth = localStorage.getItem('dateOfBirth');
    const profilePictureUrl = localStorage.getItem('profilePictureUrl');
    const role = localStorage.getItem('role');

    if (username && email) {
      setInfoUtilisateur({
        username,
        email,
        phoneNumber,
        address,
        dateOfBirth,
        profilePictureUrl,
        role
      });
    } else {
      setMessageErreur("Les informations de l'utilisateur ne sont pas disponibles.");
    }
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setChargement(true);
      setMessageErreur('');

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_WIDTH = 300;
          const scaleFactor = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleFactor;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

          try {
            const response = await fetch(`http://localhost:5000/api/users/${localStorage.getItem('userId')}/upload-profile-picture`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ imageData: compressedBase64 }),
            });

            if (!response.ok) {
              throw new Error("Erreur lors du téléchargement de l'image");
            }

            const data = await response.json();
            setInfoUtilisateur((prev) => ({
              ...prev,
              profilePictureUrl: data.imageUrl || compressedBase64
            }));

            localStorage.setItem('profilePictureUrl', data.imageUrl || compressedBase64);
          } catch (error) {
            console.error("Erreur lors du téléchargement de l'image:", error);
            setMessageErreur("Impossible de charger l'image. Veuillez réessayer.");
          } finally {
            setChargement(false);
          }
        };
      };
    }
  };

  return (
    <div className="container-box">
      <div className="container-pro">
        <h1 className="title-pro">Profil Utilisateur</h1>

        <div className="profile-box">
          <motion.div
            className="card-pro"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={10} />
              Retour
            </button>
            <div className="profile-picture-container">
              <img
                src={infoUtilisateur.profilePictureUrl || 'default-avatar.png'}
                alt="Avatar"
                className="avatar-pro"
                onClick={() => setModalOuvert(true)}
              />
              <label className="upload-icon">
                <Plus size={24} color="#4a90e2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                  disabled={chargement}
                />
              </label>
            </div>
            <h2 className="subtitle-pro">{infoUtilisateur.username}</h2>
            {chargement && <p>Chargement en cours...</p>}
            {messageErreur && <p className="error-message">{messageErreur}</p>}
          </motion.div>

          <div className="box-info">
            <motion.div
              className="info-section-pro"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ul className="details-list-pro">
                <InfoItem icon={<Mail />} label="Email" value={infoUtilisateur.email} />
                <InfoItem icon={<Phone />} label="Téléphone" value={infoUtilisateur.phoneNumber} />
                <InfoItem icon={<MapPin />} label="Adresse" value={infoUtilisateur.address} />
                <InfoItem icon={<Calendar />} label="Date de naissance" value={infoUtilisateur.dateOfBirth ? new Date(infoUtilisateur.dateOfBirth).toLocaleDateString() : 'Non disponible'} />
                <InfoItem icon={<User />} label="Rôle" value={infoUtilisateur.role} />
              </ul>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {modalOuvert && (
            <Modal onClose={() => setModalOuvert(false)}>
              <img
                src={infoUtilisateur.profilePictureUrl || 'default-avatar.png'}
                alt="Image de profil agrandie"
                className="modal-image-pro"
              />
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <li className="info-item">
    <span className="info-icon">{icon}</span>
    <div>
      <strong>{label}:</strong> {value || 'Non disponible'}
    </div>
  </li>
);

const Modal = ({ children, onClose }) => (
  <motion.div
    className="modal-pro"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="modal-content-pro"
      onClick={(e) => e.stopPropagation()}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
    >
      {children}
      <button className="close-modal-pro" onClick={onClose}>&times;</button>
    </motion.div>
  </motion.div>
);

export default UserProfile;
