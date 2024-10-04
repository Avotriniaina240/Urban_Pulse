import React from 'react';

const UserForm = ({ formData, setFormData, handleFormSubmit, setEditingUser }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
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
  );
};

export default UserForm;
