import React, { useState, useEffect } from 'react';
import '../styles/ATS/DiscussionDetail.css';
import { getUser } from '../Analyse/utilis'; // Assurez-vous que le chemin est correct

function DiscussionDetail({ discussion }) {
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fonction pour charger les commentaires depuis le local storage ou initialiser à partir de la discussion
    const loadComments = () => {
      const storedComments = localStorage.getItem(`comments-${discussion.id}`);
      return storedComments ? JSON.parse(storedComments) : discussion.comments || [];
    };

    setComments(loadComments());
  }, [discussion]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const user = await getUser();
        setUsername(user.username);
      } catch (error) {
        console.error('Erreur lors de la récupération du nom d\'utilisateur:', error);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    // Enregistrer les commentaires dans le local storage lorsque les commentaires changent
    localStorage.setItem(`comments-${discussion.id}`, JSON.stringify(comments));
  }, [comments, discussion.id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment && username) {
      // Vérifier les doublons
      const isDuplicate = comments.some(comment => comment.text === newComment && comment.username === username);
      if (isDuplicate) {
        console.error('Le commentaire est déjà présent.');
        return;
      }
      const updatedComments = [
        ...comments,
        { id: comments.length + 1, text: newComment, username },
      ];
      setComments(updatedComments);
      setNewComment('');
    }
  };

  return (
    <div className="discussion-detail">
      <h2>{discussion.title}</h2>
      <p>{discussion.description}</p>
      <div className="comments">
        <h3>Commentaires</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.username}:</strong> {comment.text}
            </li>
          ))}
        </ul>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            required
          />
          <button className='btn-dt' type="submit">Ajouter Commentaire</button>
        </form>
      </div>
    </div>
  );
}

export default DiscussionDetail;
