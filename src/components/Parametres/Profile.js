import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUserData(response.data);
            } catch (err) {
                setError('Erreur lors de la récupération des données du profil');
                console.error(err);
            }
        };

        fetchUserData();
    }, []);

    if (error) return <div>{error}</div>;
    if (!userData) return <div>Chargement...</div>;

    return (
        <div>
            <h1>Profil de {userData.username}</h1>
            <img src={userData.profile_picture_url} alt="Photo de profil" />
            <p>Email: {userData.email}</p>
            <p>Téléphone: {userData.phone_number}</p>
            <p>Adresse: {userData.address}</p>
            <p>Date de naissance: {new Date(userData.date_of_birth).toLocaleDateString()}</p>
            <p>Thème: {userData.theme}</p>
            <pre>Disposition: {JSON.stringify(userData.layout, null, 2)}</pre>
        </div>
    );
};

export default UserProfile;
