import { useState } from 'react';

const usePostCard = (post, setPosts) => {
  const [newComment, setNewComment] = useState('');

  const toggleContent = (id) => {
    setPosts(prevPosts => prevPosts.map(p => 
      p.id === id ? { ...p, isExpanded: !p.isExpanded } : p
    ));
  };

  const toggleCommentInput = (id) => {
    setPosts(prevPosts => prevPosts.map(p => 
      p.id === id ? { ...p, showCommentInput: !p.showCommentInput } : p
    ));
  };

  const handleLikePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/posts/${postId}/like`, {
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

  const handleAddComment = async (postId) => {
    if (newComment.trim() === '') return;
  
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || 'Auteur par défaut'; 
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
  
      setPosts(prevPosts => prevPosts.map(p => {
        if (p.id === postId) {
          const updatedCommentList = [...p.commentList, savedComment];
          return {
            ...p,
            commentList: updatedCommentList,
            comments: p.comments + 1,
          };
        }
        return p;
      }));
  
      setNewComment('');
    } catch (error) {
      console.error('Error saving comment:', error.message);
    }
  };

  return {
    toggleContent,
    toggleCommentInput,
    handleLikePost,
    handleAddComment,
    newComment,
    setNewComment,
  };
};

export default usePostCard;