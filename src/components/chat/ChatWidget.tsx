
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { MessageSquare, Send, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { sendMessage, getMessages, markMessagesAsRead, checkTelegramWebhookStatus } from '@/services/chatService';
import ChatBubble from './ChatBubble';

// Helper interfaces
interface ChatMessage {
  id: number;
  message: string;
  is_from_admin: boolean;
  is_read: boolean;
  created_at: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [configStatus, setConfigStatus] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
        const status = await checkTelegramWebhookStatus();
        setConfigStatus(status);
        
        if (!status.webhook?.url) {
          console.warn("Telegram webhook not configured");
        }
      } catch (error) {
        console.error("Error checking webhook status:", error);
      }
    };
    
    checkWebhookConfig();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      const markAsRead = async () => {
        try {
          await markMessagesAsRead();
          setUnreadCount(0);
          setMessages(prev => 
            prev.map(msg => ({ ...msg, is_read: true }))
          );
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      };
      
      markAsRead();
    }
  }, [isOpen, unreadCount]);

  // Poll for new messages periodically
  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsSending(true);
    
    try {
      const success = await sendMessage(message, {
        name: profile?.name || '',
        email: profile?.email || '',
      });
      
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

  // Render the widget button with unread badge
  const renderChatButton = () => (
    <Button
      onClick={handleToggleChat}
      variant="outline"
      size="icon"
      className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
      aria-label="Open chat"
    >
      <MessageSquare />
      {unreadCount > 0 && (
        <Badge className="absolute -top-2 -right-2">
          {unreadCount}
        </Badge>
      )}
    </Button>
  );

  // Render the chat window
  const renderChatWindow = () => (
    <Card className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col shadow-lg animate-in slide-in-from-bottom-5 z-50">
      <CardHeader className="p-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Chat Support</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleToggleChat}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map(msg => (
              <ChatBubble 
                key={msg.id}
                message={msg.message}
                isFromAdmin={msg.is_from_admin}
                timestamp={new Date(msg.created_at)}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={message}
            onChange={handleMessageChange}
            placeholder="Type your message..."
            disabled={isSending}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isSending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
  
  return (
    <>
      {isOpen ? renderChatWindow() : renderChatButton()}
    </>
  );
};

export default ChatWidget;
