
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sendMessage } from '@/services/chatService';
import { toast } from 'sonner';

export const useChatSender = (fetchMessages: () => Promise<void>) => {
  const [isSending, setIsSending] = useState(false);
  const { profile } = useAuth();

  const handleSendMessage = async (messageText: string): Promise<void> => {
    if (!messageText.trim() || isSending) {
      return;
    }
    
    console.log("Starting to send message:", messageText);
    setIsSending(true);
    
    try {
      const userInfo = {
        name: profile?.name || '',
        email: profile?.email || ''
      };
      
      console.log("Sending message to server...");
      const success = await sendMessage(messageText, userInfo);
      
      if (success) {
        console.log("Message sent successfully, refreshing messages");
        await fetchMessages();
        toast.success("Сообщение отправлено");
      } else {
        console.error("Failed to send message");
        toast.error("Ошибка отправки сообщения", {
          description: "Не удалось отправить сообщение. Пожалуйста, попробуйте позже."
        });
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Ошибка отправки сообщения");
      throw error;
    } finally {
      setIsSending(false);
      console.log("Send operation completed");
    }
  };

  return {
    isSending,
    handleSendMessage
  };
};
