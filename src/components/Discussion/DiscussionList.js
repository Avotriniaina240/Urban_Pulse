import React from 'react';

const DiscussionList = ({ discussions }) => {
  return (
    <div className="discussion-list">
      <h2>Liste des Discussions</h2>
      {discussions.map((discussion) => (
        <div key={discussion.id} className="discussion-item">
          <h3>{discussion.title}</h3>
          <p>{discussion.description}</p>
          <small>Créé le : {discussion.createdAt}</small>
        </div>
      ))}
    </div>
  );
};

export default DiscussionList;
