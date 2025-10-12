import { MessageCircle } from 'lucide-react';
import { Conversation } from '@/types';

interface ConversationCardProps {
  conversation: Conversation;
  onClick: () => void;
}

// Single Responsibility: Solo renderizar una tarjeta de conversación
export const ConversationCard = ({ conversation, onClick }: ConversationCardProps) => {
  const { otherUser, lastMessage, unreadCount } = conversation;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {otherUser.imageUrl ? (
          <img
            src={otherUser.imageUrl}
            alt={otherUser.name}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {otherUser.name.charAt(0).toUpperCase()}
          </div>
        )}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {otherUser.name}
          </h3>
          {lastMessage && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
              {formatTime(lastMessage.timestamp)}
            </span>
          )}
        </div>
        {lastMessage ? (
          <p className={`text-sm truncate ${
            unreadCount > 0 
              ? 'font-semibold text-gray-900 dark:text-white' 
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {lastMessage.content}
          </p>
        ) : (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-4 h-4 mr-1" />
            <span>Empieza la conversación</span>
          </div>
        )}
      </div>
    </button>
  );
};

