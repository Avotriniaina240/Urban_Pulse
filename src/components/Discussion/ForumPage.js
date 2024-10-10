import React, { useState, useRef, useEffect } from 'react';
import { Search, MessageSquare, ThumbsUp, ArrowLeft, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/ATS/ForumPage.css';

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showNewPostPopup, setShowNewPostPopup] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/posts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const postsWithComments = await Promise.all(data.map(async (post) => {
            const commentsResponse = await fetch(`http://localhost:5000/api/posts/${post.id}/comments`);
            const comments = await commentsResponse.json();
            
            const postAuthorProfilePicture = localStorage.getItem(`userProfilePicture_${post.author_id}`) || null;
            
            return {
              ...post,
              likes: post.likes || 0,
              liked: post.user_liked,
              comments: comments.length,
              isExpanded: false,
              showCommentInput: false,
              commentList: await Promise.all(comments.map(async (comment) => {
                const commentAuthorProfilePicture = localStorage.getItem(`userProfilePicture_${comment.author_id}`) || null;
                return {
                  ...comment,
                  authorProfilePicture: commentAuthorProfilePicture
                };
              })),
              author: post.username,
              authorProfilePicture: postAuthorProfilePicture
            };
          }));
          setPosts(postsWithComments);
        } else {
          console.error('Échec de la récupération des publications:', response.statusText);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des publications:', error);
      }
    };
    
    fetchPosts();
  }, []);

  const toggleContent = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, isExpanded: !post.isExpanded } : post
    ));
  };
  
  const toggleCommentInput = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, showCommentInput: !post.showCommentInput } : { ...post, showCommentInput: false }
    ));
  };

  const handleAddComment = async (postId) => {
    if (newComment.trim() === '') return;
  
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || 'Auteur par défaut'; 
    const userProfilePicture = localStorage.getItem(`userProfilePicture_${userId}`) || null;
  
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          author_id: userId ? parseInt(userId, 10) : 1,
          author: username,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save comment: ${errorData.message}`);
      }
  
      const savedComment = await response.json();
  
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const updatedCommentList = [...post.commentList, {...savedComment, authorProfilePicture: userProfilePicture}];
          return {
            ...post,
            commentList: updatedCommentList,
            comments: post.comments + 1,
          };
        }
        return post;
      }));
  
      setNewComment('');
    } catch (error) {
      console.error('Error saving comment:', error.message);
    }
  };

  const handleLikePost = async (postId) => {
    const post = posts.find(p => p.id === postId);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ increment: !post.liked }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update likes: ${response.status}`);
      }
  
      const updatedPost = await response.json();
  
      setPosts((prevPosts) => 
        prevPosts.map((p) => 
          p.id === postId ? { ...p, likes: updatedPost.likes, liked: !p.liked } : p
        )
      );
  
    } catch (error) {
      console.error('Erreur:', error.message);
    }
  };

  const handleAddPost = async () => {
    if (newPost.title.trim() === '' || newPost.content.trim() === '') return;

    try {
      const userId = localStorage.getItem('userId'); 
      const username = localStorage.getItem('username');
      const userProfilePicture = localStorage.getItem(`userProfilePicture_${userId}`) || null;

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          author_id: userId ? parseInt(userId, 10) : 1,
        }),
      });

      if (response.ok) {
        const newPostData = await response.json();
        setPosts([...posts, {
          ...newPostData,
          author: username || "Auteur par défaut",
          authorProfilePicture: userProfilePicture,
          likes: 0,
          liked: false,
          comments: 0,
          isExpanded: false,
          showCommentInput: false,
          commentList: [],
        }]);
        setShowNewPostPopup(false);
        setNewPost({ title: '', content: '' });
      } else {
        console.error('Failed to add post:', response.statusText);
      }
    } catch (error) {
      console.error('Error while adding post:', error);
    }
  };

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
            <button onClick={handleAddPost}>Ajouter la discussion</button>
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
              <div className="post-content" onClick={() => toggleContent(post.id)}>
                <p>
                  {post.isExpanded ? post.content : "Cliquez pour voir le contenu complet..."}
                </p>
              </div>

              <div className="post-footer">
                <div className="post-likes" onClick={() => handleLikePost(post.id)}>
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
                <div className="post-comments" onClick={() => toggleCommentInput(post.id)}>
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
                    <button onClick={() => handleAddComment(post.id)}>Envoyer</button>
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