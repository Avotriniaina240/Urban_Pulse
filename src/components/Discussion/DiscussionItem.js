import React from 'react';

const DiscussionItem = ({ discussion }) => {
  return (
    <div className="discussion-item">
      <h3>{discussion.title}</h3>
      <p>Par : {discussion.author}</p>
      <p>Réponses : {discussion.replies} | Vues : {discussion.views}</p>
      <p>Dernier message par : {discussion.lastMessage}</p>
    </div>
  );
};

export default DiscussionItem;
