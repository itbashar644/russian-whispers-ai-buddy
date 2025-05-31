
/**
 * Упрощенный чат без модульных зависимостей
 */

let chatInitialized = false;
let chatState = null;

// Функция инициализации чата
function initChat() {
  console.log('Инициализируем чат...');
  
  if (chatInitialized) {
    console.log('Чат уже инициализирован');
    return;
  }
  
  const chatButton = document.getElementById('chat-button');
  const chatContainer = document.getElementById('chat-container');
  
  if (!chatButton || !chatContainer) {
    console.log('Элементы чата не найдены');
    return;
  }
  
  chatInitialized = true;
  
  // Инициализируем состояние чата
  chatState = getFromStorage('chat_state', {
    open: false,
    messages: []
  });
  
  // Очищаем старые обработчики
  const newChatButton = chatButton.cloneNode(true);
  chatButton.parentNode.replaceChild(newChatButton, chatButton);
  
  // Добавляем обработчик клика
  document.getElementById('chat-button').addEventListener('click', handleChatButtonClick);
  
  // Добавляем обработчик клика вне чата
  document.addEventListener('click', handleDocumentClick);
  
  console.log('Чат инициализирован');
}

function handleChatButtonClick(event) {
  console.log('Кнопка чата нажата');
  event.stopPropagation();
  event.preventDefault();

  const chatContainer = document.getElementById('chat-container');
  if (chatContainer.classList.contains('hidden')) {
    openChat();
  } else {
    closeChat();
  }
}

function handleDocumentClick(event) {
  const chatContainer = document.getElementById('chat-container');
  const chatButton = document.getElementById('chat-button');
  
  if (!chatContainer.classList.contains('hidden')) {
    const isClickInsideChat = chatContainer.contains(event.target);
    const isClickOnChatButton = chatButton && chatButton.contains(event.target);
    
    if (!isClickInsideChat && !isClickOnChatButton) {
      closeChat();
    }
  }
}

function openChat() {
  console.log('Открываем чат');
  const chatContainer = document.getElementById('chat-container');
  
  if (chatContainer.innerHTML.trim() === '') {
    renderChatInterface();
  }
  
  chatContainer.classList.remove('hidden');
  chatState.open = true;
  saveToStorage('chat_state', chatState);
  
  setTimeout(() => {
    scrollToLatestMessage();
  }, 100);
}

function closeChat() {
  console.log('Закрываем чат');
  const chatContainer = document.getElementById('chat-container');
  chatContainer.classList.add('hidden');
  chatState.open = false;
  saveToStorage('chat_state', chatState);
}

function renderChatInterface() {
  console.log('Рендерим интерфейс чата');
  const chatContainer = document.getElementById('chat-container');
  
  const chatHTML = `
    <div class="chat-header">
      <h3>Чат с оператором</h3>
      <button class="chat-close-btn" onclick="closeChat()">×</button>
    </div>
    <div class="chat-body">
      <div class="chat-messages" id="chat-messages">
        ${renderChatMessages()}
      </div>
    </div>
    <div class="chat-footer">
      <textarea id="chat-input" placeholder="Введите сообщение..." rows="2"></textarea>
      <button class="chat-send-btn" onclick="sendMessage()">Отправить</button>
    </div>
  `;
  
  chatContainer.innerHTML = chatHTML;
  
  // Обработчик Enter в текстовом поле
  const chatInput = document.getElementById('chat-input');
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

function updateChatMessages() {
  const chatMessagesEl = document.getElementById('chat-messages');
  if (chatMessagesEl) {
    chatMessagesEl.innerHTML = renderChatMessages();
    scrollToLatestMessage();
  }
}

function scrollToLatestMessage() {
  const chatMessagesEl = document.getElementById('chat-messages');
  if (chatMessagesEl) {
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function sendMessage() {
  const chatInput = document.getElementById('chat-input');
  const message = chatInput.value.trim();
  
  if (!message) return;
  
  // Добавляем сообщение пользователя
  const userMessage = {
    type: 'user',
    text: message,
    time: new Date().toISOString()
  };
  
  chatState.messages.push(userMessage);
  saveToStorage('chat_state', chatState);
  updateChatMessages();
  
  // Очищаем поле ввода
  chatInput.value = '';
  
  // Демо ответ через 2 секунды
  setTimeout(() => {
    const operatorMessage = {
      type: 'operator',
      text: 'Спасибо за ваше сообщение! Наш оператор свяжется с вами в ближайшее время.',
      time: new Date().toISOString()
    };
    
    chatState.messages.push(operatorMessage);
    saveToStorage('chat_state', chatState);
    updateChatMessages();
  }, 2000);
}

// Делаем функции глобально доступными
window.initChat = initChat;
window.openChat = openChat;
window.closeChat = closeChat;
window.sendMessage = sendMessage;
