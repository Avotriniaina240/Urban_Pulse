import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Plus, Mail, Phone, MapPin, Calendar, User, ArrowLeft, Edit, Save } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InfoItem = ({ icon, label, value, isEditing, name, onChange, type = "text" }) => (
  <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50">
    <div className="text-gray-400">{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-sm text-gray-900">{value || 'Non défini'}</p>
      )}
    </div>
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div className="flex justify-end">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
      {children}
    </div>
  </div>
);

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    profilePictureUrl: '',
    role: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Token manquant. Veuillez vous reconnecter.");
        navigate('/login');
        return;
      }

      const decodedToken = jwtDecode(token);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/users/${decodedToken.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userData = {
        ...response.data,
        phoneNumber: response.data.phone_number,
      };
      delete userData.phone_number;

      setUserInfo(userData);
      setEditedInfo(userData);
    } catch (error) {
      toast.error("Impossible de charger les informations utilisateur.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedInfo(prev => ({
          ...prev,
          profilePictureUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { id } = jwtDecode(token);

      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/users/${id}`,
        {
          ...editedInfo,
          profile_picture_url: editedInfo.profilePictureUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserInfo(editedInfo);
      setIsEditing(false);
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      toast.error("Impossible de mettre à jour le profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </button>
            <h1 className="text-2xl font-bold text-center mb-8">Profil Utilisateur</h1>

            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <img
                  src={editedInfo.profilePictureUrl || '/image/profil-defaut.jpg'}
                  alt="Avatar"
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                  onClick={() => setIsModalOpen(true)}
                />
                <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50">
                  <Plus className="h-5 w-5 text-blue-500" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <h2 className="mt-4 text-xl font-semibold">
                {userInfo.username || 'Utilisateur'}
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { icon: <User />, label: "Utilisateur", name: "username" },
                { icon: <Mail />, label: "Email", name: "email" },
                { icon: <Phone />, label: "Téléphone", name: "phoneNumber" },
                { icon: <MapPin />, label: "Adresse", name: "address" },
                { icon: <Calendar />, label: "Date de naissance", name: "dateOfBirth", type: "date" },
                { icon: <User />, label: "Rôle", name: "role", readonly: true }
              ].map((item) => (
                <InfoItem
                  key={item.name}
                  icon={item.icon}
                  label={item.label}
                  value={isEditing ? editedInfo[item.name] : userInfo[item.name]}
                  isEditing={isEditing && !item.readonly}
                  name={item.name}
                  onChange={handleInputChange}
                  type={item.type}
                />
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={isLoading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <h2 className="text-xl font-semibold mb-4">Modifier votre photo de profil</h2>
            <img
              src={editedInfo.profilePictureUrl}
              alt="Aperçu"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Fermer
            </button>
          </Modal>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserProfile;