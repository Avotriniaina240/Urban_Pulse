import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Titre de bienvenue avec animation subtile */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-fade-in">
            Bienvenue
          </h1>
          <p className="text-lg text-gray-600">
            Connectez-vous pour accéder a Urban Pulse
          </p>
        </div>

        {/* Container du formulaire avec effet de carte */}
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <LoginForm />
        </div>
      </div>

      {/* Cercles décoratifs en arrière-plan */}
      <div className="fixed top-0 right-0 -z-10 opacity-10">
        <div className="w-96 h-96 rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 blur-3xl" />
      </div>
      <div className="fixed bottom-0 left-0 -z-10 opacity-10">
        <div className="w-96 h-96 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 blur-3xl" />
      </div>
    </div>
  );
};

// Ajout d'une animation personnalisée pour le titre
const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out;
  }
`;

// Injecter les styles dans le head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default LoginPage;