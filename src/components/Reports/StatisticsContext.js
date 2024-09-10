import React, { createContext, useContext, useState } from 'react';

// Créez le contexte
const StatisticsContext = createContext();

// Créez un fournisseur de contexte
export const StatisticsProvider = ({ children }) => {
  const [statistics, setStatistics] = useState({
    totalReports: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0,
  });

  return (
    <StatisticsContext.Provider value={{ statistics, setStatistics }}>
      {children}
    </StatisticsContext.Provider>
  );
};

// Utilisez ce hook pour accéder au contexte
export const useStatistics = () => useContext(StatisticsContext);
