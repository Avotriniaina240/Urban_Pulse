import React from 'react';

const LoadingSpinner = ({ className = "w-5 h-5" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Spinner principal */}
      <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full animate-spin" />
      
      {/* Anneau extérieur avec effet de pulse */}
      <div className="absolute inset-0 border-2 border-current opacity-20 rounded-full animate-pulse" />
      
      {/* Anneau intérieur avec rotation inverse */}
      <div className="absolute inset-1.5 border border-current border-b-transparent rounded-full animate-spin-reverse" />
      
      {/* Point central avec effet de pulse */}
      <div className="absolute inset-[45%] bg-current rounded-full animate-pulse" />
    </div>
  );
};

// Ajouter les animations personnalisées à votre fichier tailwind.config.js
const tailwindConfig = {
  theme: {
    extend: {
      animation: {
        'spin-reverse': 'spin-reverse 1s linear infinite',
      },
      keyframes: {
        'spin-reverse': {
          'from': { transform: 'rotate(360deg)' },
          'to': { transform: 'rotate(0deg)' },
        },
      },
    },
  },
};

export default LoadingSpinner;