
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <CardHeader className="p-3 border-b">
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg">Chat Support</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};

export default ChatHeader;
