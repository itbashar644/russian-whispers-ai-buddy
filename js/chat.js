
/**
 * Функционал чата с интеграцией с Telegram
 */

// Вспомогательные функции для работы с localStorage (если не загружены из utils.js)
if (typeof getFromStorage !== 'function') {
  function getFromStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Ошибка при чтении из localStorage (${key}):`, error);
      return defaultValue;
    }
  }
  window.getFromStorage = getFromStorage;
}

if (typeof saveToStorage !== 'function') {
  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Ошибка при сохранении в localStorage (${key}):`, error);
      return false;
    }
  }
  window.saveToStorage = saveToStorage;
}

// Глобальная переменная для предотвращения повторной инициализации
let chatInitialized = false;

// Функция для инициализации чата
function initChat() {
  console.log('Инициализируем чат...');
  
  // Предотвращаем повторную инициализацию
  if (chatInitialized) {
    console.log('Чат уже инициализирован');
    return;
  }
  
  const chatButton = document.getElementById('chat-button');
  const chatContainer = document.getElementById('chat-container');
  
  if (!chatButton || !chatContainer) {
    console.log('Элементы чата не найдены:', { 
      chatButton: !!chatButton, 
      chatContainer: !!chatContainer 
    });
    return;
  }
  
  console.log('Элементы чата найдены, добавляем обработчики');
  chatInitialized = true;
  
  // Инициализируем состояние чата
  let chatState = getFromStorage('chat_state', {
    open: false,
    messages: []
  });
  
  // Очищаем старые обработчики, если есть
  chatButton.removeEventListener('click', handleChatButtonClick);
  document.removeEventListener('click', handleDocumentClick);
  
  // Обработчик нажатия на кнопку чата
  function handleChatButtonClick(event) {
    console.log('Кнопка чата нажата');
    event.stopPropagation();
    event.preventDefault();

    if (chatContainer.classList.contains('hidden')) {
      openChat();
    } else {
      closeChat();
    }
  }
  
  // Обработчик событий на документе, чтобы закрывать чат по клику вне его
  function handleDocumentClick(event) {
    if (!chatContainer.classList.contains('hidden')) {
      const isClickInsideChat = chatContainer.contains(event.target);
      const isClickOnChatButton = chatButton.contains(event.target);
      
      if (!isClickInsideChat && !isClickOnChatButton) {
        closeChat();
      }
    }
  }
  
  // Добавляем обработчики
  chatButton.addEventListener('click', handleChatButtonClick);
  document.addEventListener('click', handleDocumentClick);
  
  // Функция для открытия чата
  function openChat() {
    console.log('Открываем чат');
    if (chatContainer.innerHTML.trim() === '' || chatContainer.classList.contains('hidden')) {
      renderChatInterface();
    }
    
    chatContainer.classList.remove('hidden');
    chatState.open = true;
    saveToStorage('chat_state', chatState);
    
    setTimeout(() => {
      scrollToLatestMessage();
    }, 100);
  }
  
  // Функция для закрытия чата
  function closeChat() {
    console.log('Закрываем чат');
    chatContainer.classList.add('hidden');
    chatState.open = false;
    saveToStorage('chat_state', chatState);
  }
  
  // Функция для рендеринга интерфейса чата
  function renderChatInterface() {
    console.log('Рендерим интерфейс чата');
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
        <textarea id="chat-input" placeholder="Введите сообщение..." rows="2" inputmode="text" enterkeyhint="send"></textarea>
        <button class="chat-send-btn" id="chat-send-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    `;
    
    chatContainer.innerHTML = chatHTML;
    
    // Добавляем обработчики событий
    const closeBtn = chatContainer.querySelector('.chat-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeChat);
    }
    
    const sendBtn = chatContainer.querySelector('#chat-send-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', function(event) {
        event.preventDefault();
        sendMessage();
      });
    }
    
    const chatInput = chatContainer.querySelector('#chat-input');
    if (chatInput) {
      chatInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          sendMessage();
        }
      });
    }
    
    // Приветственное сообщение при первом открытии
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
  
  // Функция для обновления списка сообщений
  function updateChatMessages() {
    const chatMessagesEl = chatContainer.querySelector('#chat-messages');
    if (chatMessagesEl) {
      chatMessagesEl.innerHTML = renderChatMessages();
      scrollToLatestMessage();
    }
  }
  
  // Функция для прокрутки к последнему сообщению
  function scrollToLatestMessage() {
    const chatMessagesEl = chatContainer.querySelector('#chat-messages');
    if (chatMessagesEl) {
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }
  }
  
  // Функция для форматирования даты
  function formatDate(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  // Функция для отправки сообщения
  function sendMessage() {
    const chatInput = chatContainer.querySelector('#chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Добавляем сообщение пользователя
    addUserMessage(message);
    
    // Очищаем поле ввода
    chatInput.value = '';
    
    // Демо ответ через 2 секунды
    setTimeout(() => {
      addOperatorMessage('Спасибо за обращение! Как я могу вам помочь?');
    }, 2000);
  }
  
  // Восстанавливаем состояние чата
  if (chatState.open) {
    openChat();
  }
  
  console.log('Чат инициализирован');
}

// Делаем функцию глобально доступной
window.initChat = initChat;

// НЕ автоинициализируем чат здесь - это делается в main.js
