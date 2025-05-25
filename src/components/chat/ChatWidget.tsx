
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useChatSender } from '@/hooks/useChatSender';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, unreadCount, messagesEndRef, fetchMessages } = useChatMessages(isOpen);
  const { isSending, handleSendMessage } = useChatSender(fetchMessages);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
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
  
  return (
    <>
      {isOpen ? (
        <ChatWindow
          messages={messages}
          onClose={handleToggleChat}
          onSendMessage={handleSendMessage}
          isSending={isSending}
          messagesEndRef={messagesEndRef}
        />
      ) : (
        renderChatButton()
      )}
    </>
  );
};

export default ChatWidget;
