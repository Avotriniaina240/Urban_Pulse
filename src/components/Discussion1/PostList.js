import React from 'react';
import PostCard from './PostCard';

const PostList = ({ posts, setPosts, searchTerm }) => {
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="post-list">
      {posts.length > 0 ? (
        filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} setPosts={setPosts} />
          ))
        ) : (
          <p>Aucun résultat trouvé pour "{searchTerm}".</p>
        )
      ) : (
        <p>Aucun post disponible pour le moment.</p>
      )}
    </div>
  );
};

export default PostList;