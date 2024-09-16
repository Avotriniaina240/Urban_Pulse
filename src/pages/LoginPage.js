import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import '../styles/Auth.css';

const LoginPage = () => {
  return (
    <div className='body'>
      <div className="form-container">
        <h1 className='h1-auth'>Bienvenue</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;