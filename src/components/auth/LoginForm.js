import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import useAuth from '../../hooks/useAuth';

const PasswordInput = ({ value, onChange, className, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
      />
      <span
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        {showPassword ? (
          <EyeOffIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </span>
    </div>
  );
};

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading, message } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="max-w-md w-full">
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-gray-100">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            Connectez-vous
          </h2>
          <p className="text-base text-gray-600">
            Accédez à votre espace personnel
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 border border-red-100">
            <div className="text-sm text-red-700 font-medium">{error}</div>
          </div>
        )}
        
        {message && (
          <div className="rounded-xl bg-green-50 p-4 border border-green-100">
            <div className="text-sm text-green-700 font-medium">{message}</div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5 w-full">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors duration-200 sm:text-sm"
                placeholder="exemple@email.com"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors duration-200 sm:text-sm"
                placeholder="Votre mot de passe"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link 
              to="/forgot-password" 
              className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {loading ? (
                <LoadingSpinner className="w-5 h-5" />
              ) : (
                'Se connecter'
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <Link 
              to="/register" 
              className="text-sm font-medium text-gray-600 hover:text-emerald-500 transition-colors duration-200"
            >
              Pas encore de compte ? <span className="text-emerald-600">Créez-en un</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;