import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Admin/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', { email });
      setSuccessMessage(response.data.message);
      setEmail(''); // Réinitialiser le champ d'email après l'envoi
    } catch (error) {
      setErrorMessage('Erreur lors de la demande de réinitialisation. Veuillez réessayer.');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Mot de passe oublié</h2>
        <p>Entrez votre adresse e-mail pour recevoir un lien de réinitialisation de mot de passe.</p>
        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleForgotPassword} className='button-auth'>Envoyer</button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
