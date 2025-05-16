
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { sendMessage, getMessages } from '@/services/chatService';
import { ChatMessage } from '@/types/chat';

const useChatMessages = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [configStatus, setConfigStatus] = useState<any>(null);
  const { isAuthenticated, profile } = useAuth();

  // Helper function to fetch messages
  const fetchMessages = async () => {
    try {
      const msgs = await getMessages();
      if (msgs && msgs.length > 0) {
        setMessages(msgs);
        
        // Count unread messages from admin
        const newUnreadCount = msgs.filter(m => m.is_from_admin && !m.is_read).length;
        setUnreadCount(newUnreadCount);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

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
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
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
        toast.error("Error sending message", {
          description: "Failed to send message. Please try again later."
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message", {
        description: "An unexpected error occurred. Please try again later."
      });
    } finally {
      setIsSending(false);
    }
  };

  return {
    message,
    setMessage,
    messages,
    unreadCount,
    setUnreadCount,
    isSending,
    configStatus,
    handleSendMessage,
    fetchMessages
  };
};

export default useChatMessages;
