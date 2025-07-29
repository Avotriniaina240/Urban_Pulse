import React, { useState } from 'react';
import { AlertCircle, Loader2, TrendingUp, MapPin } from 'lucide-react';
import ComparisonToolbar from './ComparisonToolbar';
import { fetchDataForLocations } from '../../../services/comparisonService';
import { sortComparisonData } from '../../../utils/comparisonHelpers';

const ComparisonComponent = () => {
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('air_quality');

  const handleFetchData = async (locationsInput, coordinatesInput, neighborhoodsInput) => {
    setLoading(true);
    setError(null);
    try {
      const uniqueData = await fetchDataForLocations(locationsInput, coordinatesInput, neighborhoodsInput);
      setComparisonData(uniqueData || []);
    } catch (err) {
      setError('Erreur lors de la récupération des données.');
      setComparisonData([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedData = sortComparisonData(comparisonData, sortBy);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="space-y-6">
          {/* Configuration */}
          <div className="bg-white rounded-lg shadow border">
            <div className="bg-blue-600 px-4 py-3 rounded-t-lg">
              <h2 className="text-lg font-medium text-white flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Configuration
              </h2>
            </div>
            <div className="p-4">
              <ComparisonToolbar onFetchData={handleFetchData} onSortChange={setSortBy} />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow border p-8">
              <div className="flex items-center justify-center space-x-3">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <span className="text-gray-600">Chargement des données...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-white rounded-lg shadow border border-red-200 p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800">Erreur</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {!loading && !error && (
            <div className="bg-white rounded-lg shadow border">
              <div className="bg-green-600 px-4 py-3 rounded-t-lg">
                <h2 className="text-lg font-medium text-white flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Résultats
                </h2>
              </div>
              <div className="p-4">
                {/* Contenu des résultats à ajouter ici */}
              </div>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {comparisonData.length > 0 && !loading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-xl font-semibold text-blue-600">
                {comparisonData.length}
              </div>
              <div className="text-sm text-gray-600">Locations</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-xl font-semibold text-indigo-600">
                {sortBy.replace('_', ' ')}
              </div>
              <div className="text-sm text-gray-600">Tri actuel</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-xl font-semibold text-green-600">
                Terminé
              </div>
              <div className="text-sm text-gray-600">Statut</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonComponent;