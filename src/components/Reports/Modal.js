import React from 'react';
import { X, Calendar, MapPin, AlertCircle, BarChart2 } from 'lucide-react';

const Modal = ({ isOpen, onClose, reportDetails }) => {
  if (!isOpen || !reportDetails) return null;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'complété':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'en cours':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform rounded-xl bg-white shadow-2xl transition-all duration-300">
          {/* En-tête */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Détails du Rapport
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Référence: #{reportDetails.id || '001'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Corps du modal */}
          <div className="p-6">
            {/* Status Badge */}
            <div className="mb-6 flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <span className="text-sm font-medium text-gray-700">Status actuel</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(reportDetails.status)}`}>
                {reportDetails.status}
              </span>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description Card */}
              <div className="bg-gray-50 rounded-xl p-4 transition-all hover:shadow-md">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Description</h3>
                    <p className="mt-1 text-sm text-gray-500">{reportDetails.description}</p>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-gray-50 rounded-xl p-4 transition-all hover:shadow-md">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Localisation</h3>
                    <p className="mt-1 text-sm text-gray-500">{reportDetails.location}</p>
                  </div>
                </div>
              </div>

              {/* Date Card */}
              <div className="bg-gray-50 rounded-xl p-4 transition-all hover:shadow-md">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Date</h3>
                    <p className="mt-1 text-sm text-gray-500">{reportDetails.date}</p>
                  </div>
                </div>
              </div>

              {/* Priority Card */}
              <div className="bg-gray-50 rounded-xl p-4 transition-all hover:shadow-md">
                <div className="flex items-start space-x-3">
                  <BarChart2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Priorité</h3>
                    <p className="mt-1 text-sm text-gray-500">{reportDetails.priority}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            {reportDetails.additionalInfo && (
              <div className="mt-6 bg-blue-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-blue-900">Informations supplémentaires</h3>
                <p className="mt-1 text-sm text-blue-700">{reportDetails.additionalInfo}</p>
              </div>
            )}
          </div>

          {/* Pied du modal */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;