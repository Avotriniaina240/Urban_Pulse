import React from 'react';

const UserTable = ({ users, editUser, deleteUser, searchText, setSearchText }) => {
  return (
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
              style={{ width: '100%', boxSizing: 'border-box', marginBottom: '0'}}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
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
  );
};

export default UserTable;
