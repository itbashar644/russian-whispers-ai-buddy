// Chat widget for buyers
// Depends on CONFIG from config.js

(function() {
  const CHAT_BUTTON_ID = 'chat-button';
  const CHAT_WINDOW_ID = 'chat-window';
  const POLL_INTERVAL = 10000; // 10 seconds
  let pollingTimer = null;

  document.addEventListener('DOMContentLoaded', initChatWidget);

  function getChatId() {
    let id = localStorage.getItem('chat_id');
    if (!id) {
      id = Date.now().toString(36) + Math.random().toString(36).substring(2);
      localStorage.setItem('chat_id', id);
    }
    return id;
  }

  async function fetchMessages() {
    try {
      const response = await fetch(`${CONFIG.supabaseUrl}/functions/v1/telegram-chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.supabaseKey}`
        },
        body: JSON.stringify({ chatId: getChatId() })
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data.messages || [];
    } catch (e) {
      console.error('Failed to fetch chat messages', e);
      return [];
    }
  }

  async function markMessagesAsRead() {
    try {
      await fetch(`${CONFIG.supabaseUrl}/functions/v1/telegram-chat/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.supabaseKey}`
        },
        body: JSON.stringify({ chatId: getChatId() })
      });
    } catch (e) {
      console.error('Failed to mark messages as read', e);
    }
  }

  async function sendMessage(text) {
    try {
      const response = await fetch(`${CONFIG.supabaseUrl}/functions/v1/telegram-chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.supabaseKey}`
        },
        body: JSON.stringify({ chatId: getChatId(), message: text })
      });
      return response.ok;
    } catch (e) {
      console.error('Failed to send chat message', e);
      return false;
    }
  }

  function createElements() {
    const button = document.createElement('button');
    button.id = CHAT_BUTTON_ID;
    button.className = 'chat-button';
    button.type = 'button';
    button.textContent = 'Чат';

    const windowEl = document.createElement('div');
    windowEl.id = CHAT_WINDOW_ID;
    windowEl.className = 'chat-window';
    windowEl.innerHTML = `
      <div class="chat-messages"></div>
      <form class="chat-input-area">
        <input type="text" placeholder="Введите сообщение" required />
        <button type="submit">Отправить</button>
      </form>
    `;
    document.body.appendChild(button);
    document.body.appendChild(windowEl);

    return { button, windowEl };
  }

  async function renderMessages(container) {
    const messages = await fetchMessages();
    container.innerHTML = '';
    messages.forEach(msg => {
      const div = document.createElement('div');
      div.className = 'chat-message' + (msg.is_from_admin ? ' admin' : '');
      const text = document.createElement('div');
      text.textContent = msg.message;
      const time = document.createElement('div');
      time.className = 'time';
      const date = new Date(msg.created_at);
      time.textContent = date.toLocaleString();
      div.appendChild(text);
      div.appendChild(time);
      container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
  }

  function startPolling(container) {
    stopPolling();
    pollingTimer = setInterval(() => renderMessages(container), POLL_INTERVAL);
  }

  function stopPolling() {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  }

  function initChatWidget() {
    const { button, windowEl } = createElements();
    const messagesContainer = windowEl.querySelector('.chat-messages');
    const form = windowEl.querySelector('form');
    const input = form.querySelector('input');

    button.addEventListener('click', async () => {
      const isOpen = windowEl.classList.toggle('open');
      if (isOpen) {
        await renderMessages(messagesContainer);
        await markMessagesAsRead();
        startPolling(messagesContainer);
      } else {
        stopPolling();
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      await sendMessage(text);
      await renderMessages(messagesContainer);
    });
  }
})();
