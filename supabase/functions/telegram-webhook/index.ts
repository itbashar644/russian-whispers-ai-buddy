
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

        console.log('Processing message from chat ID:', chatId)
        console.log('Admin chat ID:', telegramAdminChatId)

        // Проверяем, что сообщение от админа
        if (chatId === telegramAdminChatId) {
          const messageText = message.text
          console.log('Message from admin:', messageText)

          if (!messageText) {
            console.log('No message text, skipping')
            return new Response(JSON.stringify({ ok: true }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          // Ищем в сообщении ID чата клиента (формат: Reply to chat ID: CHAT_ID)
          const chatIdMatch = messageText.match(/Reply to chat ID:\s*([^\s\n]+)/i)
          console.log('Chat ID match result:', chatIdMatch)
          
          if (chatIdMatch) {
            const clientChatId = chatIdMatch[1].trim()
            console.log('Extracted client chat ID:', clientChatId)
            
            // Извлекаем текст ответа (всё после строки с Reply to chat ID)
            const lines = messageText.split('\n')
            const replyStartIndex = lines.findIndex(line => line.toLowerCase().includes('reply to chat id:'))
            
            if (replyStartIndex >= 0 && replyStartIndex < lines.length - 1) {
              const replyText = lines.slice(replyStartIndex + 1).join('\n').trim()
              console.log('Extracted reply text:', replyText)
              
              if (replyText) {
                // Сохраняем ответ от админа в базу данных
                const { data, error } = await supabase
                  .from('chat_messages')
                  .insert({
                    chat_id: clientChatId,
                    message: replyText,
                    is_from_admin: true,
                    is_read: false
                  })
                  .select()

                if (error) {
                  console.error('Error saving admin message:', error)
                } else {
                  console.log('Admin message saved successfully:', data)
                }
              } else {
                console.log('No reply text found after chat ID line')
              }
            } else {
              console.log('Could not find reply text after chat ID line')
            }
          } else {
            console.log('Message from admin without proper chat ID reference format')
            console.log('Expected format: Reply to chat ID: <chat_id>')
          }
        } else {
          console.log('Message not from admin chat, ignoring')
        }
      } else {
        console.log('No message in update, skipping')
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
