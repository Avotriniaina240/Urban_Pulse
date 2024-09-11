// ForumPage.js
import React, { useState, useEffect } from 'react';
import ForumHeader from './ForumHeader';
import DiscussionList from './DiscussionList';
import DiscussionDetail from './DiscussionDetail';
import NewDiscussionModal from './NewDiscussionModal'; 
import '../styles/ATS/ForumPage.css';

function ForumPage() {
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // Fetch discussions from the backend
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/discussions');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des discussions');
        }
        const data = await response.json();
        setDiscussions(data);
      } catch (error) {
        console.error('Erreur:', error.message);
      }
    };

    fetchDiscussions();
  }, []);

  const handleNewDiscussion = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (newDiscussion) => {
    try {
      const response = await fetch('http://localhost:5000/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDiscussion),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erreur lors de la création de la discussion');
      }

      const data = await response.json();
      setDiscussions([...discussions, data]);
      setSelectedDiscussion(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur:', error.message);
      alert(`Erreur: ${error.message}`);
    }
  };

  const handleSelectDiscussion = (discussion) => {
    setSelectedDiscussion(discussion);
  };

  const filteredDiscussions = discussions.filter(discussion => {
    const title = discussion.title ? discussion.title.toLowerCase() : '';
    const description = discussion.description ? discussion.description.toLowerCase() : '';
    const searchTermLower = searchTerm.toLowerCase();

    return (
      (title.includes(searchTermLower) || description.includes(searchTermLower)) &&
      (selectedCategory === 'Tous' || discussion.category === selectedCategory)
    );
  });

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
        <div className="discussion-list-container">
          <DiscussionList 
            discussions={filteredDiscussions} 
            onSelectDiscussion={handleSelectDiscussion} 
          />
        </div>
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
