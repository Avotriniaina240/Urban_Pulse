import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate getting token from URL params
  const token = 'sample-token'; // In real app, get from useLocation/URLSearchParams

  const handleResetPassword = async () => {
    if (password.length < 6) {
      setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
        
    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setSuccessMessage('Mot de passe réinitialisé avec succès !');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation', error);
      setErrorMessage('Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans bg-cover bg-center flex justify-center items-center min-h-screen m-0 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-75 rounded-lg">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        )}

        <h1 className="mb-6 text-2xl text-gray-800 text-center font-medium">
          Réinitialiser votre mot de passe
        </h1>

        <div className="flex flex-col">
          {/* Password Input */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-base pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-base pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleResetPassword}
            disabled={isLoading}
            className="bg-blue-600 text-white border-none cursor-pointer text-base rounded-md transition-all duration-300 p-3 mb-4 hover:bg-blue-700 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>

          {/* Success Message */}
          {successMessage && (
            <p className="text-green-600 mb-4 text-center font-semibold">
              {successMessage}
            </p>
          )}

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-600 mb-4 text-center font-semibold">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Sign-in Option */}
        <div className="text-center mt-6">
          <a
            href="#"
            className="text-blue-600 no-underline text-sm hover:underline focus:outline-none focus:underline"
          >
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;