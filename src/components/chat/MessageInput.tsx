import { useState, FormEvent, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

// Single Responsibility: Solo manejar el input de mensajes
export const MessageInput = ({ 
  onSend, 
  disabled = false,
  placeholder = 'Escribe un mensaje...'
}: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
    >
      <div className="flex items-end gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed max-h-32"
          style={{ minHeight: '40px' }}
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-3 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

