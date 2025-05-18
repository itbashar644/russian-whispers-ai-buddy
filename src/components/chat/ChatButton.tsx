
import React from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
}

const ChatButton = ({ isOpen, onClick, unreadCount = 0 }: ChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg flex items-center justify-center p-0",
        isOpen ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
      )}
      aria-label={isOpen ? "Закрыть чат" : "Открыть чат"}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <>
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-destructive text-xs text-white">
              {unreadCount}
            </span>
          )}
        </>
      )}
    </Button>
  );
};

export default ChatButton;
