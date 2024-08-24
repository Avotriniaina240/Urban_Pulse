import React from 'react';
import '../styles/ATS/ForumHeader.css';

function ForumHeader({ onNewDiscussion }) {
  return (
    <div className="forum-header">
      <h1>Citizen Initiatives Forum</h1>
      <button onClick={onNewDiscussion} className="new-discussion-btn">
        Start New Discussion
      </button>
    </div>
  );
}

export default ForumHeader;
