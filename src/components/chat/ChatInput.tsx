
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { CardFooter } from '@/components/ui/card';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isSending: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  message, 
  setMessage, 
  onSendMessage, 
  isSending 
}) => {
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <CardFooter className="p-3 border-t">
      <form onSubmit={onSendMessage} className="flex w-full gap-2">
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
  );
};

export default ChatInput;
