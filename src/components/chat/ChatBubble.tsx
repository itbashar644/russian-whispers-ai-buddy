
import React from "react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface ChatBubbleProps {
  message: ChatMessage | string;
  isFromAdmin: boolean;
  timestamp: Date;
}

const ChatBubble = ({ message, isFromAdmin, timestamp }: ChatBubbleProps) => {
  const messageText = typeof message === 'string' ? message : message.message;
  
  const formattedTime = formatDistanceToNow(timestamp, { 
    addSuffix: true,
    locale: ru
  });

  return (
    <div
      className={cn(
        "mb-4 max-w-[80%] rounded-lg p-3",
        isFromAdmin
          ? "ml-auto bg-primary text-primary-foreground"
          : "mr-auto bg-muted text-foreground"
      )}
    >
      <div className="text-sm">{messageText}</div>
      <div className={cn(
        "mt-1 text-xs",
        isFromAdmin ? "text-primary-foreground/70" : "text-muted-foreground"
      )}>
        {formattedTime}
      </div>
    </div>
  );
};

export default ChatBubble;
