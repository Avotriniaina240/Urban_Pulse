import React, { useState } from 'react';
import '../styles/ATS/DiscussionDetail.css'; // You can style your component here

function DiscussionDetail({ discussion }) {
  const [comments, setComments] = useState(discussion.comments || []);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment && username) {
      const updatedComments = [
        ...comments,
        { id: comments.length + 1, text: newComment, username: username },
      ];
      setComments(updatedComments);
      setNewComment('');
      setUsername('');
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
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Votre nom"
            required
          />
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
