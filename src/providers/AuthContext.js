import React, { createContext, useState, useContext } from 'react';

// Créez un contexte pour l'authentification
const AuthContext = createContext();

// Créez un provider pour le contexte
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // État pour stocker les informations de l'utilisateur
  const [isAuthenticated, setIsAuthenticated] = useState(false); // État pour vérifier l'authentification

  const login = (userData) => {
    // Logic to log in the user
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Logic to log out the user
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};
