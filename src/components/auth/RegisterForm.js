import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useRegister from '../../hooks/useRegister';
import LoadingSpinner from '../common/LoadingSpinner';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');   // Ajout du champ téléphone
  const [address, setAddress] = useState('');           // Ajout du champ adresse
  const [dateOfBirth, setDateOfBirth] = useState('');   // Ajout du champ date de naissance
  const [profilePictureUrl, setProfilePictureUrl] = useState(''); // Ajout du champ URL de l'image
  const [role] = useState('citizen');
  const { register, error, success, loading } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ajout des nouveaux champs à la soumission
    await register(username, email, password, role, phoneNumber, address, dateOfBirth, profilePictureUrl);
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

        <select value={role} disabled>
          <option value="citizen">citizen</option>
        </select>
        <button type="submit" disabled={loading}>S'inscrire</button>
      </form>
      <div className="signin-option">
        <Link to="/login">Vous avez déjà un compte? Connectez-vous</Link>
      </div>
    </>
  );
};

export default RegisterForm;
