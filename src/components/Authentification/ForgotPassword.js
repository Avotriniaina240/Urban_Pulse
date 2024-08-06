// src/components/Authentification/ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Authentification/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Erreur lors de la demande de réinitialisation.');
      } else if (error.request) {
        setError('Aucune réponse du serveur.');
      } else {
        setError('Erreur de configuration de la requête.');
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        setError('');
        setMessage('');
      }, 5000); // Clear messages after 5 seconds
    }
  };

  return (
    <div className="body">
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <button type="submit" disabled={loading}>Envoyer</button>
        </form>
        <div className="signin-option">
          <Link to="/login">Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
