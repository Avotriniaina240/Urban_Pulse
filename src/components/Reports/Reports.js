import React, { useState } from 'react';
import { Upload, MapPin, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../layouts/Navbar/Navbar';
import Sidebar from '../layouts/Sidebar/SidebarCarte';
import { jwtDecode } from 'jwt-decode';

const Reports = () => {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    image: null,
    status: 'soumis'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  // Fonction de validation des champs
  const validateForm = () => {
    const errors = {};
    if (!formData.description.trim()) {
      errors.description = 'La description est requise';
    }
    if (!formData.location.trim()) {
      errors.location = 'La localisation est requise';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur de validation lorsque l'utilisateur commence à taper
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vous devez être connecté pour soumettre un signalement');
      }

      const { id: userId } = jwtDecode(token);
      const submitData = new FormData();

      // Ajout des données au FormData
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });
      submitData.append('user_id', userId);

      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la soumission');
      }

      const result = await response.json();
      
      toast.success('Signalement soumis avec succès !');
      
      // Réinitialisation du formulaire
      setFormData({
        description: '',
        location: '',
        image: null,
        status: 'soumis'
      });
      setImagePreview(null);
      setCurrentStep(1);
      
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <Sidebar />
      
      <div className="lg:pl-64">
        {/* Indicateur d'étapes */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${currentStep === step ? 'bg-[#33b1e1] text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {step}
                </div>
                {step < steps.length && (
                  <div className="w-16 h-0.5 bg-gray-200 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Nouveau Signalement
            </h2>
            
            {error && (
              <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez le problème en détail..."
                  className={`w-full h-32 px-3 py-2 border rounded-md resize-none
                    ${validationErrors.description 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-[#33b1e1]'}
                    focus:outline-none focus:ring-2`}
                  required
                />
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Adresse ou lieu du signalement"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md
                      ${validationErrors.location 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-[#33b1e1]'}
                      focus:outline-none focus:ring-2`}
                    required
                  />
                  {validationErrors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.location}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 
                              border-dashed rounded-lg hover:border-[#33b1e1] transition-colors">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-auto object-cover rounded"
                      />
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium 
                                      text-[#33b1e1] hover:text-[#2990b8] focus-within:outline-none">
                        <span>Télécharger une image</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG jusqu'à 5MB
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center px-4 py-3 
                          bg-gradient-to-r from-[#33b1e1] to-[#8bc540] text-white 
                          hover:opacity-90 font-medium rounded-md focus:outline-none 
                          focus:ring-2 focus:ring-offset-2 focus:ring-[#33b1e1] 
                          transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5 mr-2" />
                {loading ? 'Envoi en cours...' : 'Soumettre le signalement'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;