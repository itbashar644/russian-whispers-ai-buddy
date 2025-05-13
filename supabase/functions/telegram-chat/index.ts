
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Получаем переменные окружения
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";
const TELEGRAM_ADMIN_CHAT_ID = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// CORS заголовки
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Создаем клиент Supabase с полным доступом
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Отправка сообщения в Telegram
async function sendTelegramMessage(chatId: string, text: string) {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "HTML",
        }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error sending telegram message:", error);
    return { ok: false, error };
  }
}

// Проверка новых сообщений из Telegram
async function processTelegramUpdate(update: any) {
  try {
    // Обрабатываем только текстовые сообщения
    if (!update.message || !update.message.text) return;

    const { message } = update;
    const chatId = message.chat.id.toString();
    
    // Проверяем, является ли отправитель админом
    if (chatId !== TELEGRAM_ADMIN_CHAT_ID) {
      await sendTelegramMessage(chatId, "Извините, этот бот работает только для администраторов магазина.");
      return;
    }

    // Проверяем формат сообщения для ответа: "REPLY:chat_id:сообщение"
    if (message.text.startsWith("REPLY:")) {
      const parts = message.text.split(":", 3);
      if (parts.length < 3) {
        await sendTelegramMessage(chatId, "Неверный формат ответа. Используйте: REPLY:chat_id:сообщение");
        return;
      }

      const customerChatId = parts[1];
      const replyText = parts.slice(2).join(":");
      
      // Сохраняем ответ в базе данных
      const { error: dbError } = await supabase.from("chat_messages").insert({
        chat_id: customerChatId,
        message: replyText,
        is_from_admin: true,
        is_read: false
      });

      if (dbError) {
        console.error("Error saving message to DB:", dbError);
        await sendTelegramMessage(chatId, `Ошибка при сохранении сообщения: ${dbError.message}`);
        return;
      }

      await sendTelegramMessage(chatId, `✅ Сообщение отправлено клиенту (${customerChatId}).`);
    } else if (message.text === "/chats") {
      // Получаем список активных чатов
      const { data: chats, error: chatsError } = await supabase
        .from("chat_sessions")
        .select("id, customer_name, created_at")
        .order("updated_at", { ascending: false })
        .limit(10);

      if (chatsError) {
        await sendTelegramMessage(chatId, `Ошибка при получении списка чатов: ${chatsError.message}`);
        return;
      }

      if (!chats || chats.length === 0) {
        await sendTelegramMessage(chatId, "Нет активных чатов.");
        return;
      }

      let chatsList = "📝 <b>Последние чаты:</b>\n\n";
      chats.forEach((chat, index) => {
        const date = new Date(chat.created_at).toLocaleString("ru");
        chatsList += `${index + 1}. <b>${chat.customer_name}</b> (${chat.id}) - ${date}\n`;
        chatsList += `Ответить: <code>REPLY:${chat.id}:Ваш ответ</code>\n\n`;
      });

      await sendTelegramMessage(chatId, chatsList);
    } else {
      await sendTelegramMessage(
        chatId,
        "Доступные команды:\n" +
        "/chats - Список последних чатов\n" +
        "REPLY:chat_id:сообщение - Ответить клиенту"
      );
    }
  } catch (error) {
    console.error("Error processing Telegram update:", error);
  }
}

serve(async (req) => {
  // Обработка CORS для preflight запросов
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    // Обработчик для веб-хука Telegram
    if (path === "webhook") {
      const update = await req.json();
      await processTelegramUpdate(update);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Обработчик для отправки сообщений клиентов
    if (path === "send") {
      const { chatId, name, email, message } = await req.json();
      
      if (!chatId || !message) {
        return new Response(
          JSON.stringify({ error: "chatId и message обязательны" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Сохраняем сеанс чата (если новый)
      const { error: sessionError } = await supabase
        .from("chat_sessions")
        .upsert(
          { 
            id: chatId,
            customer_name: name || "Гость",
            customer_email: email || null,
            updated_at: new Date().toISOString()
          },
          { onConflict: "id", ignoreDuplicates: false }
        );

      if (sessionError) {
        console.error("Error saving chat session:", sessionError);
        return new Response(
          JSON.stringify({ error: "Ошибка сохранения сеанса чата" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      // Сохраняем сообщение клиента
      const { error: messageError } = await supabase
        .from("chat_messages")
        .insert({
          chat_id: chatId,
          message: message,
          is_from_admin: false,
          is_read: false
        });

      if (messageError) {
        console.error("Error saving message:", messageError);
        return new Response(
          JSON.stringify({ error: "Ошибка сохранения сообщения" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      // Отправляем уведомление администратору в Telegram
      const customerInfo = `Клиент: ${name || "Гость"}${email ? ` (${email})` : ""}`;
      const telegramMessage = `📩 <b>Новое сообщение</b>\n${customerInfo}\nID чата: <code>${chatId}</code>\n\n<b>Сообщение:</b>\n${message}\n\n<b>Чтобы ответить, отправьте:</b>\n<code>REPLY:${chatId}:Ваш ответ</code>`;
      
      await sendTelegramMessage(TELEGRAM_ADMIN_CHAT_ID, telegramMessage);

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Обработчик для получения истории сообщений
    if (path === "messages") {
      const { chatId } = await req.json();
      
      if (!chatId) {
        return new Response(
          JSON.stringify({ error: "chatId обязателен" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Получаем историю сообщений
      const { data: messages, error: messagesError } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        return new Response(
          JSON.stringify({ error: "Ошибка получения сообщений" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      // Помечаем сообщения от админа как прочитанные
      const unreadAdminMessages = messages
        .filter(msg => msg.is_from_admin && !msg.is_read)
        .map(msg => msg.id);
      
      if (unreadAdminMessages.length > 0) {
        const { error: updateError } = await supabase
          .from("chat_messages")
          .update({ is_read: true })
          .in("id", unreadAdminMessages);
        
        if (updateError) {
          console.error("Error marking messages as read:", updateError);
        }
      }

      return new Response(
        JSON.stringify({ messages }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Если путь не соответствует ни одному обработчику
    return new Response(
      JSON.stringify({ error: "Неверный путь" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Внутренняя ошибка сервера" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
