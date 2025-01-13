import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASE_URL}/admin/users`;

export const fetchUsers = async (token) => {
  try {
    // Vérifier si le token existe
    if (!token) {
      throw new Error('Token manquant');
    }

    // Log pour debug
    console.log('Tentative de connexion avec token:', token);

    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (err) {
    // Gestion plus détaillée des erreurs
    if (err.response) {
      // La requête a été faite et le serveur a répondu avec un code d'erreur
      if (err.response.status === 401) {
        throw new Error('Non autorisé - Veuillez vous reconnecter');
      }
      throw new Error(`Erreur ${err.response.status}: ${err.response.data.message || 'Erreur lors de la récupération des données'}`);
    } else if (err.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      throw new Error('Aucune réponse du serveur');
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      throw new Error(err.message);
    }
  }
};

export const deleteUser = async (userId, token) => {
  try {
    if (!token) {
      throw new Error('Token manquant');
    }

    await axios.delete(`${API_URL}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    throw new Error(err.response?.data?.message || "Erreur lors de la suppression de l'utilisateur");
  }
};

export const updateUser = async (userId, formData, token) => {
  try {
    if (!token) {
      throw new Error('Token manquant');
    }

    const response = await axios.put(`${API_URL}/${userId}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Erreur lors de la mise à jour de l'utilisateur");
  }
};