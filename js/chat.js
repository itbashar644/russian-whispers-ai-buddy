
/**
 * Функционал чата на сайте
 */

let chatOpen = false;
let messages = [];

// Инициализация чата при загрузке страницы
function initChat() {
  const chatButton = document.createElement('button');
  chatButton.className = 'chat-button';
  chatButton.innerHTML = '<i class="fas fa-comment"></i>';
  chatButton.setAttribute('aria-label', 'Открыть чат');
  
  const chatWindow = document.createElement('div');
  chatWindow.className = 'chat-window';
  chatWindow.innerHTML = `
    <div class="chat-header">
      <h3>Чат с поддержкой</h3>
      <button class="chat-close-btn"><i class="fas fa-times"></i></button>
    </div>
    <div class="chat-messages"></div>
    <div class="chat-input-area">
      <input type="text" placeholder="Введите сообщение...">
      <button>Отправить</button>
    </div>
  `;
  
  document.body.appendChild(chatButton);
  document.body.appendChild(chatWindow);
  
  // Обработчик клика по кнопке чата
  chatButton.addEventListener('click', function() {
    toggleChat();
  });
  
  // Обработчик клика по кнопке закрытия
  const closeButton = chatWindow.querySelector('.chat-close-btn');
  closeButton.addEventListener('click', function() {
    toggleChat();
  });
  
  // Обработчик отправки сообщения
  const inputArea = chatWindow.querySelector('.chat-input-area');
  const input = inputArea.querySelector('input');
  const sendButton = inputArea.querySelector('button');
  
  function sendMessage() {
    const message = input.value.trim();
    if (message) {
      addMessage(message, 'user');
      input.value = '';
      
      // Отправка сообщения на сервер Telegram
      sendToTelegram(message);
      
      // Имитация ответа от поддержки (в реальном приложении здесь будет получение ответа от сервера)
      setTimeout(() => {
        addMessage('Спасибо за сообщение! Мы свяжемся с вами в ближайшее время.', 'admin');
      }, 1000);
    }
  }
  
  sendButton.addEventListener('click', sendMessage);
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Загрузка истории сообщений
  loadMessages();
}

// Переключение отображения чата
function toggleChat() {
  const chatWindow = document.querySelector('.chat-window');
  chatOpen = !chatOpen;
  
  if (chatOpen) {
    chatWindow.classList.add('open');
    loadMessages(); // При открытии загружаем сообщения
  } else {
    chatWindow.classList.remove('open');
  }
}

// Добавление сообщения в чат
function addMessage(text, sender) {
  const chatMessages = document.querySelector('.chat-messages');
  const messageElement = document.createElement('div');
  messageElement.className = `chat-message ${sender}`;
  
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  messageElement.innerHTML = `
    <div class="message-content">${text}</div>
    <div class="time">${time}</div>
  `;
  
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Сохраняем сообщение
  messages.push({
    text,
    sender,
    time
  });
  
  try {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  } catch (e) {
    console.error('Не удалось сохранить сообщения чата:', e);
  }
}

// Загрузка истории сообщений
function loadMessages() {
  try {
    const savedMessages = localStorage.getItem('chat_messages');
    if (savedMessages) {
      messages = JSON.parse(savedMessages);
      
      const chatMessages = document.querySelector('.chat-messages');
      chatMessages.innerHTML = '';
      
      messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${msg.sender}`;
        
        messageElement.innerHTML = `
          <div class="message-content">${msg.text}</div>
          <div class="time">${msg.time}</div>
        `;
        
        chatMessages.appendChild(messageElement);
      });
      
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  } catch (e) {
    console.error('Не удалось загрузить сообщения чата:', e);
  }
}

// Функция для отправки сообщения на сервер Telegram
function sendToTelegram(message) {
  // Получаем ID чата из localStorage или генерируем новый, если его нет
  let chatId = localStorage.getItem('chat_id');
  if (!chatId) {
    chatId = 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('chat_id', chatId);
  }
  
  // Данные для отправки
  const data = {
    chat_id: chatId,
    message: message
  };
  
  // Отправляем запрос на сервер
  fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/functions/v1/telegram-chat/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.apiKey}`
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка отправки сообщения');
    }
    return response.json();
  })
  .then(data => {
    console.log('Сообщение успешно отправлено в Telegram', data);
  })
  .catch(error => {
    console.error('Ошибка при отправке сообщения в Telegram:', error);
  });
}

// Функция для проверки новых сообщений
function checkNewMessages() {
  // Получаем ID чата из localStorage
  const chatId = localStorage.getItem('chat_id');
  if (!chatId) return;
  
  fetch(`https://lpwvhyawvxibtuxfhitx.supabase.co/functions/v1/telegram-chat/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.apiKey}`
    },
    body: JSON.stringify({ chatId })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка получения сообщений');
    }
    return response.json();
  })
  .then(data => {
    if (data && data.messages) {
      const chatMessages = document.querySelector('.chat-messages');
      let hasNewMessages = false;
      
      // Проверяем, есть ли новые сообщения от администратора, которых нет в нашем массиве
      data.messages.forEach(serverMsg => {
        if (
          serverMsg.is_from_admin && 
          !messages.some(localMsg => 
            localMsg.text === serverMsg.message && 
            localMsg.sender === 'admin'
          )
        ) {
          // Добавляем новое сообщение
          addMessage(serverMsg.message, 'admin');
          hasNewMessages = true;
        }
      });
      
      // Если есть новые сообщения, отметить их как прочитанные
      if (hasNewMessages && !chatOpen) {
        const chatButton = document.querySelector('.chat-button');
        chatButton.classList.add('has-new-message');
        
        // Анимация для привлечения внимания
        chatButton.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.2)' },
          { transform: 'scale(1)' }
        ], {
          duration: 1000,
          iterations: 3
        });
      }
      
      // Прокрутка вниз, если чат открыт
      if (chatOpen) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Отмечаем сообщения как прочитанные
        fetch(`https://lpwvhyawvxibtuxfhitx.supabase.co/functions/v1/telegram-chat/mark-read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.apiKey}`
          },
          body: JSON.stringify({ chatId })
        }).catch(error => {
          console.error('Ошибка при отметке сообщений как прочитанные:', error);
        });
      }
    }
  })
  .catch(error => {
    console.error('Ошибка при получении сообщений:', error);
  });
}

// Инициализация чата при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  initChat();
  
  // Проверяем новые сообщения каждые 10 секунд
  setInterval(checkNewMessages, 10000);
});
