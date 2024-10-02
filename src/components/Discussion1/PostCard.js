import React from 'react';
import { MessageSquare, ThumbsUp, User } from 'lucide-react';
import usePostCard from '../../hooks/usePostCard';

const PostCard = ({ post, setPosts }) => {
  const {
    toggleContent,
    toggleCommentInput,
    handleLikePost,
    handleAddComment,
    newComment,
    setNewComment,
  } = usePostCard(post, setPosts);

  return (
    <div className="post-card">
      <div className="post-header">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-author">
          <User className="author-icon" />
          <span>{post.author}</span>
        </div>
      </div>
      <div className="post-content" onClick={() => toggleContent(post.id)}>
        <p>
          {post.isExpanded ? post.content : `${post.content.slice(0, 100)}...`}
        </p>
      </div>

      <div className="post-footer">
        <div className="post-likes" onClick={() => handleLikePost(post.id)}>
          <ThumbsUp 
            className="like-icon" 
            style={{ color: post.liked ? 'blue' : 'black' }}
          />
          <span>{post.likes} J'aime</span>
        </div>
        <div className="post-comments" onClick={() => toggleCommentInput(post.id)}>
          <MessageSquare className="comment-icon" />
          <span>{post.comments} Commentaires</span>
        </div>
      </div>

      {post.showCommentInput && (
        <div className="comments-section">
          <div className="comments-list">
            {post.commentList.map((comment, index) => (
              <p key={`${comment.id || index}-${comment.content}`} className="comment">
                <strong>{comment.author || 'Anonyme'} :</strong> {comment.content}
              </p>
            ))}
          </div>
          <input 
            type="text" 
            placeholder="Ajouter un commentaire..." 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
          />
          <button onClick={() => handleAddComment(post.id)}>Envoyer</button>
        </div>
      )}
    </div>
  );
};

export default PostCard;