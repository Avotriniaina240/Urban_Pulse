import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../StyleBar/Navbar/Navbar';
import Sidebar from '../StyleBar/Sidebar/Sidebar';
import { toast } from 'react-toastify'; // Importer la fonction toast
import '../styles/Admin/GestionUser.css';

const GestionUser = () => {
  const [users, setUsers] = useState([]); 
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null); 
  const [formData, setFormData] = useState({ username: '', email: '', role: '' }); 
  const [searchText, setSearchText] = useState(''); 
  const token = localStorage.getItem('token'); 

  // Filtrer les utilisateurs en fonction du texte de recherche
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const usersResponse = await axios.get('http://localhost:5000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(usersResponse.data); 
      } catch (err) {
        setError('Erreur lors de la récupération des données.');
        console.error(err);
      }
    }

    fetchData();
  }, [token]);

  const countUsersByRole = (role) => {
    return users.filter(user => user.role === role).length;
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter(user => user.id !== userId));
      toast.success('Utilisateur supprimé !');
    } catch (err) {
      setError("Erreur lors de la suppression de l'utilisateur.");
      console.error(err);
      toast.success('Erreur de la suppresion !');
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email, role: user.role });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/users/${editingUser.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.map(user => (user.id === editingUser.id ? response.data : user)));
      setEditingUser(null);
      toast.success('l\'utilisateur a été mis à jour !');
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'utilisateur.");
      console.error(err);
      toast.success('Erreur lors de la mise à jour de l\'utilisateur !');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="vueg">
      <Navbar onSearchChange={setSearchText} />
      <div className="main-content-gu">
        <Sidebar />
        <div className="content-gu">
          <h1 className='h1-gu'>Gestion des Utilisateurs</h1>
          
          {error && <div className="error-message-gu">{error}</div>}

          {editingUser && (
            <form onSubmit={handleFormSubmit} className="edit-forms">
              <h2>Modifier Utilisateur</h2>
              <label>
                Utilisateur :
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
              </label>
              <label>
                Email :
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
              </label>
              <label>
                Rôle :
                <select name="role" value={formData.role} onChange={handleInputChange}>
                  <option value="admin">Admin</option>
                  <option value="urbanist">Urbanist</option>
                  <option value="citizen">Citizen</option>
                </select>
              </label>
              <button type="submit">Sauvegarder</button>
              <button type="button" onClick={() => setEditingUser(null)}>Annuler</button>
            </form>
          )}

          <div className="affiche">
            <div className="section section-1">CITIZEN : {countUsersByRole('citizen')}</div>
            <div className="section section-2">URBANIST : {countUsersByRole('urbanist')}</div>
            <div className="section section-3">ADMIN : {countUsersByRole('admin')}</div>
          </div>

          <table className='tableau'>
            <thead>
              <tr>
                <th>Nom d'utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="search-input"
                    style={{ width: '100%', boxSizing: 'border-box' }} // Pour ajuster la largeur de la barre de recherche
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className='btm' onClick={() => editUser(user)}>Modifier</button>
                    <button className='bts' onClick={() => deleteUser(user.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GestionUser;