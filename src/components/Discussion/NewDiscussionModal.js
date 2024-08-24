import React, { useState } from 'react';
import '../styles/ATS/NewDiscussionModal.css'; // You can style your modal here

function NewDiscussionModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && description) {
      onSubmit({ title, description });
      setTitle('');
      setDescription('');
      onClose();
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
          <button className= 'btn-new' type="submit">Créer Discussion</button>
          <button className= 'btn-new' type="button" onClick={onClose}>Annuler</button>
        </form>
      </div>
    </div>
  );
}

export default NewDiscussionModal;
