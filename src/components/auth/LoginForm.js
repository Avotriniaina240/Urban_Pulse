import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PasswordInput from '../common/PasswordInput';
import LoadingSpinner from '../common/LoadingSpinner';
import useAuth from '../../hooks/useAuth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading, message } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      {loading && <LoadingSpinner />}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>Connexion</button>
      </form>
      <div className="forgot-password-option">
        <Link to="/forgot-password">Mot de passe oublié ?</Link>
      </div>
      <div className="signin-option">
        <Link to="/register">Vous n'avez pas de compte? Créez un compte</Link>
      </div>
    </>
  );
};

export default LoginForm;