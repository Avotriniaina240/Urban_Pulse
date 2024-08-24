import React from 'react';
import '../styles/ATS/DiscussionItem.css';

function DiscussionItem({ discussion }) {
  return (
    <div className="discussion-item">
      <h2>{discussion.title}</h2>
      <p>{discussion.commentCount} Comments</p>
      <span>Last activity: {discussion.lastActivity}</span>
    </div>
  );
}

export default DiscussionItem;
