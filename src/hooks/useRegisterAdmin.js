import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerAdmin as registerAdminService } from '../services/authService';

const useRegisterAdmin = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registerAdmin = async (username, email, password, role) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await registerAdminService(username, email, password, role);
      setSuccess('Ajout avec succès !');
      setTimeout(() => {
        navigate('/gestion-user');
      }, 2000);
      return true;
    } catch (error) {
      setError('Échec de l\'inscription.');
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { registerAdmin, error, success, loading };
};

export default useRegisterAdmin;