import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { apiService } from '@/services/api';
import { Conversation } from '@/types';
import { ConversationCard } from '@/components/chat/ConversationCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

// Single Responsibility: Página de lista de conversaciones
const ChatList = () => {
  const navigate = useNavigate();
  const { currentUser } = useStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión');
      navigate('/login');
      return;
    }

    loadConversations();
  }, [currentUser, navigate]);

  useEffect(() => {
    // Open Closed Principle: Fácil extender con más filtros
    if (searchQuery.trim()) {
      const filtered = conversations.filter((conv) =>
        conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getConversations();
      setConversations(data);
      setFilteredConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Error al cargar conversaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationClick = (conversationId: number) => {
    navigate(`/chat/${conversationId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mensajes
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
              <MessageCircle className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No hay resultados' : 'No hay conversaciones'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery
                ? 'Intenta con otro nombre'
                : 'Haz match con otros jugadores para empezar a chatear'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/sport-selection')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Buscar Jugadores
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                onClick={() => handleConversationClick(conversation.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;

