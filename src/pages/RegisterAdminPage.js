import React from 'react';
import RegisterAdminForm from '../components/auth/RegisterAdminForm';
import '../styles/RegisterAdmin.css';

const RegisterAdminPage = () => {
  return (
    <div className="body">
      <div className="form-container">
        <h1 className='h1-auth'>Créer un compte</h1>
        <RegisterAdminForm />
      </div>
    </div>
  );
};

export default RegisterAdminPage;