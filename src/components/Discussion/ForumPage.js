import React, { useState, useRef, useEffect } from 'react';
import { Search, MessageSquare, ThumbsUp, ArrowLeft, User, X, ChevronRight, Send, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForumPage = () => {
  // États pour les posts et la recherche
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showNewPostPopup, setShowNewPostPopup] = useState(false);
  const [showMessagesPopup, setShowMessagesPopup] = useState(false);
  const [showNewMessagePopup, setShowNewMessagePopup] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '' });
  const popupRef = useRef(null);

  // État pour les messages privés
  const [privateMessages, setPrivateMessages] = useState([
    {
      id: 1,
      from: 'Alice Martin',
      messages: [
        { content: "Bonjour, j'ai vu votre post sur l'authentification", timestamp: "10:30", sender: "Alice Martin" },
        { content: "Je peux vous aider si vous voulez", timestamp: "10:31", sender: "Alice Martin" }
      ]
    },
    {
      id: 2,
      from: 'Marc Dubois',
      messages: [
        { content: "Salut, pouvons-nous discuter du projet ?", timestamp: "09:15", sender: "Marc Dubois" }
      ]
    }
  ]);

  // État pour les utilisateurs en ligne
  const [onlineUsers, setOnlineUsers] = useState([
    { id: 1, name: 'Alice Martin', status: 'online' },
    { id: 2, name: 'Marc Dubois', status: 'online' },
    { id: 3, name: 'Sophie Bernard', status: 'offline' },
    { id: 4, name: 'Lucas Petit', status: 'online' }
  ]);

  // Données des catégories
  const categories = [
    {
      id: 1,
      title: "Discussions Techniques",
      icon: "👨‍💻",
      count: 156,
      description: "Questions et réponses techniques"
    },
    {
      id: 2,
      title: "Actualités & Annonces",
      icon: "📢",
      count: 89,
      description: "Dernières mises à jour"
    },
    {
      id: 3,
      title: "Aide & Support",
      icon: "💡",
      count: 234,
      description: "Besoin d'aide ?"
    },
    {
      id: 4,
      title: "Bonnes Pratiques",
      icon: "✨",
      count: 167,
      description: "Guides et conseils"
    }
  ];

  // Fonction pour envoyer un message privé
  const sendPrivateMessage = () => {
    if (newMessage.trim() && selectedContact) {
      const updatedMessages = privateMessages.map(chat => {
        if (chat.from === selectedContact.name) {
          return {
            ...chat,
            messages: [...chat.messages, {
              content: newMessage,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              sender: 'Vous'
            }]
          };
        }
        return chat;
      });
      setPrivateMessages(updatedMessages);
      setNewMessage('');
    }
  };

  // Initialisation des posts
  useEffect(() => {
    setPosts([
      {
        id: 1,
        category: "Discussions Techniques",
        author: "John Doe",
        title: "Comment implémenter l'authentification ?",
        content: "Je cherche à mettre en place une authentification sécurisée...",
        likes: 12,
        comments: 5,
        timestamp: "Il y a 2h"
      },
      {
        id: 2,
        category: "Bonnes Pratiques",
        author: "Jane Smith",
        title: "Les meilleures pratiques pour React",
        content: "Voici quelques conseils pour optimiser vos applications React...",
        likes: 8,
        comments: 3,
        timestamp: "Il y a 3h"
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre de recherche fixe */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher dans les discussions..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowMessagesPopup(true)}
              className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors relative"
            >
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
            <button
              onClick={() => setShowNewPostPopup(true)}
              className="px-6 py-3 bg-gradient-to-r from-lime-500 to-blue-500 text-white rounded-lg hover:from-lime-600 hover:to-blue-600 transition-colors shadow-sm"
            >
              Nouvelle Discussion
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="pt-28">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Grille des catégories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {categories.map(category => (
              <motion.div
                key={category.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-lime-400/50 hover:shadow-lg hover:shadow-lime-100 transition-all cursor-pointer group"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-sm font-medium text-gray-500">{category.count} discussions</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-lime-600">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                <div className="flex items-center text-blue-500 text-sm font-medium">
                  Voir les discussions
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Discussions récentes */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Discussions Récentes</h2>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-lime-400/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-400/20 to-blue-400/20 flex items-center justify-center text-lime-600">
                      {post.author[0]}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-blue-500">{post.category}</span>
                      <h3 className="font-semibold text-gray-900">{post.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-500">
                      <ThumbsUp size={16} />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MessageSquare size={16} />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal pour nouvelle discussion */}
      <AnimatePresence>
        {showNewPostPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-xl w-full max-w-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              ref={popupRef}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Nouvelle Discussion</h2>
                  <button
                    onClick={() => setShowNewPostPopup(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none"
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.title}>{cat.title}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Titre de la discussion"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                  <textarea
                    placeholder="Contenu de la discussion..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none h-32 resize-none"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowNewPostPopup(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      className="px-6 py-2 bg-gradient-to-r from-lime-500 to-blue-500 text-white rounded-lg hover:from-lime-600 hover:to-blue-600 transition-colors"
                    >
                      Publier
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal pour les messages */}
      <AnimatePresence>
        {showMessagesPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-xl w-full max-w-4xl h-[600px] flex"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Sidebar des contacts */}
              <div className="w-1/3 border-r border-gray-200 p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
                  <button
                    onClick={() => setShowMessagesPopup(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-2">
                  {onlineUsers.map(user => (
                    <div
                    key={user.id}
                    onClick={() => setSelectedContact(user)}
                    className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 ${
                      selectedContact?.id === user.id ? 'bg-lime-50' : 'hover:bg-gray-50'
                    }`}
                  >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400/20 to-blue-400/20 flex items-center justify-center text-lime-600">
                          {user.name[0]}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.status === 'online' ? 'En ligne' : 'Hors ligne'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone de chat */}
              <div className="flex-1 flex flex-col">
                {selectedContact ? (
                  <>
                    {/* En-tête du chat */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400/20 to-blue-400/20 flex items-center justify-center text-lime-600">
                          {selectedContact.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedContact.name}</p>
                          <p className="text-sm text-gray-500">
                            {selectedContact.status === 'online' ? 'En ligne' : 'Hors ligne'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      {privateMessages
                        .find(chat => chat.from === selectedContact.name)
                        ?.messages.map((message, index) => (
                          <div
                            key={index}
                            className={`mb-4 flex ${message.sender === 'Vous' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.sender === 'Vous'
                                  ? 'bg-lime-500 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender === 'Vous' ? 'text-lime-100' : 'text-gray-500'
                              }`}>
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Zone de saisie du message */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Écrivez votre message..."
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              sendPrivateMessage();
                            }
                          }}
                        />
                        <button
                          onClick={sendPrivateMessage}
                          className="p-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Sélectionnez un contact pour commencer une discussion
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForumPage;