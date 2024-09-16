import React, { useState } from 'react';
import ComparisonToolbar from './ComparisonToolbar';
import ComparisonResults from './ComparisonResults';
import { fetchDataForLocations } from '../../services/comparisonService';
import { sortComparisonData } from '../../utils/comparisonHelpers';

const ComparisonComponent = () => {
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('air_quality');

  const handleFetchData = async (locationsInput, coordinatesInput, neighborhoodsInput) => {
    console.log('Fetching data for:', { locationsInput, coordinatesInput, neighborhoodsInput });
    setLoading(true);
    setError(null);
    try {
      const uniqueData = await fetchDataForLocations(locationsInput, coordinatesInput, neighborhoodsInput);
      console.log('Fetched data:', uniqueData);
      setComparisonData(uniqueData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Une erreur est survenue lors de la récupération des données.');
      setComparisonData([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedData = sortComparisonData(comparisonData, sortBy);
  console.log('Sorted data:', sortedData);

  return (
    <>
      <ComparisonToolbar onFetchData={handleFetchData} onSortChange={setSortBy} />
      {loading && <p>Chargement des données...</p>}
      {error && <p>{error}</p>}
      <ComparisonResults data={sortedData} sortBy={sortBy} />
    </>
  );
};

export default ComparisonComponent;