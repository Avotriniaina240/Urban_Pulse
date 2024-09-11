import React, { useState, useEffect } from 'react';
import '../styles/ATS/DiscussionDetail.css';
import { FaComment, FaSmile } from 'react-icons/fa';

function DiscussionDetail({ discussion }) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [emojiReaction, setEmojiReaction] = useState('😊');
  const [isEmojiPopupOpen, setIsEmojiPopupOpen] = useState(false);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);

  // Fonction pour charger les commentaires depuis le serveur
  const fetchCommentsFromServer = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/discussions/${discussion.id}/comments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (!response.ok) throw new Error('Erreur lors du chargement des commentaires');
      
      const data = await response.json();
      setComments(data.comments); // Mettre à jour les commentaires avec ceux du serveur

      // Optionnel: Sauvegarder dans le localStorage
      localStorage.setItem(`comments-${discussion.id}`, JSON.stringify(data.comments));
    } catch (error) {
      console.error(error.message);
    }
  };

  // Charger les commentaires lors du montage du composant
  useEffect(() => {
    fetchCommentsFromServer();  // Charger les commentaires depuis le serveur
  }, [discussion]);

  // Gestion de la soumission d'un commentaire
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment) {
      const isDuplicate = comments.some(comment => comment.text === newComment);
      if (isDuplicate) {
        console.error('Le commentaire est déjà présent.');
        return;
      }

      try {
        console.log('Token:', localStorage.getItem('token'));
        const response = await fetch('http://localhost:5000/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            discussionId: discussion.id,
            text: newComment
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || 'Erreur lors de l\'ajout du commentaire');
        }

        const data = await response.json();
        console.log('Data from server:', data);
        setComments([...comments, data.comment]); // Ajouter le nouveau commentaire à la liste des commentaires
        setNewComment('');
        setIsCommentPopupOpen(false);
      } catch (error) {
        console.error('Erreur:', error.message);
        alert(`Erreur: ${error.message}`);
      }
    }
  };

  // Gestion de la réaction emoji
  const handleEmojiReaction = (emoji) => {
    setEmojiReaction(emoji);
    setIsEmojiPopupOpen(false);
  };

  return (
    <div className="discussion-detail">
      <h2>{discussion.title}</h2>
      <p>{discussion.description}</p>
      <div className="comments">
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              {comment.text}
            </li>
          ))}
        </ul>
        <button className='comment-icon' onClick={() => setIsCommentPopupOpen(!isCommentPopupOpen)}>
          <FaComment className="blue-comment-icon" />
        </button>
        {isCommentPopupOpen && (
          <div className="comment-popup">
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                required
              />
              <button className='btn-dt' type="submit">Envoyer Commentaire</button>
            </form>
          </div>
        )}
      </div>
      <div className="discussion-reactions">
        <button onClick={() => setIsEmojiPopupOpen(!isEmojiPopupOpen)} className="emoji-button">
          <FaSmile /> {emojiReaction}
        </button>
        {isEmojiPopupOpen && (
          <div className="emoji-popup">
            {['😊','😢','😂'].map(emoji => (
              <button key={emoji} onClick={() => handleEmojiReaction(emoji)} className="emoji-option">
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DiscussionDetail;
