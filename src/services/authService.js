import axios from 'axios';

export const login = async (email, password) => {
  console.log('LoginService called with:', { email, password }); // Log des données d'entrée
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    console.log('API response:', response.data); // Log de la réponse complète

    // Sauvegarder les informations de l'utilisateur dans le localStorage
    localStorage.setItem('user', JSON.stringify(response.data)); 

    return response.data;
  } catch (error) {
    console.error('API error:', error.response ? error.response.data : error.message);
    throw error; // Relance l'erreur pour qu'elle soit gérée dans useAuth
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

// Nouvelle méthode pour récupérer l'utilisateur courant
export const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem('user')); // Récupérer l'utilisateur du localStorage
  return user; // Renvoie l'utilisateur (qui contient son rôle)
};

const AuthService = {
  login,
  register,
  registerAdmin,
  getCurrentUser, // Ajoutez ici la méthode getCurrentUser
};

export default AuthService;
