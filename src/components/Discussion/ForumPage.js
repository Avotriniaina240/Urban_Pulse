import React, { useState, useRef, useEffect } from 'react';
import { Search, MessageSquare, ThumbsUp, ArrowLeft, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/ATS/ForumPage.css';
import {
  fetchPosts,
  toggleContent,
  toggleCommentInput,
  handleAddComment,
  handleLikePost,
  handleAddPost
} from './ForumUtilities';

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showNewPostPopup, setShowNewPostPopup] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts(setPosts);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowNewPostPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredPosts = posts.filter(post => 
    (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (post.author && post.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="forum-container">
      <h1 className="forum-title">Forum de Discussion</h1>
      <button className="button-retour-forum" onClick={() => navigate(-1)}>
        <ArrowLeft size={10} />
        Retour
      </button>
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Rechercher des discussions..." 
          className="search-input" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className="new-discussion-btn" 
          onClick={() => setShowNewPostPopup(true)}
        >
          Nouvelle Discussion
        </button>
      </div>

      {showNewPostPopup && (
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
            <button onClick={() => handleAddPost(newPost, posts, setPosts, setShowNewPostPopup, setNewPost)}>Ajouter la discussion</button>
          </div>
        </div>
      )}

      <div className="post-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <motion.div 
              key={index} 
              className="post-card"
              animate={{ 
                height: post.showCommentInput ? 'auto' : 'fit-content',
                transition: { duration: 0.3 }
              }}
            >
              <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
                <div className="post-author">
                  {post.authorProfilePicture ? (
                    <img src={post.authorProfilePicture} alt={post.author} className="author-profile-picture" />
                  ) : (
                    <User className="author-icon" />
                  )}
                  <span>{post.author}</span>
                </div>
              </div>
              <div className="post-content" onClick={() => toggleContent(post.id, posts, setPosts)}>
                <p>
                  {post.isExpanded ? post.content : "Cliquez pour voir le contenu complet..."}
                </p>
              </div>

              <div className="post-footer">
                <div className="post-likes" onClick={() => handleLikePost(post.id, posts, setPosts)}>
                  <ThumbsUp 
                    className="like-icon" 
                    style={{ color: post.likes > 0 ? 'blue' : 'black' }}
                  />
                  {post.likes ? (
                    <span>{post.likes} J'aime</span>
                  ) : (
                    <span>J'aime</span>
                  )}
                </div>
                <div className="post-comments" onClick={() => toggleCommentInput(post.id, posts, setPosts)}>
                  <MessageSquare className="comment-icon" />
                  <span>{post.comments} Commentaires</span>
                </div>
              </div>

              <AnimatePresence>
                {post.showCommentInput && (
                  <motion.div 
                    className="comments-section"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="comments-list">
                      {post.commentList.map((comment, index) => (
                        <div key={`${index}-${comment.content}`} className="comment">
                          {comment.authorProfilePicture ? (
                            <img src={comment.authorProfilePicture} alt={comment.author} className="comment-author-profile-picture" />
                          ) : (
                            <User className="comment-author-icon" />
                          )}
                          <strong>{comment.author || 'Anonyme'} :</strong> {comment.content}
                        </div>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      placeholder="Ajouter un commentaire..." 
                      value={newComment} 
                      onChange={(e) => setNewComment(e.target.value)} 
                    />
                    <button onClick={() => handleAddComment(post.id, newComment, posts, setPosts, setNewComment)}>Envoyer</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <p>Aucun résultat trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default ForumPage;