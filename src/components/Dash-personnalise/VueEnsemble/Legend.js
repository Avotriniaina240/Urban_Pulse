import React from 'react';
import '../../styles/Admin/VueEnsemble.css';

const Legend = ({ stats, chartType }) => {
  return (
    <div className="chart-legend">
      <h3>Légende détaillée</h3>
      <p>Ce graphique représente la répartition des utilisateurs par catégorie.</p>
      <ul>
        <li><span style={{color: 'rgba(75, 192, 192, 0.6)'}}>■</span> Citoyens: {stats.citizenCount} ({((stats.citizenCount / stats.totalUsers) * 100).toFixed(2)}%)</li>
        <li><span style={{color: 'rgba(255, 99, 132, 0.6)'}}>■</span> Administrateurs: {stats.adminCount} ({((stats.adminCount / stats.totalUsers) * 100).toFixed(2)}%)</li>
        <li><span style={{color: 'rgba(54, 162, 235, 0.6)'}}>■</span> Urbanistes: {stats.urbanistCount} ({((stats.urbanistCount / stats.totalUsers) * 100).toFixed(2)}%)</li>
      </ul>
      <p>Total des utilisateurs: {stats.totalUsers}</p>
      <p>Type de graphique actuel: {chartType === 'bar' ? 'Histogramme' : 'Courbe'}</p>
      {chartType === 'bar' ? (
        <p>L'histogramme permet de comparer facilement les quantités entre les différentes catégories.</p>
      ) : (
        <p>La courbe met en évidence la tendance et la progression entre les catégories.</p>
      )}
    </div>
  );
};

export default Legend;
