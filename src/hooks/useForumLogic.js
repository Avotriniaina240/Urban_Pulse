import { useState, useRef, useEffect } from 'react';

const useForumLogic = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostPopup, setShowNewPostPopup] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const popupRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/posts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        const postsWithComments = await Promise.all(data.map(async (post) => {
          const commentsResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/posts/${post.id}/comments`);
          const comments = await commentsResponse.json();
          return {
            ...post,
            likes: post.likes || 0,
            liked: post.user_liked,
            comments: comments.length,
            isExpanded: false,
            showCommentInput: false,
            commentList: comments,
            author: post.username,
          };
        }));
        console.log('Posts with comments:', postsWithComments);
        setPosts(postsWithComments);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const handleAddPost = async () => {
    if (newPost.title.trim() === '' || newPost.content.trim() === '') return;

    try {
      const userId = localStorage.getItem('userId'); 
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          author_id: userId ? parseInt(userId, 10) : 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newPostData = await response.json();
      setPosts([...posts, {
        ...newPostData,
        author: username || "Auteur par défaut",
        likes: 0,
        liked: false,
        comments: 0,
        isExpanded: false,
        showCommentInput: false,
        commentList: [],
      }]);
      setShowNewPostPopup(false);
      setNewPost({ title: '', content: '' });
    } catch (error) {
      console.error('Error while adding post:', error);
      setError('Failed to add new post. Please try again later.');
    }
  };

  return {
    posts,
    setPosts,
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
  };
};

export default useForumLogic;