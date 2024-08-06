import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Authentification/Auth.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role] = useState('citizen'); // Fixer le rôle à 'citizen'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // État pour le message de succès
  const [loading, setLoading] = useState(false); // État pour le chargement
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activer le chargement
    setError(''); // Réinitialiser les messages d'erreur
    setSuccess(''); // Réinitialiser les messages de succès

    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, email, password, role });
      setSuccess('Ajout avec succès !'); // Définir le message de succès
      setTimeout(() => {
        navigate('/login'); // Redirection vers la page de connexion après l'affichage du message de succès
      }, 2000); // Attendre 2 secondes avant de rediriger
    } catch (error) {
      setError('Échec de l\'inscription.');
      console.error('Registration failed:', error);
    } finally {
      setLoading(false); // Désactiver le chargement
    }
  };

  return (
    <di className = 'body'>
    <div className="form-container">
      <h1>Créer un compte</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>} {/* Afficher le message de succès */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}
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
        <select value={role} disabled> {/* Menu déroulant désactivé */}
          <option value="citizen">citizen</option>
        </select>
        <button type="submit" disabled={loading}>S'inscrire</button>
      </form>
      <div className="signin-option">
        <Link to="/login">Vous avez déjà un compte? Connectez-vous</Link>
      </div>
    </div>
    </di>
  );
};

export default Register;
