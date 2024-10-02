import React from 'react';
import { X } from 'lucide-react';

const NewPostPopup = ({ newPost, setNewPost, handleAddPost, setShowNewPostPopup, popupRef }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content" ref={popupRef}>
        <button className="close-popup" onClick={() => setShowNewPostPopup(false)}>
          <X size={24} />
        </button>
        <h2>Nouvelle Discussion</h2>
        <input 
          type="text" 
          placeholder="Titre" 
          value={newPost.title} 
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} 
        />
        <textarea 
          placeholder="Contenu" 
          value={newPost.content} 
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} 
        />
        <button onClick={handleAddPost}>Ajouter la discussion</button>
      </div>
    </div>
  );
};

export default NewPostPopup;