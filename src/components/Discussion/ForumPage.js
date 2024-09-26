import React, { useState, useRef, useEffect } from 'react';
import { Search, MessageSquare, ThumbsUp, User, X } from 'lucide-react';
import '../styles/ATS/ForumPage.css';

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showNewPostPopup, setShowNewPostPopup] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const popupRef = useRef(null);

  // Récupérer les posts lors du premier rendu
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.map(post => ({
            ...post,
            likes: post.likes || 0, // S'assurer que les likes sont définis
            liked: false,
            comments: post.comments || 0,
            isExpanded: false,
            showCommentInput: false,
            commentList: [],
            author: post.username // Utiliser le nom d'utilisateur récupéré
          })));
        } else {
          console.error('Failed to fetch posts:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
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
      post.id === id ? { ...post, showCommentInput: !post.showCommentInput } : post
    ));
  };

  const handleAddComment = (postId) => {
    if (newComment.trim() === '') return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedCommentList = [...post.commentList, newComment];
        return { 
          ...post, 
          commentList: updatedCommentList, 
          comments: post.comments + 1 
        };
      }
      return post;
    }));

    setNewComment('');
  };

  const handleLikePost = async (postId) => {
    const post = posts.find(p => p.id === postId); 
    const newLikes = post.liked ? post.likes - 1 : post.likes + 1;

    console.log("Tentative de mise à jour des likes pour le post ID:", postId);
    console.log("Nouveaux likes:", newLikes);

    try {
        const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            // Envoyer un booléen au lieu de likes
            body: JSON.stringify({ increment: !post.liked }), // true si on aime, false sinon
        });

        if (!response.ok) {
            throw new Error(`Failed to update likes: ${response.status}`);
        }

        const updatedPost = await response.json();

        setPosts((prevPosts) => 
            prevPosts.map((p) => 
                p.id === postId ? { ...p, likes: updatedPost.likes, liked: !post.liked } : p
            )
        );

    } catch (error) {
        console.error('Erreur:', error.message);
    }
};


  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPost = async () => {
    if (newPost.title.trim() === '' || newPost.content.trim() === '') return;

    try {
      const userId = localStorage.getItem('userId'); 
      const username = localStorage.getItem('username');

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
        const newPostData = {
          id: posts.length + 1, // Génération d'un ID fictif
          title: newPost.title,
          author: username || "Auteur par défaut", // Utiliser le nom de l'utilisateur
          likes: 0,
          liked: false,
          comments: 0,
          content: newPost.content,
          isExpanded: false,
          showCommentInput: false,
          commentList: [],
        };

        setPosts([...posts, newPostData]);
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

  return (
    <div className="forum-container">
      <h1 className="forum-title">Forum de Discussion</h1>
      
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

      {/* Popup pour nouvelle discussion */}
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
            <div key={index} className="post-card">
              <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
                <div className="post-author">
                  <User className="author-icon" />
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
                  <ThumbsUp className="like-icon" style={{ color: post.liked ? 'blue' : 'black' }} />
                  <span>{post.likes} J'aime</span>
                </div>
                <div className="post-comments" onClick={() => toggleCommentInput(post.id)}>
                  <MessageSquare className="comment-icon" />
                  <span>{post.comments} Commentaires</span>
                </div>
              </div>

              {post.showCommentInput && (
                <div className="comments-section">
                  {post.commentList.length > 0 && (
                    <div className="comments-list">
                      {post.commentList.map((comment, index) => (
                        <p key={`${index}-${comment}`} className="comment">{comment}</p>
                      ))}
                    </div>
                  )}

                  <div className="add-comment-section">
                    <input 
                      type="text" 
                      placeholder="Ajouter un commentaire..." 
                      value={newComment} 
                      onChange={(e) => setNewComment(e.target.value)} 
                    />
                    <button onClick={() => handleAddComment(post.id)} className='btn-fr'>Envoyer</button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Aucune discussion trouvée.</p>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
