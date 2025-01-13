import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../layouts/Navbar/Navbar';
import Sidebar from '../../layouts/Sidebar/SidebarCarte';
import { fetchUsers, deleteUser as deleteUserApi, updateUser as updateUserApi } from '../../../services/apiService';
import { Search, Edit2, Trash2, X, Save, Users } from 'lucide-react';

const GestionUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', role: '' });
  const [searchText, setSearchText] = useState('');
  
  const getToken = () => localStorage.getItem('token');

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const loadUsers = async () => {
      const token = getToken();
      
      if (!token) {
        setError('Veuillez vous connecter');
        return;
      }

      try {
        const usersData = await fetchUsers(token);
        setUsers(usersData);
        setError('');
      } catch (err) {
        const errorMessage = err.message;
        setError(errorMessage);
        console.error('Erreur lors du chargement des utilisateurs:', err);
        
        if (errorMessage.includes('Non autorisé')) {
          localStorage.removeItem('token');
        }
        
        toast.error(errorMessage);
      }
    };

    loadUsers();
  }, []);

  const deleteUser = async (userId) => {
    const token = getToken();
    if (!token) {
      setError('Veuillez vous connecter');
      return;
    }

    try {
      await deleteUserApi(userId, token);
      setUsers(users.filter(user => user.id !== userId));
      toast.success('Utilisateur supprimé avec succès !');
    } catch (err) {
      const errorMessage = err.message;
      setError(errorMessage);
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setFormData({ 
      username: user.username, 
      email: user.email, 
      role: user.role 
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError('Veuillez vous connecter');
      return;
    }

    try {
      const updatedUser = await updateUserApi(editingUser.id, formData, token);
      setUsers(users.map(user => (user.id === editingUser.id ? updatedUser : user)));
      setEditingUser(null);
      setError('');
      toast.success('Utilisateur mis à jour avec succès !');
    } catch (err) {
      const errorMessage = err.message;
      setError(errorMessage);
      console.error('Erreur lors de la mise à jour:', err);
      toast.error('Erreur lors de la mise à jour de l\'utilisateur');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 bg-gray-50">
          <div className="container p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-500" />
                <span className="text-base font-medium text-gray-600">
                  Total: {users.length}
                </span>
              </div>
            </div>
          
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {editingUser ? (
              <UserForm
                formData={formData}
                setFormData={setFormData}
                handleFormSubmit={handleFormSubmit}
                setEditingUser={setEditingUser}
              />
            ) : (
              <>
                <UserStats users={users} />
                <UserTable
                  users={filteredUsers}
                  editUser={editUser}
                  deleteUser={deleteUser}
                  searchText={searchText}
                  setSearchText={setSearchText}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const UserForm = ({ formData, setFormData, handleFormSubmit, setEditingUser }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleFormSubmit} className="bg-white shadow-md rounded-lg px-6 py-5 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Modifier Utilisateur</h2>
        <button
          type="button"
          onClick={() => setEditingUser(null)}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Utilisateur
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
            />
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
            />
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rôle
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
            >
              <option value="admin">Admin</option>
              <option value="urbanist">Urbanist</option>
              <option value="citizen">Citizen</option>
            </select>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={() => setEditingUser(null)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Save className="h-4 w-4 mr-1.5" />
          Sauvegarder
        </button>
      </div>
    </form>
  );
};

const UserStats = ({ users }) => {
  const countUsersByRole = (role) => users.filter(user => user.role === role).length;

  const stats = [
    {
      title: "Citoyen",
      count: countUsersByRole('citizen'),
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200"
    },
    {
      title: "Urbaniste",
      count: countUsersByRole('urbanist'),
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200"
    },
    {
      title: "Administrateur",
      count: countUsersByRole('admin'),
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`${stat.bgColor} rounded-lg border ${stat.borderColor}`}
        >
          <div className="px-4 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className={`h-5 w-5 ${stat.textColor}`} />
              </div>
              <div className="ml-4">
                <dt className={`text-sm font-medium ${stat.textColor}`}>
                  {stat.title}
                </dt>
                <dd className={`text-2xl font-semibold ${stat.textColor} mt-1`}>
                  {stat.count}
                </dd>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const UserTable = ({ users, editUser, deleteUser, searchText, setSearchText }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="relative rounded-md w-[30%]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher un utilisateur..." 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom d'utilisateur
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'urbanist' ? 'bg-green-100 text-green-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-20 cursor-pointer">
                    <div
                      onClick={() => editUser(user)}
                      className="text-green-600 hover:text-green-900 flex items-center"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Modifier
                    </div>
                    <div
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 text-center" />
                      Supprimer
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionUser;