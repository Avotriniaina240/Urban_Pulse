import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASE_URL}/admin/users`;

export const fetchUsers = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error('Erreur lors de la récupération des données.');
  }
};

export const deleteUser = async (userId, token) => {
  try {
    await axios.delete(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw new Error("Erreur lors de la suppression de l'utilisateur.");
  }
};

export const updateUser = async (userId, formData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    throw new Error("Erreur lors de la mise à jour de l'utilisateur.");
  }
};