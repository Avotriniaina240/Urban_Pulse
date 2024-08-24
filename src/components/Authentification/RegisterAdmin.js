import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import NavbarRA from '../StyleBar/Navbar/NavbarRA';
import SidebarRA from '../Sidebar/SidebarRA';
import '../styles/Admin/RegisterAdmin.css';

const RegisterAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('citizen'); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); 
  const [loading, setLoading] = useState(false); 
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
        navigate('/gestion-user'); // Redirection vers la page de connexion après l'affichage du message de succès
      }, 2000); // Attendre 2 secondes avant de rediriger
    } catch (error) {
      setError('Échec de l\'inscription.');
      console.error('Registration failed:', error);
    } finally {
      setLoading(false); // Désactiver le chargement
    }
  };

  return (
    <div className='body'>
      <div className="form-container">
      <NavbarRA />
      <SidebarRA />
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
          <select value={role} onChange={(e) => setRole(e.target.value)}> {/* Menu déroulant pour sélectionner le rôle */}
            <option value="citizen">citizen</option>
            <option value="urbanist">urbanist</option>
            <option value="admin">admin</option>
          </select>
          <button type="submit" disabled={loading}>S'inscrire</button>
        </form>
        <div className="signin-option">
          <Link to="/login">Vous avez déjà un compte? Connectez-vous</Link>
        </div>
      </div>
    </div>

  );
};


export default RegisterAdmin;
