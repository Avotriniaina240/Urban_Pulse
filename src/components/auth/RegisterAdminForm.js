import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useRegisterAdmin from '../../hooks/useRegisterAdmin';
import LoadingSpinner from '../common/LoadingSpinner';

const RegisterAdminForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('citizen');
  const [phoneNumber, setPhoneNumber] = useState(''); // Ajout du champ téléphone
  const [address, setAddress] = useState('');         // Ajout du champ adresse
  const [dateOfBirth, setDateOfBirth] = useState(''); // Ajout du champ date de naissance
  const [profilePictureUrl, setProfilePictureUrl] = useState(''); // Ajout du champ URL de l'image
  const { registerAdmin, error, success, loading } = useRegisterAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ajout des nouveaux champs dans la soumission du formulaire
    await registerAdmin(username, email, password, role, phoneNumber, address, dateOfBirth, profilePictureUrl);
  };

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading && <LoadingSpinner />}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="citizen">Citizen</option>
          <option value="urbanist">Urbanist</option>
          <option value="admin">Admin</option>
        </select>

        {/* Nouveau champ pour numéro de téléphone */}
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Numéro de téléphone"
          required
        />

        {/* Nouveau champ pour adresse */}
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Adresse"
        />

        {/* Nouveau champ pour la date de naissance */}
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          placeholder="Date de naissance"
        />

        <button type="submit" disabled={loading}>S'inscrire</button>
      </form>
      <div className="signin-option">
        <Link to="/login">Vous avez déjà un compte? Connectez-vous</Link>
      </div>
    </>
  );
};

export default RegisterAdminForm;
