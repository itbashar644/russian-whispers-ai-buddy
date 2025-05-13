
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Получаем переменные окружения
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";
const TELEGRAM_ADMIN_CHAT_ID = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Добавляем детальное логирование
console.log("=== Запуск функции telegram-chat ===");
console.log(`TELEGRAM_BOT_TOKEN установлен: ${TELEGRAM_BOT_TOKEN ? "Да" : "Нет"}`);
console.log(`TELEGRAM_ADMIN_CHAT_ID установлен: ${TELEGRAM_ADMIN_CHAT_ID ? "Да" : "Нет"}`);
console.log(`SUPABASE_URL установлен: ${SUPABASE_URL ? "Да" : "Нет"}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY установлен: ${SUPABASE_SERVICE_ROLE_KEY ? "Да" : "Нет"}`);

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
    console.log(`Отправка сообщения в Telegram: chatId=${chatId}, text=${text.substring(0, 50)}...`);
    
    if (!TELEGRAM_BOT_TOKEN) {
      console.error("КРИТИЧЕСКАЯ ОШИБКА: TELEGRAM_BOT_TOKEN не установлен");
      return { ok: false, error: "TELEGRAM_BOT_TOKEN не установлен" };
    }
    
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    console.log(`Отправка запроса на URL: ${url}`);
    
    const body = JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
    });
    
    console.log(`Тело запроса: ${body}`);
    
    const response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }
    );
    
    const responseText = await response.text();
    console.log(`Ответ от API Telegram (статус ${response.status}): ${responseText}`);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error(`Ошибка при парсинге ответа: ${parseError}`);
      return { ok: false, error: `Ошибка при парсинге ответа: ${responseText}` };
    }
    
    if (!result.ok) {
      console.error(`ОШИБКА Telegram API: ${JSON.stringify(result)}`);
    }
    
    return result;
  } catch (error) {
    console.error("Error sending telegram message:", error);
    return { ok: false, error: JSON.stringify(error) };
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
  // Добавляем общий обработчик ошибок
  try {
    // Обработка CORS для preflight запросов
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();
    console.log(`Получен запрос: ${req.method} ${url.pathname}`);

    // Обработчик для веб-хука Telegram
    if (path === "webhook") {
      try {
        const update = await req.json();
        console.log("Получен webhook от Telegram:", JSON.stringify(update));
        await processTelegramUpdate(update);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } catch (error) {
        console.error("Error processing webhook:", error);
        return new Response(
          JSON.stringify({ error: "Ошибка обработки webhook", details: error.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    }

    // Обработчик для отправки сообщений клиентов
    if (path === "send") {
      try {
        console.log("Получен запрос на отправку сообщения");
        const body = await req.json();
        const { chatId, name, email, message } = body;
        
        console.log(`Данные запроса: chatId=${chatId}, name=${name}, email=${email}, message=${message}`);
        
        if (!chatId || !message) {
          console.error("Ошибка: отсутствуют обязательные параметры");
          return new Response(
            JSON.stringify({ error: "chatId и message обязательны" }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            }
          );
        }

        // Проверяем, что Telegram токен настроен
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
          console.error("КРИТИЧЕСКАЯ ОШИБКА: Не настроены Telegram переменные");
          return new Response(
            JSON.stringify({ 
              error: "Ошибка конфигурации Telegram",
              details: {
                TELEGRAM_BOT_TOKEN: !!TELEGRAM_BOT_TOKEN,
                TELEGRAM_ADMIN_CHAT_ID: !!TELEGRAM_ADMIN_CHAT_ID
              }
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }

        // Проверяем существование таблиц в базе данных
        console.log("Проверка существования таблиц...");
        const { data: tableExists, error: tableError } = await supabase
          .from("chat_sessions")
          .select("id")
          .limit(1);
          
        if (tableError) {
          console.error("ОШИБКА проверки таблиц:", tableError);
          return new Response(
            JSON.stringify({ 
              error: "Ошибка доступа к базе данных", 
              details: tableError.message 
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }

        // Сохраняем сеанс чата (если новый)
        console.log("Сохранение сеанса чата...");
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
            JSON.stringify({ error: "Ошибка сохранения сеанса чата", details: sessionError.message }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }

        // Сохраняем сообщение клиента
        console.log("Сохранение сообщения клиента...");
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
            JSON.stringify({ error: "Ошибка сохранения сообщения", details: messageError.message }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }

        // Отправляем уведомление администратору в Telegram
        console.log("Отправка уведомления в Telegram...");
        const customerInfo = `Клиент: ${name || "Гость"}${email ? ` (${email})` : ""}`;
        const telegramMessage = `📩 <b>Новое сообщение</b>\n${customerInfo}\nID чата: <code>${chatId}</code>\n\n<b>Сообщение:</b>\n${message}\n\n<b>Чтобы ответить, отправьте:</b>\n<code>REPLY:${chatId}:Ваш ответ</code>`;
        
        const telegramResult = await sendTelegramMessage(TELEGRAM_ADMIN_CHAT_ID, telegramMessage);
        if (!telegramResult.ok) {
          console.error("Ошибка отправки в Telegram:", telegramResult);
          return new Response(
            JSON.stringify({ 
              error: "Ошибка отправки уведомления в Telegram", 
              details: telegramResult
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      } catch (error) {
        console.error("Error in send handler:", error);
        return new Response(
          JSON.stringify({ error: "Внутренняя ошибка сервера в обработчике send", details: error.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    }

    // Обработчик для получения истории сообщений
    if (path === "messages") {
      try {
        console.log("Получен запрос на получение истории сообщений");
        const { chatId } = await req.json();
        console.log(`Запрошены сообщения для чата: ${chatId}`);
        
        if (!chatId) {
          console.error("Ошибка: отсутствует параметр chatId");
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
            JSON.stringify({ error: "Ошибка получения сообщений", details: messagesError.message }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }

        console.log(`Найдено ${messages?.length || 0} сообщений для чата ${chatId}`);

        // Помечаем сообщения от админа как прочитанные
        if (messages && messages.length > 0) {
          const unreadAdminMessages = messages
            .filter(msg => msg.is_from_admin && !msg.is_read)
            .map(msg => msg.id);
          
          if (unreadAdminMessages.length > 0) {
            console.log(`Помечаем как прочитанные ${unreadAdminMessages.length} сообщений`);
            const { error: updateError } = await supabase
              .from("chat_messages")
              .update({ is_read: true })
              .in("id", unreadAdminMessages);
            
            if (updateError) {
              console.error("Error marking messages as read:", updateError);
            }
          }
        }

        return new Response(
          JSON.stringify({ messages: messages || [] }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      } catch (error) {
        console.error("Error in messages handler:", error);
        return new Response(
          JSON.stringify({ error: "Внутренняя ошибка сервера в обработчике messages", details: error.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    }

    // Простой обработчик для проверки статуса функции
    if (path === "status") {
      return new Response(
        JSON.stringify({ 
          status: "ok", 
          config: {
            telegram_bot_token_set: !!TELEGRAM_BOT_TOKEN,
            telegram_admin_chat_id_set: !!TELEGRAM_ADMIN_CHAT_ID,
            supabase_url_set: !!SUPABASE_URL,
            supabase_service_role_key_set: !!SUPABASE_SERVICE_ROLE_KEY
          }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Если путь не соответствует ни одному обработчику
    console.error(`Неизвестный путь: ${path}`);
    return new Response(
      JSON.stringify({ error: "Неверный путь" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      }
    );
  } catch (error) {
    console.error("Global error in Edge Function:", error);
    return new Response(
      JSON.stringify({ error: "Внутренняя ошибка сервера", details: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
