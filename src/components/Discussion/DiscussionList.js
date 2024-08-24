import React from 'react';

function DiscussionList({ discussions, onSelectDiscussion }) {
  if (!discussions) {
    return <p>Loading discussions...</p>;
  }

  return (
    <div className="discussion-list">
      {discussions.map(discussion => (
        <div
          key={discussion.id}
          onClick={() => onSelectDiscussion(discussion)}
          className="discussion-item"
        >
          <h3>{discussion.title}</h3>
          <p>{discussion.description}</p>
        </div>
      ))}
    </div>
  );
}

export default DiscussionList;
