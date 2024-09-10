import React, { useState } from 'react';
import ForumHeader from './ForumHeader';
import DiscussionList from './DiscussionList';
import DiscussionDetail from './DiscussionDetail';
import NewDiscussionModal from './NewDiscussionModal'; 
import '../styles/ATS/ForumPage.css';

function ForumPage() {
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [discussions, setDiscussions] = useState([
    { id: 1, title: 'Énergie durable', description: 'Discussion sur les sources d\'énergie durable.', category: 'Environnement', comments: [] },
    { id: 2, title: 'Transport urbain', description: 'Discussion sur l\'amélioration des transports en commun.', category: 'Mobilité', comments: [] },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

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

  const filteredDiscussions = discussions.filter(discussion => 
    (discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) || discussion.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'Tous' || discussion.category === selectedCategory)
  );

  return (
    <div className="forum-page">
      <ForumHeader onNewDiscussion={handleNewDiscussion} />
      <div className="forum-content">
        <div className="forum-filters">
          <input 
            type="text" 
            placeholder="Rechercher..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Tous">Tous</option>
            <option value="Environnement">Environnement</option>
            <option value="Mobilité">Mobilité</option>
            {/* Ajoute d'autres catégories ici */}
          </select>
        </div>
        <DiscussionList 
          discussions={filteredDiscussions} 
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
