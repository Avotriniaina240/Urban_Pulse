import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import '../styles/Admin/Profile.css';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const fakeUserData = {
                    username: 'Avotriniaina',
                    profile_picture_url: 'https://via.placeholder.com/150',
                    email: 'jean.dupont@example.com',
                    phone_number: '+33 6 12 34 56 78',
                    address: '123 Rue de la Paix, Paris, France',
                    date_of_birth: '1990-05-15',
                    description: "Je suis un développeur web PHP créatif avec une expérience dans les techniques de front-end.",
                };

                setTimeout(() => {
                    setUserData(fakeUserData);
                    setLoading(false);
                }, 1000);
            } catch (err) {
                setError('Erreur lors du chargement des données');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) return <div className="loading-pro">Chargement...</div>;
    if (error) return <div className="error-pro">{error}</div>;

    return (
        <div className="container-pro">
            <h1 className="title-pro">Profil</h1>
            <div className="card-pro">
                <div className="profile-picture-container">
                    <img 
                        src={profilePicture || userData.profile_picture_url} 
                        alt={userData.username} 
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
                        />
                    </label>
                </div>
                <h2 className="subtitle-pro">{userData.username}</h2>
            </div>
            <div className="info-section-pro">
                <h3 className="section-title-pro">Sur moi</h3>
                <p className="description-pro">{userData.description}</p>
            </div>
            <div className="info-section-pro">
                <h3 className="section-title-pro">Des détails</h3>
                <ul className="details-list-pro">
                    <li><strong>Email:</strong> {userData.email}</li>
                    <li><strong>Téléphone:</strong> {userData.phone_number}</li>
                    <li><strong>Adresse:</strong> {userData.address}</li>
                    <li><strong>Date de naissance:</strong> {new Date(userData.date_of_birth).toLocaleDateString()}</li>
                </ul>
            </div>

            {isModalOpen && (
                <div className="modal-pro" onClick={closeModal}>
                    <div className="modal-content-pro" onClick={e => e.stopPropagation()}>
                        <img 
                            src={profilePicture || userData.profile_picture_url} 
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
