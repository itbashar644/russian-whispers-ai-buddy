
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (req.method === 'POST') {
      const update = await req.json()
      console.log('Received Telegram update:', JSON.stringify(update, null, 2))

      // Обработка сообщения от Telegram
      if (update.message) {
        const message = update.message
        const chatId = message.chat.id.toString()
        const telegramAdminChatId = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID')

        // Проверяем, что сообщение от админа
        if (chatId === telegramAdminChatId) {
          const messageText = message.text

          // Ищем в сообщении ID чата клиента (формат: Reply to chat ID: CHAT_ID)
          const chatIdMatch = messageText?.match(/Reply to chat ID: ([a-f0-9-]+)/i)
          if (chatIdMatch) {
            const clientChatId = chatIdMatch[1]
            
            // Извлекаем текст ответа (всё после первой строки)
            const replyText = messageText.split('\n').slice(1).join('\n').trim()
            
            if (replyText) {
              // Сохраняем ответ от админа в базу данных
              const { error } = await supabase
                .from('chat_messages')
                .insert({
                  chat_id: clientChatId,
                  message: replyText,
                  is_from_admin: true,
                  is_read: false
                })

              if (error) {
                console.error('Error saving admin message:', error)
              } else {
                console.log('Admin message saved for chat:', clientChatId)
              }
            }
          } else {
            // Если это обычное сообщение без Reply to chat ID, игнорируем
            console.log('Message from admin without chat ID reference, ignoring')
          }
        }
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in telegram-webhook:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
