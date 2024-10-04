import React from 'react';

const UserStats = ({ users }) => {
  const countUsersByRole = (role) => users.filter(user => user.role === role).length;

  return (
    <div className="affiche">
      <div className="section section-1">Citoyen : {countUsersByRole('citizen')}</div>
      <div className="section section-2">Urbaniste : {countUsersByRole('urbanist')}</div>
      <div className="section section-3">Administrateur : {countUsersByRole('admin')}</div>
    </div>
  );
};

export default UserStats;
