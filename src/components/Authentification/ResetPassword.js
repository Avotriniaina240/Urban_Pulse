import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../styles/Admin/Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const handleResetPassword = async () => {
    if (password.length < 6) {
      setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', { token, password });
      setSuccessMessage(response.data.message);
      setPassword(''); 
      setConfirmPassword(''); 
    } catch (error) {
      console.error('Erreur lors de la réinitialisation', error);
      setErrorMessage('Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.');
    }
  };

  return (
    <div className="reset-password"> 
      <h2>Réinitialiser votre mot de passe</h2>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleResetPassword} className='button-auth'>Réinitialiser le mot de passe</button>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default ResetPassword;
