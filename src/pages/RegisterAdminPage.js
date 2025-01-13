import React from 'react';
import RegisterAdminForm from '../components/auth/RegisterAdminForm';

const RegisterAdminPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg w-[45%] max-w-4xl p-5 relative">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Créer un compte</h1>
        <RegisterAdminForm />
      </div>
    </div>
  );
};

export default RegisterAdminPage;
