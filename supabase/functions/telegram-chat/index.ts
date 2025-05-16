
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// Configuration for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Handle options requests for CORS
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  return null;
}

// Supabase client initialization
function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  return createClient(supabaseUrl, supabaseKey);
}

// Function to send message to Telegram
async function sendTelegramMessage(text: string) {
  try {
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID');
    
    if (!botToken || !chatId) {
      console.error('Telegram configuration is missing');
      return false;
    }
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });
    
    const result = await response.json();
    console.log('Telegram message sent:', result);
    return result.ok === true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
}

// Process incoming message from the website chat
async function handleIncomingMessage(req: Request) {
  try {
    const { message, chatId, name, email } = await req.json();
    const supabase = getSupabaseClient();
    
    console.log(`Received message from chat ${chatId}: ${message}`);
    
    // Ensure chat session exists first
    const { data: chatSession, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', chatId)
      .maybeSingle();
      
    if (!chatSession) {
      // Create chat session if it doesn't exist
      const { error: createSessionError } = await supabase
        .from('chat_sessions')
        .insert({
          id: chatId,
          customer_name: name || '',
          customer_email: email || null
        });
      
      if (createSessionError) {
        console.error('Error creating chat session:', createSessionError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create chat session' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }
    
    // Store message in Supabase
    const { error: dbError } = await supabase
      .from('chat_messages')
      .insert({
        chat_id: chatId,
        message: message,
        is_from_admin: false,
        is_read: false,
      });
    
    if (dbError) {
      console.error('Error storing message:', dbError);
      return new Response(
        JSON.stringify({ success: false, error: 'Database error', details: dbError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Forward message to Telegram admin
    const userInfo = name ? `${name} (${email || 'No email'})` : `User (${email || 'Anonymous'})`;
    const telegramText = `<b>New message from ${userInfo}</b>\n\nChat ID: ${chatId}\n\nMessage: ${message}`;
    
    const telegramResult = await sendTelegramMessage(telegramText);
    
    return new Response(
      JSON.stringify({ success: true, telegramSent: telegramResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error processing incoming message:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// Get messages for a chat ID
async function getMessagesForChat(req: Request) {
  try {
    const { chatId } = await req.json();
    const supabase = getSupabaseClient();
    
    // Ensure chat session exists
    const { data: chatSession, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', chatId)
      .maybeSingle();
      
    if (!chatSession) {
      // Create chat session if it doesn't exist
      const { error: createSessionError } = await supabase
        .from('chat_sessions')
        .insert({
          id: chatId,
          customer_name: '',
          customer_email: null
        });
      
      if (createSessionError) {
        console.error('Error creating chat session:', createSessionError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create chat session' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }
    
    // Get messages for this chat
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    
    if (messagesError) {
      console.error('Error getting messages:', messagesError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to get messages' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, messages: messages || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error in getMessagesForChat:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// Process webhook updates from Telegram
async function handleTelegramWebhook(req: Request) {
  try {
    const update = await req.json();
    console.log('Received Telegram update:', JSON.stringify(update));
    
    // We only care about message updates with text
    if (!update.message || !update.message.text) {
      return new Response(JSON.stringify({ success: true, action: 'ignored' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }
    
    const text = update.message.text;
    const supabase = getSupabaseClient();
    
    // Check if this is a reply to a chat message
    // Format expected: "CHAT_ID: message content" or "REPLY:CHAT_ID:message content"
    const chatIdMatch = text.match(/^(?:REPLY:)?([a-zA-Z0-9-]+):(.+)/s);
    
    if (!chatIdMatch) {
      console.log('Message format not recognized for chat reply');
      return new Response(JSON.stringify({ 
          success: true, 
          action: 'ignored',
          message: 'To reply to a user, use format: CHAT_ID: your message or REPLY:CHAT_ID:your message' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }
    
    const chatId = chatIdMatch[1];
    const replyMessage = chatIdMatch[2].trim();
    
    console.log(`Sending admin reply to chat ${chatId}: ${replyMessage}`);
    
    // Ensure chat session exists
    const { data: chatSession, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', chatId)
      .maybeSingle();
      
    if (!chatSession) {
      // Create chat session if it doesn't exist
      const { error: createSessionError } = await supabase
        .from('chat_sessions')
        .insert({
          id: chatId,
          customer_name: '',
          customer_email: null
        });
      
      if (createSessionError) {
        console.error('Error creating chat session:', createSessionError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create chat session' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }
    
    // Store admin reply in database
    const { error: dbError } = await supabase
      .from('chat_messages')
      .insert({
        chat_id: chatId,
        message: replyMessage,
        is_from_admin: true,
        is_read: false,
      });
    
    if (dbError) {
      console.error('Error storing admin reply:', dbError);
      return new Response(
        JSON.stringify({ success: false, error: 'Database error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        action: 'reply_sent',
        chatId: chatId,
        message: replyMessage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// Configure Telegram webhook
async function setupTelegramWebhook(req: Request) {
  try {
    const { url } = await req.json();
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    
    if (!botToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'Bot token not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log(`Setting up Telegram webhook to: ${url}`);
    
    // Set the webhook
    const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        allowed_updates: ['message'],
      }),
    });
    
    const result = await response.json();
    console.log('Webhook setup result:', result);
    
    // Get webhook info
    const infoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
    const info = await infoResponse.json();
    
    return new Response(
      JSON.stringify({ success: result.ok === true, webhook: info.result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error setting up webhook:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// Get webhook status
async function getWebhookStatus(req: Request) {
  try {
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    
    if (!botToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'Bot token not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
    const result = await response.json();
    
    return new Response(
      JSON.stringify({ success: result.ok === true, webhook: result.result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error getting webhook status:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// Main handler function
Deno.serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  // Get request path
  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();
  
  // Route to appropriate handler
  switch (path) {
    case 'webhook':
      return handleTelegramWebhook(req);
    case 'send':
      return handleIncomingMessage(req);
    case 'setup-webhook':
      return setupTelegramWebhook(req);
    case 'webhook-status':
      return getWebhookStatus(req);
    case 'messages':
      return getMessagesForChat(req);
    case 'mark-read':
      // TODO: Implement mark as read functionality
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    case 'status':
      // Basic status endpoint to check if function is running
      return new Response(
        JSON.stringify({ 
          status: "ok", 
          config: {
            telegram_bot_token_set: !!Deno.env.get('TELEGRAM_BOT_TOKEN'),
            telegram_admin_chat_id_set: !!Deno.env.get('TELEGRAM_ADMIN_CHAT_ID'),
            supabase_url_set: !!Deno.env.get('SUPABASE_URL'),
            supabase_service_role_key_set: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    default:
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid endpoint' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
  }
});
