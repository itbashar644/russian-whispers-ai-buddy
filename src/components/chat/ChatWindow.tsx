
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { ChatMessage } from '@/types/chat';
import { sendMessage, markMessagesAsRead } from '@/services/chatService';
import ChatBubble from './ChatBubble';

interface UserInfo {
  name: string;
  email: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  onClose: () => void;
  fetchMessages: () => Promise<void>;
  setUnreadCount: (count: number) => void;
  unreadCount: number;
  userInfo: UserInfo;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  onClose, 
  fetchMessages, 
  setUnreadCount, 
  unreadCount, 
  userInfo 
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (unreadCount > 0) {
      const markAsRead = async () => {
        try {
          await markMessagesAsRead();
          console.info("Messages marked as read");
          setUnreadCount(0);
          await fetchMessages();
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      };
      
      markAsRead();
    }
  }, [unreadCount, setUnreadCount, fetchMessages]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsSending(true);
    
    try {
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

  return (
    <Card className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col shadow-lg animate-in slide-in-from-bottom-5 z-50">
      <CardHeader className="p-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Чат с поддержкой</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
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
};

export default ChatWindow;
