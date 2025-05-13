
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "@/types/chat";

// Получение или создание ID чата
export const getChatId = (): string => {
  let chatId = localStorage.getItem("chat_id");
  if (!chatId) {
    chatId = uuidv4();
    localStorage.setItem("chat_id", chatId);
  }
  return chatId;
};

// Отправка сообщения
export const sendMessage = async (
  message: string,
  name?: string,
  email?: string
): Promise<boolean> => {
  try {
    const chatId = getChatId();
    
    const response = await supabase.functions.invoke("telegram-chat/send", {
      body: { chatId, message, name, email },
    });
    
    if (response.error) {
      console.error("Error sending message:", response.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return false;
  }
};

// Получение истории сообщений
export const getMessages = async (): Promise<ChatMessage[]> => {
  try {
    const chatId = getChatId();
    
    const response = await supabase.functions.invoke("telegram-chat/messages", {
      body: { chatId },
    });
    
    if (response.error) {
      console.error("Error getting messages:", response.error);
      return [];
    }
    
    return response.data.messages || [];
  } catch (error) {
    console.error("Error in getMessages:", error);
    return [];
  }
};

// Проверка на наличие новых сообщений
export const pollForNewMessages = async (
  lastMessageId: number | null,
  callback: (messages: ChatMessage[]) => void
): Promise<void> => {
  try {
    const messages = await getMessages();
    
    if (messages.length === 0) return;
    
    const latestMessageId = Math.max(...messages.map(m => m.id));
    
    if (lastMessageId === null || latestMessageId > lastMessageId) {
      callback(messages);
    }
  } catch (error) {
    console.error("Error polling for messages:", error);
  }
};
