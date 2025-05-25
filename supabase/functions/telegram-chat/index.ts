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

    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    switch (action) {
      case 'send':
        return await handleSendMessage(req, supabase)
      case 'messages':
        return await handleGetMessages(req, supabase)
      case 'mark-read':
        return await handleMarkAsRead(req, supabase)
      case 'status':
        return await handleStatus(req, supabase)
      case 'webhook-status':
        return await handleWebhookStatus(req, supabase)
      case 'setup-webhook':
        return await handleSetupWebhook(req, supabase)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
  } catch (error) {
    console.error('Error in telegram-chat function:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function handleSendMessage(req: Request, supabase: any) {
  const { chatId, message, name = '', email = '' } = await req.json()

  if (!chatId || !message) {
    return new Response(JSON.stringify({ error: 'Missing chatId or message' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    // Ensure chat session exists
    const { data: existingSession, error: sessionCheckError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', chatId)
      .single()

    if (sessionCheckError && sessionCheckError.code === 'PGRST116') {
      // Session doesn't exist, create it
      const { error: createSessionError } = await supabase
        .from('chat_sessions')
        .insert({
          id: chatId,
          customer_name: name,
          customer_email: email
        })

      if (createSessionError) {
        console.error('Error creating chat session:', createSessionError)
        return new Response(JSON.stringify({ error: 'Failed to create chat session' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    // Insert the message
    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        chat_id: chatId,
        message: message,
        is_from_admin: false,
        is_read: false
      })

    if (messageError) {
      console.error('Error inserting message:', messageError)
      return new Response(JSON.stringify({ error: 'Failed to save message' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Try to send to Telegram bot
    await sendToTelegramBot(chatId, message, name, email)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in handleSendMessage:', error)
    return new Response(JSON.stringify({ error: 'Failed to send message' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

async function handleGetMessages(req: Request, supabase: any) {
  const { chatId } = await req.json()

  if (!chatId) {
    return new Response(JSON.stringify({ error: 'Missing chatId' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return new Response(JSON.stringify({ error: 'Failed to fetch messages' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ messages: messages || [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in handleGetMessages:', error)
    return new Response(JSON.stringify({ error: 'Failed to get messages' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

async function handleMarkAsRead(req: Request, supabase: any) {
  const { chatId } = await req.json()

  if (!chatId) {
    return new Response(JSON.stringify({ error: 'Missing chatId' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { error } = await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('chat_id', chatId)
      .eq('is_from_admin', true)

    if (error) {
      console.error('Error marking messages as read:', error)
      return new Response(JSON.stringify({ error: 'Failed to mark messages as read' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in handleMarkAsRead:', error)
    return new Response(JSON.stringify({ error: 'Failed to mark as read' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

async function handleStatus(req: Request, supabase: any) {
  const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
  const telegramAdminChatId = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  return new Response(JSON.stringify({
    status: 'ok',
    config: {
      telegram_bot_token_set: !!telegramBotToken,
      telegram_admin_chat_id_set: !!telegramAdminChatId,
      supabase_url_set: !!supabaseUrl,
      supabase_service_role_key_set: !!supabaseServiceRoleKey
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function handleWebhookStatus(req: Request, supabase: any) {
  const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
  
  if (!telegramBotToken) {
    return new Response(JSON.stringify({ ok: false, error: 'No bot token configured' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getWebhookInfo`)
    const data = await response.json()
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

async function handleSetupWebhook(req: Request, supabase: any) {
  const { url } = await req.json()
  const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
  
  if (!telegramBotToken) {
    return new Response(JSON.stringify({ error: 'No bot token configured' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    
    const data = await response.json()
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

async function sendToTelegramBot(chatId: string, message: string, name: string, email: string) {
  const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
  const telegramAdminChatId = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID')

  if (!telegramBotToken || !telegramAdminChatId) {
    console.log('Telegram not configured, skipping bot notification')
    return
  }

  try {
    const telegramMessage = `
🔔 Новое сообщение от клиента

👤 **Имя:** ${name || 'Не указано'}
📧 **Email:** ${email || 'Не указан'}
🆔 **Chat ID:** ${chatId}

💬 **Сообщение:**
${message}

📝 Для ответа отправьте сообщение в формате:
Reply to chat ID: ${chatId}
Ваш ответ здесь...
    `.trim()

    await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramAdminChatId,
        text: telegramMessage,
        parse_mode: 'Markdown'
      })
    })
  } catch (error) {
    console.error('Error sending to Telegram:', error)
  }
}
