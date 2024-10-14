import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Mail, Phone, MapPin, Calendar, User, ArrowLeft, Edit, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import { jwtDecode } from 'jwt-decode'; 
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Admin/Profile.css';
import InfoItem from './InfoItem'; // Import du composant InfoItem

const Modal = ({ children, onClose }) => (
  <motion.div
    className="modal-pro"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="modal-content-pro">
      <button className="modal-close" onClick={onClose}>✕</button>
      {children}
    </div>
  </motion.div>
);

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
  const [infoModifiee, setInfoModifiee] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    profilePictureUrl: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    setChargement(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error("Token manquant. Veuillez vous reconnecter."); 
        navigate('/login'); // Rediriger vers la page de connexion
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userInfo = {
        ...response.data,
        phoneNumber: response.data.phone_number,
      };
      delete userInfo.phone_number;

      setInfoUtilisateur(userInfo);
      setInfoModifiee(userInfo); 

    } catch (error) {
      console.error("Erreur lors du chargement des informations utilisateur:", error);
      toast.error("Impossible de charger les informations utilisateur."); 
    } finally {
      setChargement(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInfoModifiee(prev => ({
          ...prev,
          profilePictureUrl: reader.result, // Enregistre l'image en Base64
        }));
      };
      reader.readAsDataURL(file);
    } else {
      console.log("Aucun fichier sélectionné.");
    }
  };

  const handleEditClick = () => {
    setModeEdition(true);
  };

  const handleSaveClick = async () => {
    setChargement(true);
  
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const updatedUserData = {
        username: infoModifiee.username,
        email: infoModifiee.email,
        phoneNumber: infoModifiee.phoneNumber,
        address: infoModifiee.address,
        dateOfBirth: infoModifiee.dateOfBirth,
        profile_picture_url: infoModifiee.profilePictureUrl,
      };    

      await axios.put(`${process.env.REACT_APP_BASE_URL}/users/${userId}`, updatedUserData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setInfoUtilisateur(updatedUserData);
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
                src={infoModifiee.profilePictureUrl || '/image/profil-defaut.jpg'}
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
            <h2 className="subtitle-pro">{infoUtilisateur.username || 'Utilisateur non défini'}</h2>
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
                  icon={<User />} 
                  label="Utilisateur" 
                  value={modeEdition ? infoModifiee.username : infoUtilisateur.username} 
                  isEditing={modeEdition}
                  name="username"
                  onChange={handleInputChange}
                />
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
            {modeEdition ? (
              <button className="save-button" onClick={handleSaveClick}>
                <Save size={20} />
                Sauvegarder
              </button>
            ) : (
              <button className="edit-button" onClick={handleEditClick}>
                <Edit size={20} />
                Modifier
              </button>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
      <AnimatePresence>
        {modalOuvert && (
          <Modal onClose={() => setModalOuvert(false)}>
            <h2>Modifier votre photo de profil</h2>
            <img src={infoModifiee.profilePictureUrl} alt="Aperçu" className="preview-image" />
            <button onClick={() => setModalOuvert(false)}>Fermer</button>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
