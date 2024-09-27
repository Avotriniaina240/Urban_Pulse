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
        const userId = localStorage.getItem('userId'); // Récupérer l'ID utilisateur du local storage

        // Vérifier si l'ID est valide
        if (!userId || isNaN(userId)) {
            setError('ID utilisateur non valide dans le stockage local.');
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des données');
                }
                const data = await response.json();
                console.log('Données reçues:', data); // Ajoutez cette ligne pour voir les données reçues
                setUserData(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
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

    const email = localStorage.getItem('email');
    const phoneNumber = localStorage.getItem('phone_number');
    const address = localStorage.getItem('address');
    const dateOfBirth = localStorage.getItem('date_of_birth');

    console.log('Données du stockage local:', { email, phoneNumber, address, dateOfBirth });


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
                    <li><strong>Email:</strong> {userData?.email || 'Non spécifié'}</li>
                    <li><strong>Téléphone:</strong> {userData?.phone_number || 'Non spécifié'}</li>
                    <li><strong>Adresse:</strong> {userData?.address || 'Non spécifié'}</li>
                    <li><strong>Date de naissance:</strong> {userData?.date_of_birth ? new Date(userData.date_of_birth).toLocaleDateString() : 'Non spécifié'}</li>
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
