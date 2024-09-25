import React, { useState } from 'react';
import { Search, MessageSquare, ThumbsUp, User } from 'lucide-react';
import '../styles/ATS/ForumPage.css';

const ForumPage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1, 
      title: "Développement durable dans les villes modernes", 
      author: "EcoUrbaniste", 
      likes: 15, 
      liked: false,
      comments: 7,
      content: "Le développement durable est essentiel dans les villes modernes pour réduire l'empreinte écologique, améliorer la qualité de vie et garantir un avenir prospère pour les générations futures.",
      isExpanded: false,
      showCommentInput: false,
      commentList: []
    },
    // autres posts...
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false); // État pour contrôler l'affichage du formulaire
  const [newPost, setNewPost] = useState({ title: '', author: '', content: '' }); // État pour le nouveau post

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

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedLikes = post.liked ? post.likes - 1 : post.likes + 1;
        return { 
          ...post, 
          likes: updatedLikes, 
          liked: !post.liked 
        };
      }
      return post;
    }));
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour ajouter un nouveau post
  const handleAddPost = () => {
    if (newPost.title.trim() === '' || newPost.content.trim() === '') return;

    const newPostData = {
      id: posts.length + 1,
      title: newPost.title,
      author: newPost.author,
      likes: 0,
      liked: false,
      comments: 0,
      content: newPost.content,
      isExpanded: false,
      showCommentInput: false,
      commentList: []
    };

    setPosts([...posts, newPostData]);
    setShowNewPostForm(false); // Fermer le formulaire
    setNewPost({ title: '', author: '', content: '' }); // Réinitialiser le nouvel post
  };

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
          onClick={() => setShowNewPostForm(!showNewPostForm)} // Toggle pour afficher le formulaire
        >
          Nouvelle Discussion
        </button>
      </div>

      {/* Formulaire de nouvelle discussion */}
      {showNewPostForm && (
        <div className="new-post-form">
          <input 
            type="text" 
            placeholder="Titre" 
            value={newPost.title} 
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} 
          />
          <input 
            type="text" 
            placeholder="Auteur" 
            value={newPost.author} 
            onChange={(e) => setNewPost({ ...newPost, author: e.target.value })} 
          />
          <textarea 
            placeholder="Contenu" 
            value={newPost.content} 
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} 
          />
          <button onClick={handleAddPost}>Ajouter la discussion</button>
        </div>
      )}

      <div className="post-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className="post-card">
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
                        <p key={index} className="comment">{comment}</p>
                      ))}
                    </div>
                  )}

                  <div className="add-comment-section">
                    <input 
                      type="text" 
                      placeholder="Ajouter un commentaire..." 
                      value={newComment} 
                      onChange={(e) => setNewComment(e.target.value)} 
                      className="comment-input" 
                    />
                    <button 
                      onClick={() => handleAddComment(post.id)} 
                      className="add-comment-btn"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Aucun résultat trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
