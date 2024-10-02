import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/authService';
import { handleError } from '../utils/errorHandler';
import { ROUTES } from '../constants/routes';

const useAuth = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const data = await loginService(email, password);
      if (data.message) {
        setMessage(data.message);
      }

      // Stockage des données utilisateur dans le localStorage
      localStorage.setItem('userId', data.id);
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email);
      localStorage.setItem('role', data.role);
      localStorage.setItem('phoneNumber', data.phoneNumber);
      localStorage.setItem('address', data.address);
      localStorage.setItem('dateOfBirth', data.dateOfBirth);
      localStorage.setItem('profilePictureUrl', data.profilePictureUrl);
      localStorage.setItem('token', data.token);

      // Redirection basée sur le rôle
      setTimeout(() => {
        switch(data.role) {
          case 'admin':
            navigate(ROUTES.ADMIN_DASHBOARD);
            break;
          case 'urbanist':
            navigate(ROUTES.URBANIST_DASHBOARD);
            break;
          default:
            navigate(ROUTES.CITIZEN_DASHBOARD);
        }
      }, 2000);

      return true; // Indique que la connexion a réussi
    } catch (error) {
      setError(handleError(error)); // Gérer et afficher l'erreur
      return false; // Indique que la connexion a échoué
    } finally {
      setLoading(false); // Réinitialiser l'état de chargement
    }
  };

  return { login, error, loading, message };
};

export default useAuth;
