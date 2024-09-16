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
    try {
      const data = await loginService(email, password);
      setMessage(data.message);
      
      // Stockage des données utilisateur
      localStorage.setItem('userId', data.id);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);
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

      return true;
    } catch (error) {
      setError(handleError(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, error, loading, message };
};

export default useAuth;