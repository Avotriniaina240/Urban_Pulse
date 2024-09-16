import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import '../styles/Auth.css';

const RegisterPage = () => {
  return (
    <div className="body">
      <div className="form-container">
        <h1 className='h1-auth'>Créer un compte</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;