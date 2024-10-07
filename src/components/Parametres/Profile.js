import React, { useState, useEffect } from 'react';
import { Plus, Mail, Phone, MapPin, Calendar, User, ArrowLeft, Edit, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [modeEdition, setModeEdition] = useState(false);
  const [infoModifiee, setInfoModifiee] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = () => {
    const userInfo = {
      username: localStorage.getItem('username') || '',
      email: localStorage.getItem('email') || '',
      phoneNumber: localStorage.getItem('phoneNumber') || '',
      address: localStorage.getItem('address') || '',
      dateOfBirth: localStorage.getItem('dateOfBirth') || '',
      profilePictureUrl: localStorage.getItem('profilePictureUrl') || '',
      role: localStorage.getItem('role') || ''
    };

    setInfoUtilisateur(userInfo);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setChargement(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        localStorage.setItem('profilePictureUrl', base64String);
        setInfoUtilisateur(prev => ({ ...prev, profilePictureUrl: base64String }));
        setChargement(false);
        toast.success("Image de profil mise à jour avec succès");
      };
      reader.onerror = () => {
        toast.error("Erreur lors du chargement de l'image");
        setChargement(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setModeEdition(true);
    setInfoModifiee({ ...infoUtilisateur });
  };

  const handleSaveClick = () => {
    setChargement(true);

    try {
      // Mise à jour du localStorage
      Object.entries(infoModifiee).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // Mise à jour de l'état
      setInfoUtilisateur(infoModifiee);
      setModeEdition(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error("Impossible de mettre à jour le profil. Veuillez réessayer.");
    } finally {
      setChargement(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInfoModifiee(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container-box">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
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
          </motion.div>

          <div className="box-info">
            <motion.div
              className="info-section-pro"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ul className="details-list-pro">
                <InfoItem 
                  icon={<Mail />} 
                  label="Email" 
                  value={modeEdition ? infoModifiee.email : infoUtilisateur.email} 
                  isEditing={modeEdition}
                  name="email"
                  onChange={handleInputChange}
                />
                <InfoItem 
                  icon={<Phone />} 
                  label="Téléphone" 
                  value={modeEdition ? infoModifiee.phoneNumber : infoUtilisateur.phoneNumber} 
                  isEditing={modeEdition}
                  name="phoneNumber"
                  onChange={handleInputChange}
                />
                <InfoItem 
                  icon={<MapPin />} 
                  label="Adresse" 
                  value={modeEdition ? infoModifiee.address : infoUtilisateur.address} 
                  isEditing={modeEdition}
                  name="address"
                  onChange={handleInputChange}
                />
                <InfoItem 
                  icon={<Calendar />} 
                  label="Date de naissance" 
                  value={modeEdition ? infoModifiee.dateOfBirth : infoUtilisateur.dateOfBirth} 
                  isEditing={modeEdition}
                  name="dateOfBirth"
                  onChange={handleInputChange}
                  type="date"
                />
                <InfoItem icon={<User />} label="Rôle" value={infoUtilisateur.role} />
              </ul>
            </motion.div>
          </div>
          
          <div className="edit-button-container">
            {!modeEdition ? (
              <button className="back-button" onClick={handleEditClick}>
                <Edit size={20} />
                Modifier
              </button>
            ) : (
              <button className="back-button" onClick={handleSaveClick}>
                <Save size={20} />
                Enregistrer
              </button>
            )}
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

const InfoItem = ({ icon, label, value, isEditing, name, onChange, type = "text" }) => (
  <li className="info-item">
    <span className="info-icon">{icon}</span>
    <div>
      <strong>{label}:</strong>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="edit-input"
        />
      ) : (
        value || 'Non disponible'
      )}
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