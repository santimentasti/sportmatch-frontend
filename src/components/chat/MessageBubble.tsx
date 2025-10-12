import { Message } from '@/types';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

// Single Responsibility: Solo renderizar una burbuja de mensaje
export const MessageBubble = ({ message, isOwnMessage }: MessageBubbleProps) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        {!isOwnMessage && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 px-3">
            {message.senderName}
          </p>
        )}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
          }`}
        >
          <p className="text-sm break-words">{message.content}</p>
        </div>
        <div className={`flex items-center gap-1 mt-1 px-3 ${
          isOwnMessage ? 'justify-end' : 'justify-start'
        }`}>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(message.timestamp)}
          </span>
          {isOwnMessage && (
            <span className="text-gray-500 dark:text-gray-400">
              {message.isRead ? (
                <CheckCheck className="w-3 h-3 text-blue-500" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

