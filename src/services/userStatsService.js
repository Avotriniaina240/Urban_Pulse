const fetchUserStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user-stats`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données : ' + response.status);
      }
      const data = await response.json();
      if (!data.citizen_count || !data.admin_count || !data.urbanist_count || !data.total_users) {
        throw new Error('Données manquantes ou incorrectes.');
      }
      return {
        citizenCount: data.citizen_count,
        adminCount: data.admin_count,
        urbanistCount: data.urbanist_count,
        totalUsers: data.total_users,
      };
    } catch (err) {
      throw new Error(err.message || 'Erreur inconnue lors de la récupération des données.');
    }
  };
  
  export { fetchUserStats };
  