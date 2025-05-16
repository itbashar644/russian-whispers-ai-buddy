
import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import ChatButton from './ChatButton';
import useChatMessages from './hooks/useChatMessages';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    unreadCount, 
    isSending, 
    message, 
    setMessage,
    handleSendMessage,
    setUnreadCount,
    markAsRead
  } = useChatMessages();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      setUnreadCount(0);
      markAsRead();
    }
  }, [isOpen, unreadCount, setUnreadCount, markAsRead]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen ? (
        <Card className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col shadow-lg animate-in slide-in-from-bottom-5 z-50">
          <ChatHeader onClose={handleToggleChat} />
          
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
          
          <ChatInput 
            message={message}
            setMessage={setMessage}
            onSendMessage={handleSendMessage}
            isSending={isSending}
          />
        </Card>
      ) : (
        <ChatButton 
          isOpen={isOpen} 
          onClick={handleToggleChat} 
          unreadCount={unreadCount}
        />
      )}
    </>
  );
};

export default ChatWidget;
