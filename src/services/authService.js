import axios from 'axios';

const MAX_STORAGE_SIZE = 5000000; // 5 Mo

const isStorageAvailable = (data) => {
  const dataString = JSON.stringify(data);
  const sizeInBytes = new Blob([dataString]).size;
  return sizeInBytes <= MAX_STORAGE_SIZE;
};

const clearUserFromLocalStorage = () => {
  console.warn('Nettoyage de la clé "user" dans le localStorage en raison du dépassement de quota...');
  localStorage.removeItem('user'); // Nettoyer uniquement la clé 'user'
};

export const login = async (email, password) => {
  console.log('LoginService called with:', { email, password });
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    console.log('API response:', response.data);

    console.log('Current localStorage:', localStorage);
    console.log('Size of data to store:', new Blob([JSON.stringify(response.data)]).size);

    if (isStorageAvailable(response.data)) {
      localStorage.setItem('user', JSON.stringify(response.data));
    } else {
      clearUserFromLocalStorage();
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    console.error('API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const register = async (username, email, password, role) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', { username, email, password, role });
    return response.data;
  } catch (error) {
    console.error('API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const registerAdmin = async (username, email, password, role) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', { username, email, password, role });
    return response.data;
  } catch (error) {
    console.error('API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user;
};

const AuthService = {
  login,
  register,
  registerAdmin,
  getCurrentUser,
};

export default AuthService;
