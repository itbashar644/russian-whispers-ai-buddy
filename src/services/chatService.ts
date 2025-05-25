
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "@/types/chat";

// Получение или создание ID чата
// Cache chat ID in memory so we don't rely solely on localStorage
let cachedChatId: string | null = null;

/**
 * Safely obtain a chat ID.
 *
 * On some mobile browsers `localStorage` may be unavailable (e.g. in private
 * mode or inside in-app browsers).  In such cases we fall back to an in-memory
 * value so the chat can still function.
 */
export const getChatId = (): string => {
    if (cachedChatId) {
    return cachedChatId;
  }

  try {
    const stored = typeof localStorage !== "undefined"
      ? localStorage.getItem("chat_id")
      : null;

    if (stored) {
      cachedChatId = stored;
    } else {
      cachedChatId = uuidv4();
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("chat_id", cachedChatId);
      }
    }
  } catch (error) {
    console.error("Unable to access localStorage for chat_id:", error);
    // Fall back to a generated ID if we couldn't read from storage
    if (!cachedChatId) {
      cachedChatId = uuidv4();
    }
  }

  return cachedChatId;
};

// Отправка сообщения
export const sendMessage = async (
  message: string,
  userInfo?: { name?: string; email?: string }
): Promise<boolean> => {
  try {
    console.log("Отправка сообщения:", { message, userInfo });
    const chatId = getChatId();
    
    const response = await supabase.functions.invoke("telegram-chat/send", {
      body: { 
        chatId, 
        message, 
        name: userInfo?.name || '', 
        email: userInfo?.email || '' 
      },
    });
    
    if (response.error) {
      console.error("Error sending message:", response.error);
      return false;
    }
    
    if (response.data && response.data.error) {
      console.error("Error from function:", response.data.error, response.data.details);
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
    console.log("Fetching messages for chat ID:", chatId);
    
    const response = await supabase.functions.invoke("telegram-chat/messages", {
      body: { chatId },
    });
    
    if (response.error) {
      console.error("Error getting messages:", response.error);
      return [];
    }
    
    if (response.data && response.data.error) {
      console.error("Error from function:", response.data.error);
      return [];
    }
    
    console.log("Messages received:", response.data?.messages || []);
    return response.data?.messages || [];
  } catch (error) {
    console.error("Error in getMessages:", error);
    return [];
  }
};

// Mark messages as read
export const markMessagesAsRead = async (): Promise<boolean> => {
  try {
    const chatId = getChatId();
    
    const response = await supabase.functions.invoke("telegram-chat/mark-read", {
      body: { chatId },
    });
    
    if (response.error) {
      console.error("Error marking messages as read:", response.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in markMessagesAsRead:", error);
    return false;
  }
};

// Check Telegram webhook status
export const checkTelegramWebhookStatus = async (): Promise<any> => {
  try {
    const response = await supabase.functions.invoke("telegram-chat/webhook-status", {});
    
    if (response.error) {
      console.error("Error checking webhook status:", response.error);
      return { ok: false };
    }
    
    return response.data || {};
  } catch (error) {
    console.error("Error in checkTelegramWebhookStatus:", error);
    return { ok: false };
  }
};

// Проверка состояния telegram-chat функции
export const checkChatStatus = async (): Promise<{
  ok: boolean;
  config?: {
    telegram_bot_token_set: boolean;
    telegram_admin_chat_id_set: boolean;
    supabase_url_set: boolean;
    supabase_service_role_key_set: boolean;
  };
}> => {
  try {
    const response = await supabase.functions.invoke("telegram-chat/status", {});
    
    if (response.error) {
      console.error("Error checking chat status:", response.error);
      return { ok: false };
    }
    
    return { 
      ok: response.data?.status === "ok",
      config: response.data?.config 
    };
  } catch (error) {
    console.error("Error in checkChatStatus:", error);
    return { ok: false };
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

// Настройка webhook для Telegram
export const setupTelegramWebhook = async (url: string): Promise<boolean> => {
  try {
    const response = await supabase.functions.invoke("telegram-chat/setup-webhook", {
      body: { url },
    });

    if (response.error || (response.data && response.data.error)) {
      console.error("Error setting up webhook:", response.error || response.data.error);
      return false;
    }

    return !!response.data?.success;
  } catch (error) {
    console.error("Error in setupTelegramWebhook:", error);
    return false;
  }
};
