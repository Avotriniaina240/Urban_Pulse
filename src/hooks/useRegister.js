import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerService } from '../services/authService';

const useRegister = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (username, email, password, role) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await registerService(username, email, password, role);
      setSuccess('Ajout avec succès !');
      setTimeout(() => {
        navigate('/login');
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

  return { register, error, success, loading };
};

export default useRegister;