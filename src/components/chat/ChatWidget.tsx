
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { sendMessage, getMessages, markMessagesAsRead } from '@/services/chatService';
import ChatBubble from './ChatBubble';
import ChatButton from './ChatButton';
import { ChatMessage } from '@/types/chat';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
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

  // Fetch messages on first load
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
        description: "Произошла неожиданная ошибка. Пожалуйста, попробуйте позже."
      });
    } finally {
      setIsSending(false);
    }
  };

  // Render the chat window
  const renderChatWindow = () => (
    <Card className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col shadow-lg animate-in slide-in-from-bottom-5 z-50">
      <CardHeader className="p-3 border-b">
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
      
      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={message}
            onChange={handleMessageChange}
            placeholder="Введите сообщение..."
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
      {isOpen ? 
        renderChatWindow() : 
        <ChatButton 
          isOpen={isOpen} 
          onClick={handleToggleChat} 
          unreadCount={unreadCount} 
        />
      }
    </>
  );
};

export default ChatWidget;
