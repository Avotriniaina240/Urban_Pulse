export const fetchPosts = async (setPosts) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const postsWithComments = await Promise.all(data.map(async (post) => {
          const commentsResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/posts/${post.id}/comments`);
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
  
  export const toggleContent = (id, posts, setPosts) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, isExpanded: !post.isExpanded } : post
    ));
  };
  
  export const toggleCommentInput = (id, posts, setPosts) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, showCommentInput: !post.showCommentInput } : { ...post, showCommentInput: false }
    ));
  };
  
  export const handleAddComment = async (postId, newComment, posts, setPosts, setNewComment) => {
    if (newComment.trim() === '') return;
  
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || 'Auteur par défaut'; 
    const userProfilePicture = localStorage.getItem(`userProfilePicture_${userId}`) || null;
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/posts/${postId}/comments`, {
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
  
  export const handleLikePost = async (postId, posts, setPosts) => {
    const post = posts.find(p => p.id === postId);
    const token = localStorage.getItem('token');
    
    try {
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
  
  export const handleAddPost = async (newPost, posts, setPosts, setShowNewPostPopup, setNewPost) => {
    if (newPost.title.trim() === '' || newPost.content.trim() === '') return;
  
    try {
      const userId = localStorage.getItem('userId'); 
      const username = localStorage.getItem('username');
      const userProfilePicture = localStorage.getItem(`userProfilePicture_${userId}`) || null;
  
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/posts`, {
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