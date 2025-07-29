import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMessage('Veuillez entrer une adresse e-mail.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Veuillez entrer une adresse e-mail valide.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setSuccessMessage('Un e-mail de réinitialisation a été envoyé à votre adresse.');
      setEmail(''); // Reset email field after sending
    } catch (error) {
      setErrorMessage('Erreur lors de la demande de réinitialisation. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleForgotPassword();
    }
  };

  return (
    <div className="font-sans bg-cover bg-center flex justify-center items-center min-h-screen m-0 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-75 rounded-lg">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        <h1 className="mb-4 text-2xl text-gray-800 text-center font-medium">
          Mot de passe oublié
        </h1>
        
        <p className="mb-6 text-gray-600 text-center text-sm leading-relaxed">
          Entrez votre adresse e-mail pour recevoir un lien de réinitialisation de mot de passe.
        </p>

        <div className="flex flex-col">
          {/* Email Input */}
          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Mail size={20} />
            </div>
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 pl-10 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleForgotPassword}
            disabled={isLoading || !email.trim()}
            className="bg-blue-600 text-white border-none cursor-pointer text-base rounded-md transition-all duration-300 p-3 mb-4 hover:bg-blue-700 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Envoi en cours...
              </span>
            ) : (
              'Envoyer'
            )}
          </button>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              <p className="text-center font-medium">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              <p className="text-center font-medium">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Back to Sign In Link */}
        <div className="text-center mt-6">
          <a
            href="#"
            className="inline-flex items-center text-blue-600 no-underline text-sm hover:underline focus:outline-none focus:underline transition-colors duration-200"
          >
            <ArrowLeft size={16} className="mr-1" />
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;