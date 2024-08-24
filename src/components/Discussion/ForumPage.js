import React, { useState } from 'react';
import ForumHeader from './ForumHeader';
import DiscussionList from './DiscussionList';
import DiscussionDetail from './DiscussionDetail';
import NewDiscussionModal from './NewDiscussionModal'; 
import '../styles/ATS/ForumPage.css';

function ForumPage() {
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [discussions, setDiscussions] = useState([
    { id: 1, title: 'Énergie durable', description: 'Discussion sur les sources d\'énergie durable.', comments: [] },
    { id: 2, title: 'Transport urbain', description: 'Discussion sur l\'amélioration des transports en commun.', comments: [] },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewDiscussion = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = (newDiscussion) => {
    setDiscussions([...discussions, { id: discussions.length + 1, ...newDiscussion, comments: [] }]);
    setSelectedDiscussion(newDiscussion);
  };

  const handleSelectDiscussion = (discussion) => {
    setSelectedDiscussion(discussion);
  };

  return (
    <div className="forum-page">
      <ForumHeader onNewDiscussion={handleNewDiscussion} />
      <div className="forum-content">
        <DiscussionList 
          discussions={discussions} 
          onSelectDiscussion={handleSelectDiscussion} 
        />
        {selectedDiscussion && <DiscussionDetail discussion={selectedDiscussion} />}
      </div>
      <NewDiscussionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}

export default ForumPage;
