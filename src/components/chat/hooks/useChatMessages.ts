
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { sendMessage, getMessages, markMessagesAsRead } from '@/services/chatService';
import { ChatMessage } from '@/types/chat';

const useChatMessages = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [configStatus, setConfigStatus] = useState<any>(null);
  const { isAuthenticated, profile } = useAuth();

  // Helper function to fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const msgs = await getMessages();
      if (msgs && msgs.length > 0) {
        setMessages(msgs);
        
        // Count unread messages from admin
        const newUnreadCount = msgs.filter(m => m.is_from_admin && !m.is_read).length;
        setUnreadCount(prevCount => newUnreadCount > prevCount ? newUnreadCount : prevCount);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  // Check webhook status on first load
  useEffect(() => {
    const checkWebhookConfig = async () => {
      try {
        // We'll skip this for now as the function isn't fully implemented
        console.info("Webhook status check skipped");
      } catch (error) {
        console.error("Error checking webhook status:", error);
      }
    };
    
    checkWebhookConfig();
  }, []);

  // Poll for new messages periodically
  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 10000);
    
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Handle sending messages
  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsSending(true);
    
    try {
      const userInfo = {
        name: profile?.name || '',
        email: profile?.email || ''
      };
      
      const success = await sendMessage(message, userInfo);
      
      if (success) {
        setMessage("");
        await fetchMessages();
      } else {
        toast.error("Ошибка отправки сообщения", {
          description: "Не удалось отправить сообщение. Пожалуйста, попробуйте позже."
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Ошибка отправки сообщения", {
        description: "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже."
      });
    } finally {
      setIsSending(false);
    }
  }, [message, profile, fetchMessages]);

  // Mark messages as read when opened
  const markAsRead = useCallback(async () => {
    try {
      await markMessagesAsRead();
      // Update local read status
      setMessages(prev => 
        prev.map(m => m.is_from_admin && !m.is_read ? { ...m, is_read: true } : m)
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, []);

  return {
    message,
    setMessage,
    messages,
    unreadCount,
    setUnreadCount,
    isSending,
    configStatus,
    handleSendMessage,
    fetchMessages,
    markAsRead
  };
};

export default useChatMessages;
