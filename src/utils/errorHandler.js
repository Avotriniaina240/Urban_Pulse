export const handleError = (error) => {
    if (error.response) {
      return error.response.data.message || 'Échec de la connexion.';
    } else if (error.request) {
      return 'Aucune réponse du serveur.';
    } else {
      return 'Erreur de configuration de la requête.';
    }
  };