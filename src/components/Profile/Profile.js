import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import axios from 'axios';
import { Mail, Phone, MapPin, Calendar, User, ArrowLeft, Edit, Save, Camera } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Composant pour afficher ou éditer les informations utilisateur
const InfoItem = ({ icon, label, value, isEditing, name, onChange, type = "text" }) => (
  <div className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-sky-50">
    <div className="text-emerald-500">{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="mt-2 w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
        />
      ) : (
        <p className="mt-1 text-sm text-gray-800">{value || 'Non défini'}</p>
      )}
    </div>
  </div>
);

// Composant Modal
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-slideUp">
      <div className="flex justify-end">
        <div onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
          X
        </div>
      </div>
      {children}
    </div>
  </div>
);

const UserProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    profilePictureUrl: '',
    role: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});

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
        setEditedInfo((prev) => ({
          ...prev,
          profilePictureUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo((prev) => ({ ...prev, [name]: value }));
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-emerald-400 to-sky-400" />
            <div className="px-6 pb-6">
              <div
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 flex items-center text-white hover:bg-white/20 rounded-lg px-3 py-2 transition-all duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
              </div>

              <div className="relative -mt-16 flex flex-col items-center">
                <div className="relative group">
                  <img
                    src={editedInfo.profilePictureUrl || '/image/profil-defaut.jpg'}
                    alt="Avatar"
                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                    onClick={() => setIsModalOpen(true)}
                  />
                  <label className="absolute bottom-0 right-0 p-2 bg-emerald-500 rounded-full shadow-lg cursor-pointer hover:bg-emerald-600 transition-all duration-200">
                    <Camera className="h-5 w-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-800">
                  {userInfo.username || 'Utilisateur'}
                </h2>
                <p className="text-emerald-500 font-medium">{userInfo.role}</p>
              </div>

              <div className="mt-8 space-y-2 divide-y divide-gray-100">
                {[
                  { icon: <User />, label: "Utilisateur", name: "username" },
                  { icon: <Mail />, label: "Email", name: "email" },
                  { icon: <Phone />, label: "Téléphone", name: "phoneNumber" },
                  { icon: <MapPin />, label: "Adresse", name: "address" },
                  { icon: <Calendar />, label: "Date de naissance", name: "dateOfBirth", type: "date" },
                ].map((item) => (
                  <InfoItem
                    key={item.name}
                    icon={item.icon}
                    label={item.label}
                    value={isEditing ? editedInfo[item.name] : userInfo[item.name]}
                    isEditing={isEditing}
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
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-xl hover:from-emerald-600 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-medium"
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Sauvegarder
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-5 w-5" />
                      Modifier
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <h2 className="text-xl font-bold mb-4">Modifier votre photo de profil</h2>
            <img
              src={editedInfo.profilePictureUrl}
              alt="Aperçu"
              className="w-full h-64 object-cover rounded-xl"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200"
            >
              Fermer
            </button>
          </Modal>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default UserProfile;
