import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { apiService } from '@/services/api';
import { Message } from '@/types';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { MessageInput } from '@/components/chat/MessageInput';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

// Single Responsibility: Página de ventana de chat individual
const ChatWindow = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useStore();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUserName, setOtherUserName] = useState('');
  const [otherUserImage, setOtherUserImage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser || !conversationId) {
      if (!currentUser) {
        toast.error('Debes iniciar sesión');
        navigate('/login');
      } else {
        navigate('/chat');
      }
      return;
    }

    loadConversationData();
    markAsRead();
  }, [currentUser, conversationId, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversationData = async () => {
    if (!conversationId) return;

    try {
      setIsLoading(true);
      
      // Load conversation details
      const conversations = await apiService.getConversations();
      const currentConv = conversations.find(
        (c) => c.id === parseInt(conversationId)
      );
      
      if (currentConv) {
        setOtherUserName(currentConv.otherUser.name);
        setOtherUserImage(currentConv.otherUser.imageUrl);
      }

      // Load messages
      await loadMessages(0);
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.error('Error al cargar la conversación');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (pageNum: number) => {
    if (!conversationId) return;

    try {
      const response = await apiService.getConversationMessages(
        parseInt(conversationId),
        pageNum,
        20
      );
      
      // Reverse to show oldest first
      const newMessages = response.content.reverse();
      
      if (pageNum === 0) {
        setMessages(newMessages);
      } else {
        setMessages((prev) => [...newMessages, ...prev]);
      }
      
      setHasMore(pageNum < response.totalPages - 1);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Error al cargar mensajes');
    }
  };

  const markAsRead = async () => {
    if (!conversationId) return;

    try {
      await apiService.markMessagesAsRead(parseInt(conversationId));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!conversationId || !currentUser) return;

    try {
      setIsSending(true);

      const conversations = await apiService.getConversations();
      const currentConv = conversations.find(
        (c) => c.id === parseInt(conversationId)
      );

      if (!currentConv) {
        toast.error('Conversación no encontrada');
        return;
      }

      const newMessage = await apiService.sendMessage({
        conversationId: parseInt(conversationId),
        receiverId: currentConv.otherUser.id,
        content,
      });

      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      loadMessages(page + 1);
    }
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
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/chat')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            
            {otherUserImage ? (
              <img
                src={otherUserImage}
                alt={otherUserName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {otherUserName.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {otherUserName}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Online
              </p>
            </div>
          </div>

          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900"
      >
        {hasMore && (
          <button
            onClick={handleLoadMore}
            className="w-full text-center text-sm text-blue-500 hover:text-blue-600 py-2"
          >
            Cargar mensajes anteriores
          </button>
        )}

        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                No hay mensajes aún
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Envía un mensaje para iniciar la conversación
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.senderId === currentUser?.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput onSend={handleSendMessage} disabled={isSending} />
    </div>
  );
};

export default ChatWindow;

