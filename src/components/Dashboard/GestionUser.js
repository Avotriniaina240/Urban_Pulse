import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Swal from 'sweetalert2';
import '../styles/Admin/GestionUser.css';

const GestionUser = () => {
  const [users, setUsers] = useState([]); 
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null); 
  const [formData, setFormData] = useState({ username: '', email: '', role: '' }); 
  const [searchText, setSearchText] = useState(''); 
  const token = localStorage.getItem('token'); 

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
      Swal.fire({
        title: 'Supprimé!',
        text: 'L\'utilisateur a été supprimé.',
        icon: 'success',
        timer: 1500, // 1500 ms = 1.5 secondes
        showConfirmButton: false
      });
    } catch (err) {
      setError("Erreur lors de la suppression de l'utilisateur.");
      console.error(err);
      Swal.fire({
        title: 'Erreur',
        text: "Erreur lors de la suppression de l'utilisateur.",
        icon: 'error',
        timer: 1500, // 1500 ms = 1.5 secondes
        showConfirmButton: false
      });
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
      Swal.fire({
        title: 'Modifié!',
        text: 'L\'utilisateur a été mis à jour.',
        icon: 'success',
        timer: 1500, // 1500 ms = 1.5 secondes
        showConfirmButton: false
      });
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'utilisateur.");
      console.error(err);
      Swal.fire('Erreur', "Erreur lors de la mise à jour de l'utilisateur.", 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchText.toLowerCase()) || 
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

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
                <th>Actions</th>
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
