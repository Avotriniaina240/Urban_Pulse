import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowDownCircle, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Page = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const features = [
    {
      title: "Analyse en Temps Réel",
      description: "Surveillez les dynamiques urbaines en direct avec des données actualisées en continu."
    },
    {
      title: "Visualisation Avancée",
      description: "Transformez les données complexes en visualisations claires et actionnables."
    },
    {
      title: "Intelligence Prédictive",
      description: "Anticipez les tendances urbaines grâce à nos modèles d'IA avancés."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fond avec motif et dégradé */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 via-cyan-400/10 to-white"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">
                UrbanPulse
              </span>
            </div>

            <div className="flex items-center space-x-8">
              <Link
                to="/login"
                className="relative group cursor-pointer transition-opacity duration-300 hover:opacity-80"
              >
                <span className="text-gray-600 hover:text-lime-600 transition-colors duration-200">
                  Se connecter
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-lime-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-800">
                Donnez vie à vos
                <span className="bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">
                  {" "}données urbaines
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                Plateforme intelligente pour visualiser, analyser et optimiser la dynamique de votre ville en temps réel.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-gradient-to-r from-lime-400 to-cyan-400 hover:from-lime-500 hover:to-cyan-500 rounded-full flex items-center gap-2 transition-all hover:gap-3 text-white font-semibold shadow-lg hover:shadow-xl">
                  Démarrer <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-3 bg-gradient-to-r to-cyan-300 hover:to-cyan-500 rounded-full flex items-center gap-2 transition-all hover:gap-3 text-white font-semibold shadow-lg hover:shadow-xl">
                  En savoir plus
                </button>
              </div>
            </div>

            {/* Right Column - YouTube Video Section */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-lime-200 bg-white shadow-xl">
              {!isVideoPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    className="w-16 h-16 bg-gradient-to-r from-lime-400 to-cyan-400 rounded-full flex items-center justify-center hover:from-lime-500 hover:to-cyan-500 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Play className="w-8 h-8 text-white" />
                  </button>
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/q1ZCYWXIRjY?autoplay=1&loop=1&playlist=q1ZCYWXIRjY&controls=0&rel=0&showinfo=0&modestbranding=1"
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl bg-white border ${
                  activeSection === index
                    ? 'border-lime-400 shadow-lg'
                    : 'border-gray-200 hover:border-lime-400/50'
                } transition-all duration-300`}
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDownCircle className="w-8 h-8 text-lime-400" />
        </div>
      </div>
    </div>
  );
};

export default Page;