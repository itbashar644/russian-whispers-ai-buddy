
import React from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
}

const ChatButton = ({ isOpen, onClick, unreadCount = 0 }: ChatButtonProps) => {
  return (
    <div className="inline-flex items-center">
      {isOpen ? (
        <X className="h-4 w-4" />
      ) : (
        <Button
          onClick={onClick}
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
          aria-label="Открыть чат"
        >
          <MessageCircle />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2">
              {unreadCount}
            </Badge>
          )}
        </Button>
      )}
    </div>
  );
};

export default ChatButton;
