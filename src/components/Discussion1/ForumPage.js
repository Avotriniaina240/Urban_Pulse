import React from 'react';
import { Search } from 'lucide-react';
import PostList from './PostList';
import NewPostPopup from './NewPostPopup';
import useForumLogic from '../../hooks/useForumLogic';
import '../../styles/ForumPage.css';

const ForumPage = () => {
  const {
    posts,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    showNewPostPopup,
    setShowNewPostPopup,
    newPost,
    setNewPost,
    handleAddPost,
    popupRef,
  } = useForumLogic();

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

      {showNewPostPopup && (
        <NewPostPopup
          newPost={newPost}
          setNewPost={setNewPost}
          handleAddPost={handleAddPost}
          setShowNewPostPopup={setShowNewPostPopup}
          popupRef={popupRef}
        />
      )}

      {isLoading ? (
        <p>Chargement des posts...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <PostList posts={posts} searchTerm={searchTerm} />
      )}
    </div>
  );
};

export default ForumPage;