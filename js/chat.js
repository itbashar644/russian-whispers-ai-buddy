
/**
 * Функционал чата с интеграцией с Telegram
 */

// Функция для инициализации чата
function initChat() {
  const chatButton = document.getElementById('chat-button');
  const chatContainer = document.getElementById('chat-container');
  
  if (!chatButton || !chatContainer) return;
  
  // Инициализируем состояние чата
  let chatState = getFromStorage('chat_state', {
    open: false,
    messages: []
  });
  
  // Обработчик нажатия на кнопку чата
  chatButton.addEventListener('click', function() {
    if (chatContainer.classList.contains('hidden')) {
      openChat();
    } else {
      closeChat();
    }
  });
  
  // Обработчик событий на документе, чтобы закрывать чат по клику вне его
  document.addEventListener('click', function(event) {
    if (!chatContainer.classList.contains('hidden')) {
      // Проверяем, был ли клик вне чата и не по кнопке чата
      const isClickInsideChat = chatContainer.contains(event.target);
      const isClickOnChatButton = chatButton.contains(event.target);
      
      if (!isClickInsideChat && !isClickOnChatButton) {
        closeChat();
      }
    }
  });
  
  // Функция для открытия чата
  function openChat() {
    // Проверяем, есть ли уже интерфейс чата
    if (chatContainer.innerHTML.trim() === '' || chatContainer.classList.contains('hidden')) {
      renderChatInterface();
    }
    
    chatContainer.classList.remove('hidden');
    chatState.open = true;
    saveToStorage('chat_state', chatState);
    
    // Прокручиваем до последнего сообщения
    scrollToLatestMessage();
  }
  
  // Функция для закрытия чата
  function closeChat() {
    chatContainer.classList.add('hidden');
    chatState.open = false;
    saveToStorage('chat_state', chatState);
  }
  
  // Функция для рендеринга интерфейса чата
  function renderChatInterface() {
    const chatHTML = `
      <div class="chat-header">
        <h3>Чат с оператором</h3>
        <button class="chat-close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="chat-body">
        <div class="chat-messages" id="chat-messages">
          ${renderChatMessages()}
        </div>
      </div>
      <div class="chat-footer">
        <textarea id="chat-input" placeholder="Введите сообщение..." rows="2"></textarea>
        <button class="chat-send-btn" id="chat-send-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    `;
    
    chatContainer.innerHTML = chatHTML;
    
    // Добавляем обработчики событий для интерфейса чата
    document.querySelector('.chat-close-btn').addEventListener('click', closeChat);
    document.getElementById('chat-send-btn').addEventListener('click', sendMessage);
    
    const chatInput = document.getElementById('chat-input');
    chatInput.addEventListener('keydown', function(event) {
      // Отправка сообщения по нажатию Enter без Shift
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    });
    
    // Если это первое открытие чата, добавляем приветственное сообщение
    if (chatState.messages.length === 0) {
      addSystemMessage('Здравствуйте! Чем мы можем вам помочь?');
    }
  }
  
  // Функция для рендеринга сообщений чата
  function renderChatMessages() {
    return chatState.messages.map(message => {
      let messageClass = '';
      let nameLabel = '';
      
      switch (message.type) {
        case 'user':
          messageClass = 'user-message';
          nameLabel = 'Вы';
          break;
        case 'operator':
          messageClass = 'operator-message';
          nameLabel = 'Оператор';
          break;
        case 'system':
          messageClass = 'system-message';
          nameLabel = 'Система';
          break;
        default:
          messageClass = '';
          nameLabel = '';
      }
      
      return `
        <div class="chat-message ${messageClass}">
          <span class="message-name">${nameLabel}</span>
          <div class="message-content">${message.text}</div>
          <span class="message-time">${formatDate(message.time)}</span>
        </div>
      `;
    }).join('');
  }
  
  // Функция для добавления сообщения пользователя
  function addUserMessage(text) {
    const message = {
      type: 'user',
      text: text,
      time: new Date().toISOString()
    };
    
    chatState.messages.push(message);
    saveToStorage('chat_state', chatState);
    
    updateChatMessages();
  }
  
  // Функция для добавления сообщения оператора
  function addOperatorMessage(text) {
    const message = {
      type: 'operator',
      text: text,
      time: new Date().toISOString()
    };
    
    chatState.messages.push(message);
    saveToStorage('chat_state', chatState);
    
    updateChatMessages();
  }
  
  // Функция для добавления системного сообщения
  function addSystemMessage(text) {
    const message = {
      type: 'system',
      text: text,
      time: new Date().toISOString()
    };
    
    chatState.messages.push(message);
    saveToStorage('chat_state', chatState);
    
    updateChatMessages();
  }
  
  // Функция для обновления списка сообщений в интерфейсе
  function updateChatMessages() {
    const chatMessagesEl = document.getElementById('chat-messages');
    if (chatMessagesEl) {
      chatMessagesEl.innerHTML = renderChatMessages();
      scrollToLatestMessage();
    }
  }
  
  // Функция для прокрутки к последнему сообщению
  function scrollToLatestMessage() {
    const chatMessagesEl = document.getElementById('chat-messages');
    if (chatMessagesEl) {
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }
  }
  
  // Функция для форматирования даты сообщения
  function formatDate(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }
  
  // Функция для отправки сообщения
  function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Добавляем сообщение пользователя
    addUserMessage(message);
    
    // Очищаем поле ввода
    chatInput.value = '';
    
    // Отправляем сообщение в Telegram и ждем ответа оператора
    sendMessageToTelegram(message)
      .then(() => {
        addSystemMessage('Сообщение отправлено оператору. Ожидайте ответа.');
        
        // Здесь можно реализовать long polling для получения ответа от оператора
        // Для демонстрации добавим заглушку с автоматическим ответом через 2 секунды
        setTimeout(() => {
          addOperatorMessage('Спасибо за обращение! Как я могу вам помочь?');
        }, 2000);
      })
      .catch(error => {
        console.error('Ошибка при отправке сообщения в Telegram:', error);
        addSystemMessage('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.');
      });
  }
  
  // Функция для отправки сообщения в Telegram
  async function sendMessageToTelegram(message) {
    try {
      const TELEGRAM_TOKEN = CONFIG.telegramBotToken;
      const CHAT_ID = CONFIG.telegramChatId;
      
      if (!TELEGRAM_TOKEN || !CHAT_ID) {
        console.error('Не настроены параметры для отправки в Telegram');
        throw new Error('Не настроены параметры для отправки в Telegram');
      }
      
      // Формируем текст сообщения с информацией о странице
      const userInfo = {
        page: window.location.pathname,
        referrer: document.referrer || 'none',
        timestamp: new Date().toISOString()
      };
      
      const formattedMessage = `
🔔 Новое сообщение из чата на сайте:

💬 Сообщение:
${message}

📄 Информация:
- Страница: ${userInfo.page}
- Источник: ${userInfo.referrer}
- Время: ${userInfo.timestamp}
      `;
      
      // Отправляем сообщение через Telegram API
      const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: formattedMessage,
          parse_mode: 'HTML'
        })
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при отправке сообщения в Telegram');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка при отправке сообщения в Telegram:', error);
      throw error;
    }
  }
  
  // Восстанавливаем состояние чата
  if (chatState.open) {
    openChat();
  }
}

// Инициализируем чат при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  initChat();
});
