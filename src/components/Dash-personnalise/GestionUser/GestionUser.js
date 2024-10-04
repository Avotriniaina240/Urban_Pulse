import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../StyleBar/Navbar/Navbar';
import Sidebar from '../../StyleBar/Sidebar/SidebarCarte';
import UserTable from './UserTable';  
import UserForm from './UserForm';    
import UserStats from './UserStats';  
import { fetchUsers, deleteUser as deleteUserApi, updateUser as updateUserApi } from '../../../services/apiService';
import '../../styles/Admin/GestionUser.css';

const GestionUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', role: '' });
  const [searchText, setSearchText] = useState('');
  const token = localStorage.getItem('token');

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers(token);
        setUsers(usersData);
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };

    loadUsers();
  }, [token]);

  const deleteUser = async (userId) => {
    try {
      await deleteUserApi(userId, token);
      setUsers(users.filter(user => user.id !== userId));
      toast.success('Utilisateur supprimé !');
    } catch (err) {
      setError(err.message);
      console.error(err);
      toast.error('Erreur de la suppression !');
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email, role: user.role });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserApi(editingUser.id, formData, token);
      setUsers(users.map(user => (user.id === editingUser.id ? updatedUser : user)));
      setEditingUser(null);
      toast.success("L'utilisateur a été mis à jour !");
    } catch (err) {
      setError(err.message);
      console.error(err);
      toast.error('Erreur lors de la mise à jour de l\'utilisateur !');
    }
  };

  return (
    <div className="vueg">
      <Navbar/>
      <div className="main-content-gu">
        <div className="content-gu">
        <Sidebar />
          <h1 className='h1-gu'>Gestion des Utilisateurs</h1>
          {error && <div className="error-message-gu">{error}</div>}

          {editingUser && (
            <UserForm
              formData={formData}
              setFormData={setFormData}
              handleFormSubmit={handleFormSubmit}
              setEditingUser={setEditingUser}
            />
          )}

          <UserStats users={users} />
          <UserTable
            users={filteredUsers}
            editUser={editUser}
            deleteUser={deleteUser}
            searchText={searchText}
            setSearchText={setSearchText}
          />
        </div>
      </div>
    </div>
  );
};

export default GestionUser;