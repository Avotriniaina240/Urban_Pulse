import axios from 'axios';

export const login = async (email, password) => {
  console.log('LoginService called with:', { email, password }); // Log des données d'entrée
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    console.log('API response:', response.data); // Log de la réponse complète
    return response.data;
  } catch (error) {
    console.error('API error:', error.response ? error.response.data : error.message);
    throw error; // Relance l'erreur pour qu'elle soit gérée dans useAuth
  }
};


// ... autres fonctions du service d'authentification ...

export const register = async (username, email, password, role) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', { username, email, password, role });
    return response.data;
  } catch (error) {
    console.error('API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// ... autres fonctions du service d'authentification ...

export const registerAdmin = async (username, email, password, role) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', { username, email, password, role });
    return response.data;
  } catch (error) {
    console.error('API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};