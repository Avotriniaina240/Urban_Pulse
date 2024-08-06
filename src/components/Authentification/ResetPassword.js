// src/components/Authentification/ResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Authentification/Auth.css';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessage(response.data.message);

      // Redirection après la réinitialisation réussie
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Erreur lors de la réinitialisation du mot de passe.');
      } else if (error.request) {
        setError('Aucune réponse du serveur.');
      } else {
        setError('Erreur de configuration de la requête.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='body'>
      <div className="form-container">
        <h1>Réinitialiser le mot de passe</h1>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nouveau mot de passe"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmer le mot de passe"
            required
          />
          <button type="submit" disabled={loading}>Réinitialiser</button>
        </form>
        <div className="signin-option">
          Retour à la connexion
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
