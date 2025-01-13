import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between">
          {/* Section 1: Logo et description */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">UrbanPulse</h2>
            <p className="text-gray-400">
              Plateforme intelligente pour visualiser, analyser et optimiser la dynamique de votre ville en temps réel.
            </p>
          </div>

          {/* Section 2: Liens utiles */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Solutions</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">À propos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Se connecter</a></li>
            </ul>
          </div>

          {/* Section 3: Réseaux sociaux */}
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.56c-.88.39-1.83.65-2.83.77a4.92 4.92 0 0 0 2.16-2.71c-.95.57-2 1-3.12 1.23a4.92 4.92 0 0 0-8.39 4.48A13.95 13.95 0 0 1 1.64 3.16a4.93 4.93 0 0 0 1.52 6.57 4.89 4.89 0 0 1-2.23-.61v.06a4.93 4.93 0 0 0 3.95 4.83 4.93 4.93 0 0 1-2.23-.61v.06a4.93 4.93 0 0 0 3.95 4.83"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; 2024 UrbanPulse. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
