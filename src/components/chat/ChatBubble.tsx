
import React from "react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isAdmin = message.is_from_admin;
  const timestamp = new Date(message.created_at);
  const formattedTime = formatDistanceToNow(timestamp, { 
    addSuffix: true,
    locale: ru
  });

  return (
    <div
      className={cn(
        "mb-4 max-w-[80%] rounded-lg p-3",
        isAdmin
          ? "ml-auto bg-primary text-primary-foreground"
          : "mr-auto bg-muted text-foreground"
      )}
    >
      <div className="text-sm">{message.message}</div>
      <div className={cn(
        "mt-1 text-xs",
        isAdmin ? "text-primary-foreground/70" : "text-muted-foreground"
      )}>
        {formattedTime}
      </div>
    </div>
  );
};

export default ChatBubble;
