
import React from "react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface ChatBubbleProps {
  message: ChatMessage;
  isFromAdmin: boolean;
  timestamp: Date;
}

const ChatBubble = ({ message, isFromAdmin, timestamp }: ChatBubbleProps) => {
  const messageText = message.message;
  
  const formattedTime = formatDistanceToNow(timestamp, { 
    addSuffix: true,
    locale: ru
  });

  return (
    <div
      className={cn(
        "mb-4 max-w-[80%] rounded-lg p-3",
        isFromAdmin
          ? "mr-auto bg-muted text-foreground" // Сообщения поддержки слева
          : "ml-auto bg-primary text-primary-foreground" // Сообщения пользователя справа
      )}
    >
      <div className="text-sm">{messageText}</div>
      <div className={cn(
        "mt-1 text-xs",
        isFromAdmin ? "text-muted-foreground" : "text-primary-foreground/70"
      )}>
        {formattedTime}
      </div>
    </div>
  );
};

export default ChatBubble;
