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

  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: 'Administrateur',
      urbanist: 'Urbaniste',
      citizen: 'Citoyen'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role) => {
    const roleColors = {
      admin: 'from-purple-500 to-purple-600',
      urbanist: 'from-green-500 to-green-600',
      citizen: 'from-blue-500 to-blue-600'
    };
    return roleColors[role] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header avec gradient */}
        <div className={`bg-gradient-to-r ${getRoleColor(formData.role)} px-8 py-6 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Modifier l'utilisateur</h2>
                <p className="text-white/80 text-sm">
                  Mettez à jour les informations de {formData.username}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          {/* Décoration géométrique */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full"></div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleFormSubmit} className="p-8">
          <div className="space-y-6">
            {/* Nom d'utilisateur */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Nom d'utilisateur</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-300"
                  placeholder="Entrez le nom d'utilisateur"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Adresse email</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-300"
                  placeholder="utilisateur@exemple.com"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>

            {/* Rôle */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    formData.role === 'admin' ? 'bg-purple-500' : 
                    formData.role === 'urbanist' ? 'bg-green-500' : 
                    'bg-blue-500'
                  }`}></div>
                  <span>Rôle utilisateur</span>
                </div>
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${
                    formData.role === 'admin' ? 'purple' : 
                    formData.role === 'urbanist' ? 'green' : 'blue'
                  }-500 focus:ring-0 transition-colors duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-300 appearance-none cursor-pointer`}
                >
                  <option value="admin">Administrateur</option>
                  <option value="urbanist">Urbaniste</option>
                  <option value="citizen">Citoyen</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {/* Badge de rôle actuel */}
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getRoleColor(formData.role)} text-white shadow-sm`}>
                  {getRoleDisplayName(formData.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`px-8 py-3 bg-gradient-to-r ${getRoleColor(formData.role)} text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center space-x-2`}
            >
              <Save className="h-5 w-5" />
              <span>Sauvegarder les modifications</span>
            </button>
          </div>
        </form>

        {/* Footer décoratif */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>
      </div>
    </div>
  );
};

const UserStats = ({ users }) => {
  const countUsersByRole = (role) => users.filter(user => user.role === role).length;
  
  const stats = [
    {
      title: "Citoyen",
      count: countUsersByRole('citizen'),
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-500"
    },
    {
      title: "Urbaniste", 
      count: countUsersByRole('urbanist'),
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      iconBg: "bg-green-500"
    },
    {
      title: "Administrateur",
      count: countUsersByRole('admin'), 
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`${stat.bgColor} rounded-xl border ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow duration-200`}
        >
          <div className="px-6 py-5">
            <div className="flex items-center">
              <div className={`${stat.iconBg} p-3 rounded-lg shadow-sm`}>
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <dt className={`text-sm font-semibold ${stat.textColor} uppercase tracking-wide`}>
                  {stat.title}
                </dt>
                <dd className={`text-3xl font-bold ${stat.textColor} mt-2`}>
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
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="relative rounded-lg w-[30%]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
          />
        </div>
      </div>
             
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nom d'utilisateur
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200">
                <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900 text-center">
                  {user.username}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 text-center">
                  {user.email}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold
                    ${user.role === 'admin' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200' :
                       user.role === 'urbanist' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200' :
                       'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => editUser(user)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 flex items-center px-3 py-2 rounded-lg transition-all duration-200 border border-transparent hover:border-green-200"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center px-3 py-2 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </button>
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