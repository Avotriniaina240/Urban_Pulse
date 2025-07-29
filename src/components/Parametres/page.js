import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowDownCircle, Play, Zap, Eye, TrendingUp, Sparkles, Globe, BarChart3 } from 'lucide-react';

const Page = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const features = [
    {
      title: "Analyse en Temps Réel",
      description: "Surveillez les dynamiques urbaines en direct avec des données actualisées en continu.",
      icon: BarChart3,
      gradient: "from-lime-400 to-cyan-500"
    },
    {
      title: "Visualisation Avancée",
      description: "Transformez les données complexes en visualisations claires et actionnables.",
      icon: Eye,
      gradient: "from-cyan-400 to-lime-500"
    },
    {
      title: "Intelligence Prédictive",
      description: "Anticipez les tendances urbaines grâce à nos modèles d'IA avancés.",
      icon: TrendingUp,
      gradient: "from-lime-400 to-cyan-400"
    }
  ];

  const stats = [
    { number: "500K+", label: "Données analysées" },
    { number: "98%", label: "Précision" },
    { number: "24/7", label: "Surveillance" }
  ];

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background avec effets avancés */}
      <div className="absolute inset-0 bg-white">
        {/* Gradient de base */}
        <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 via-cyan-400/10 to-white"></div>
        
        {/* Motif géométrique animé */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(132, 204, 22, 0.3) 1px, transparent 0)`,
            backgroundSize: '60px 60px',
            animation: 'pulse 4s ease-in-out infinite'
          }}></div>
        </div>

        {/* Orbes flottants */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-lime-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-lime-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Effet de parallaxe avec la souris */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-lime-400 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-lime-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Navigation avec glassmorphism */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-lime-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">UP</span>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-lime-500 to-cyan-500 blur animate-pulse opacity-50"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-lime-600 to-cyan-600 bg-clip-text text-transparent">
                Urban Pulse
              </span>
            </div>

            <div className="flex items-center space-x-8">
              <a
                href="/login"
                className="relative group cursor-pointer transition-all duration-300"
              >
                <span className="text-gray-600 hover:text-lime-600 transition-colors duration-200">
                  Se connecter
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-lime-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Colonne gauche */}
            <div className={`space-y-8 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-1000`}>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-800">
                Donnez vie à vos
                <span className="bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent block mt-2">
                  données urbaines
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Plateforme intelligente pour visualiser, analyser et optimiser la dynamique de votre ville en temps réel.
              </p>

              {/* Statistiques */}
              <div className="flex gap-8 py-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-lime-400 to-cyan-400 hover:from-lime-500 hover:to-cyan-500 rounded-2xl flex items-center gap-3 transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-lime-500/25 transform hover:-translate-y-1">
                  <Zap className="w-5 h-5" />
                  Démarrer maintenant
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl flex items-center gap-3 transition-all duration-300 text-gray-700 font-semibold border border-gray-200 hover:border-gray-300">
                  <Globe className="w-5 h-5" />
                  Voir la démo
                </button>
              </div>
            </div>

            {/* Colonne droite - Vidéo avec design amélioré */}
            <div className={`relative transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-1000 delay-300`}>
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-lime-200 bg-white shadow-2xl">
                {/* Bordure animée */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-lime-400 to-cyan-400 opacity-50 blur-sm animate-pulse"></div>
                <div className="absolute inset-1 rounded-3xl bg-white">
                  {!isVideoPlaying ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <div className="relative">
                        <button
                          onClick={() => setIsVideoPlaying(true)}
                          className="group w-20 h-20 bg-gradient-to-r from-lime-400 to-cyan-400 rounded-full flex items-center justify-center hover:from-lime-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-110 shadow-xl hover:shadow-2xl hover:shadow-lime-500/50"
                        >
                          <Play className="w-10 h-10 text-white ml-1" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-lime-400 to-cyan-400 animate-ping opacity-30"></div>
                        </button>
                        <div className="absolute -inset-4 rounded-full border-2 border-lime-400/50 animate-spin"></div>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      className="w-full h-full rounded-2xl"
                      src="https://www.youtube.com/embed/q1ZCYWXIRjY?autoplay=1&loop=1&playlist=q1ZCYWXIRjY&controls=0&rel=0&showinfo=0&modestbranding=1"
                      title="Urban Pulse Demo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section des fonctionnalités améliorée */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`group relative p-8 rounded-3xl bg-white/50 backdrop-blur-sm border transition-all duration-500 hover:transform hover:-translate-y-2 ${
                    activeSection === index
                      ? 'border-lime-400/50 shadow-xl shadow-lime-500/20 bg-white/80'
                      : 'border-gray-200 hover:border-lime-400/30'
                  }`}
                >
                  {/* Fond animé */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {/* Icône */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-2xl font-semibold mb-4 text-gray-800 group-hover:text-lime-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Indicateur d'activité */}
                  {activeSection === index && (
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-lime-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicateur de scroll amélioré */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="relative">
            <ArrowDownCircle className="w-8 h-8 text-lime-400 animate-bounce" />
            <div className="absolute inset-0 w-8 h-8 border-2 border-lime-400/30 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default Page;