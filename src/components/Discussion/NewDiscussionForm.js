import React, { useState } from 'react';

const NewDiscussionForm = () => {
  const [title, setTitle] = useState('Titre fictif'); // Valeur fictive pour le titre
  const [description, setDescription] = useState('Description fictive de la discussion.'); // Valeur fictive pour la description
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs
    if (!title || !description) {
      setError('Tous les champs sont obligatoires');
      console.log('Validation échouée : tous les champs doivent être remplis.');
      return;
    }

    // Réinitialiser l'erreur
    setError('');
    setSuccess('');

    // Logique pour envoyer les données
    try {
      console.log('Envoi des données :', { title, description });
      const response = await fetch('http://localhost:5000/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la discussion');
      }

      const newDiscussion = await response.json();
      console.log('Nouvelle discussion créée :', newDiscussion);

      // Réinitialiser le formulaire après soumission
      setTitle('');
      setDescription('');
      setSuccess('Discussion créée avec succès !');
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la création de la discussion :', err);
    }
  };

  return (
    <form className="new-discussion-form" onSubmit={handleSubmit}>
      <h2>Nouvelle discussion</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Créer</button>
    </form>
  );
};

export default NewDiscussionForm;
