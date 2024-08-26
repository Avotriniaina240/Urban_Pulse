import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Admin/Auth.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { id, username, role, token, message } = response.data;

      localStorage.setItem('userId', id);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      localStorage.setItem('token', token);

      setMessage(message);
      setEmail('');
      setPassword('');

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'urbanist') {
          navigate('/urbanist-dashboard');
        } else {
          navigate('/dashboard-citizen');
        }
      }, 2000);

    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Échec de la connexion.');
      } else if (error.request) {
        setError('Aucune réponse du serveur.');
      } else {
        setError('Erreur de configuration de la requête.');
      }
      console.error('Login failed:', error);

      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='body'>
      <div className="form-container">
        <h1 className='h1-auth'>Bienvenue</h1>
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
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" disabled={loading}>Connexion</button>
        </form>
        <div className="forgot-password-option">
          <Link to="/forgot-password">Mot de passe oublié ?</Link>
        </div>
        <div className="signin-option">
          <Link to="/register">Vous n'avez pas de compte? Créez un compte</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
