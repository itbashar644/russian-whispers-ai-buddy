
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { getMessages } from '@/services/chatService';
import { ChatMessage } from '@/types/chat';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
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
    
    // Fetch messages immediately when component mounts
    fetchMessages();
  }, []);

  // Poll for new messages periodically
  useEffect(() => {
    const interval = setInterval(fetchMessages, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen ? (
        <ChatWindow 
          onClose={handleToggleChat}
          messages={messages}
          fetchMessages={fetchMessages}
          setUnreadCount={setUnreadCount}
          unreadCount={unreadCount}
          userInfo={{
            name: profile?.name || '',
            email: profile?.email || ''
          }}
        />
      ) : (
        <ChatButton 
          isOpen={false} 
          onClick={handleToggleChat} 
          unreadCount={unreadCount} 
        />
      )}
    </>
  );
};

export default ChatWidget;
