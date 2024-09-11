import React, { useState } from 'react';
import '../styles/ATS/NewDiscussionModal.css'; // Vous pouvez styliser votre modal ici

function NewDiscussionModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title && description) {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:5000/api/discussions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description }),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || 'Erreur lors de la création de la discussion');
        }

        const data = await response.json();
        onSubmit(data); // Fonction pour actualiser la liste des discussions après la création
        setTitle('');
        setDescription('');
        onClose(); // Fermer la modal après le succès
      } catch (error) {
        console.error('Erreur:', error.message);
        setError(`Erreur: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Veuillez remplir tous les champs');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Nouvelle Discussion</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className='btn-new' type="submit" disabled={loading}>
            {loading ? 'Envoi...' : 'Créer Discussion'}
          </button>
          <button className='btn-new' type="button" onClick={onClose}>
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewDiscussionModal;
