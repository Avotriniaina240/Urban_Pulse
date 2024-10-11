export const getUser = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users`); // Utilisation de la variable d'environnement
    
    if (!response.ok) {
      // Afficher le code de statut HTTP et le texte pour déboguer
      const errorText = await response.text();
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    // Supposons que la réponse contient un tableau d'utilisateurs
    // Vous devrez peut-être adapter cela en fonction de la structure de la réponse de votre API
    if (data.length > 0) {
      // Supposons que l'utilisateur connecté est le premier dans la liste
      return data[0]; 
    } else {
      throw new Error('Aucun utilisateur trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    throw error; // Relance l'erreur pour que l'appelant puisse la gérer
  }
};