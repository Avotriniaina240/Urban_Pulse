import React, { useState } from 'react';
import { Menu, Plus, X, Thermometer, Droplets, Wind, Search, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ComparisonToolbar = ({ onFetchData, onSortChange }) => {
  const [locations, setLocations] = useState(['']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddLocation = () => {
    if (locations.length < 5) {
      setLocations([...locations, '']);
    }
  };

  const handleRemoveLocation = (index) => {
    const newLocations = locations.filter((_, i) => i !== index);
    setLocations(newLocations);
  };

  const handleLocationChange = (index, value) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    const locationString = locations.filter((loc) => loc.trim() !== '').join(',');
    onFetchData(locationString);
    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(false);
    }, 2000);
  };

  const metrics = [
    { value: 'air', icon: Wind, label: 'Qualité de l\'air' },
    { value: 'temperature', icon: Thermometer, label: 'Température' },
    { value: 'humidity', icon: Droplets, label: 'Humidité' }
  ];

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border-2 border-[#33b1e1]/20 ml-3 w-[98%] mt-3">
      {/* Main Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative">
          <select
            className="w-96 appearance-none px-5 py-3 bg-gray-50 border-2 border-[#8bc540]/20 text-gray-700 rounded-xl focus:ring-2 focus:ring-[#33b1e1]/50 focus:border-[#33b1e1] transition-all duration-200 pr-12"
            onChange={(e) => onSortChange(e.target.value)}
          >
            {metrics.map(({ value, label }) => (
              <option key={value} value={value} className="py-2">
                {label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <Wind size={20} />
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#33b1e1] to-[#8bc540] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <Menu size={20} />
          <span className="font-medium">Comparer</span>
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border-2 border-[#8bc540]/20"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Comparer les Villes
                </h2>
                <div
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {locations.map((location, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                      <MapPin size={18} />
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => handleLocationChange(index, e.target.value)}
                      placeholder={`Ville ${index + 1}`}
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#33b1e1]/50 focus:border-[#33b1e1] transition-all duration-200"
                    />
                    {locations.length > 1 && (
                      <div
                        onClick={() => handleRemoveLocation(index)}
                        className="absolute right-10 top-7 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X size={18} className="text-red-500 hover:text-red-600" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {locations.length < 5 && (
                <button
                  onClick={handleAddLocation}
                  className="w-full mb-8 px-6 py-4 bg-gradient-to-r from-[#33b1e1] to-[#8bc540] border-2 border-dashed border-[#8bc540]/30 rounded-xl text-gray-600 hover:border-[#33b1e1] hover:text-[#33b1e1] transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  <Plus
                    size={20}
                    className="transform group-hover:rotate-180 transition-transform duration-500"
                  />
                  <span className="font-medium">Ajouter une ville</span>
                </button>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading || locations.every((loc) => loc.trim() === '')}
                className="w-full mb-8 px-6 py-4 bg-gradient-to-r from-[#33b1e1] to-[#8bc540] border-2 border-dashed border-[#8bc540]/30 rounded-xl text-gray-600 hover:border-[#33b1e1] hover:text-[#33b1e1] transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Search size={20} />
                    </motion.div>
                    <span className="font-medium">Chargement...</span>
                  </div>
                ) : (
                  <span className="font-medium">Comparer les villes</span>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComparisonToolbar;
