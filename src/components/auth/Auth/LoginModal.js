import React, { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [view, setView] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateEmail = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (view === 'register' && formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onLogin(formData.email, formData.password);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const switchView = (newView) => {
    setView(newView);
    setFormData({ email: '', password: '' });
    setErrors({});
  };

  const renderForgotPassword = () => (
    <form className="space-y-4 w-80 mx-auto" onSubmit={handleSubmit}>
      <p className="text-sm text-gray-600 text-center px-4">
        Entrez votre email pour réinitialiser votre mot de passe
      </p>
      <div className="space-y-2">
        <input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          type="email"
          className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          placeholder="votreemail@exemple.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>
      <a 
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        className="block w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-center leading-[2.75rem]"
      >
        Réinitialiser le mot de passe
      </a>
      <p className="text-center text-sm">
        <a 
          href="#"
          className="text-blue-600 hover:text-blue-800 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            switchView('login');
          }}
        >
          Retour à la connexion
        </a>
      </p>
    </form>
  );

  const renderRegister = () => (
    <form className="space-y-4 w-80 mx-auto" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          type="email"
          className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          placeholder="Email"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <div className="relative">
          <input
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            type={showPassword ? "text" : "password"}
            className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Mot de passe"
          />
          <a
            href="#"
            className="absolute right-6 top-6 -translate-y-1/2 cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </a>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>
      <a 
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        className="block w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-center leading-[2.75rem]"
      >
        Créer un compte
      </a>
      <p className="text-center text-sm">
        Déjà un compte?{' '}
        <a 
          href="#"
          className="text-blue-600 hover:text-blue-800 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            switchView('login');
          }}
        >
          Se connecter
        </a>
      </p>
    </form>
  );

  const renderLogin = () => (
    <form className="space-y-4 w-80 mx-auto" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          type="email"
          className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          placeholder="Email"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <div className="relative">
          <input
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            type={showPassword ? "text" : "password"}
            className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Mot de passe"
          />
          <a
            href="#"
            className="absolute right-6 top-6 -translate-y-1/2 cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </a>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>
      <div className="flex justify-end">
        <a
          href="#"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            switchView('forgot');
          }}
        >
          Mot de passe oublié?
        </a>
      </div>
      {/* Bouton de connexion avec ses propres styles */}
      <button 
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:transition-none"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin mr-2" />
            Chargement...
          </>
        ) : (
          "Connexion"
        )}
      </button>
      <p className="text-center text-sm">
        Pas encore de compte?{' '}
        <a 
          href="#"
          className="text-blue-600 hover:text-blue-800 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            switchView('register');
          }}
        >
          Créer un compte
        </a>
      </p>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {view === 'login' && 'Connexion'}
              {view === 'register' && 'Créer un compte'}
              {view === 'forgot' && 'Mot de passe oublié'}
            </h2>
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </a>
          </div>
          <div className="mt-4">
            {view === 'login' && renderLogin()}
            {view === 'register' && renderRegister()}
            {view === 'forgot' && renderForgotPassword()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;