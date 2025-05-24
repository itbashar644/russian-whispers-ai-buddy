
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { MessageSquare, Send, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { sendMessage, getMessages, markMessagesAsRead } from '@/services/chatService';
import ChatBubble from './ChatBubble';
import { ChatMessage } from '@/types/chat';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  // Initial fetch on component mount
  useEffect(() => {
    fetchMessages();
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
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  // Focus input when chat opens on mobile
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Delay focus to ensure the chat is fully rendered
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!message.trim() || isSending) {
      console.log("Message empty or already sending", { message: message.trim(), isSending });
      return;
    }
    
    const messageToSend = message.trim();
    console.log("Starting to send message:", messageToSend);
    setIsSending(true);
    
    try {
      const userInfo = {
        name: profile?.name || '',
        email: profile?.email || ''
      };
      
      // Clear message field immediately for better UX
      setMessage("");
      console.log("Message field cleared, sending to server...");
      
      const success = await sendMessage(messageToSend, userInfo);
      
      if (success) {
        console.log("Message sent successfully, refreshing messages");
        await fetchMessages(); // Refresh messages
        toast.success("Сообщение отправлено");
      } else {
        console.error("Failed to send message, restoring text");
        // Restore message on failure
        setMessage(messageToSend);
        toast.error("Ошибка отправки сообщения", {
          description: "Не удалось отправить сообщение. Пожалуйста, попробуйте позже."
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Restore message on error
      setMessage(messageToSend);
      toast.error("Ошибка отправки сообщения");
    } finally {
      setIsSending(false);
      console.log("Send operation completed");
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log("Enter key pressed, attempting to send message");
      handleSendMessage();
    }
  };

  // Render the widget button with unread badge
  const renderChatButton = () => (
    <Button
      onClick={handleToggleChat}
      variant="outline"
      size="icon"
      className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-40 bg-white border-2"
      aria-label="Открыть чат"
    >
      <MessageSquare />
      {unreadCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
          {unreadCount}
        </Badge>
      )}
    </Button>
  );

  // Render the chat window
  const renderChatWindow = () => (
    <Card className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col shadow-lg animate-in slide-in-from-bottom-5 z-50 bg-white">
      <CardHeader className="p-3 border-b flex-shrink-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Чат с поддержкой</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleToggleChat}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              Нет сообщений. Начните разговор!
            </div>
          ) : (
            messages.map(msg => (
              <ChatBubble 
                key={msg.id}
                message={msg}
                isFromAdmin={msg.is_from_admin}
                timestamp={new Date(msg.created_at)}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <CardFooter className="p-3 border-t flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            ref={inputRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder="Введите сообщение..."
            disabled={isSending}
            className="flex-1"
            autoComplete="off"
            inputMode="text"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isSending || !message.trim()}
            className="flex-shrink-0"
            onClick={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
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
