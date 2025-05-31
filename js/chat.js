
/**
 * Основной файл чата - обеспечивает глобальную доступность
 */

let chatModuleLoaded = false;
let chatInitialized = false;

// Функция инициализации чата, которая работает везде
function initChat() {
  console.log('Глобальная инициализация чата...');
  
  if (chatInitialized) {
    console.log('Чат уже инициализирован');
    return;
  }
  
  // Попытка загрузить модульную версию
  if (!chatModuleLoaded) {
    try {
      import('./app/chat.js').then(module => {
        chatModuleLoaded = true;
        if (module.initChat) {
          module.initChat();
          console.log('Модульный чат загружен и инициализирован');
        }
      }).catch(error => {
        console.log('Модульный чат не загружен, используем простую версию');
        initBasicChat();
      });
    } catch (error) {
      console.log('Ошибка загрузки модульного чата, используем простую версию');
      initBasicChat();
    }
  } else {
    // Модуль уже загружен, просто инициализируем
    initBasicChat();
  }
}

// Простая версия чата для совместимости
function initBasicChat() {
  if (chatInitialized) {
    console.log('Базовый чат уже инициализирован');
    return;
  }
  
  console.log('Инициализируем простую версию чата...');
  chatInitialized = true;
  
  const chatButton = document.getElementById('chat-button');
  const chatContainer = document.getElementById('chat-container');
  
  if (!chatButton || !chatContainer) {
    console.log('Элементы чата не найдены');
    return;
  }
  
  // Удаляем старые обработчики
  chatButton.replaceWith(chatButton.cloneNode(true));
  const newChatButton = document.getElementById('chat-button');
  
  newChatButton.addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (chatContainer.classList.contains('hidden')) {
      chatContainer.classList.remove('hidden');
      if (chatContainer.innerHTML.trim() === '') {
        chatContainer.innerHTML = `
          <div class="chat-header">
            <h3>Чат с оператором</h3>
            <button class="chat-close-btn" onclick="document.getElementById('chat-container').classList.add('hidden')">×</button>
          </div>
          <div class="chat-body">
            <div class="chat-messages">
              <div class="chat-message system-message">
                <div class="message-content">Здравствуйте! Чем мы можем вам помочь?</div>
              </div>
            </div>
          </div>
          <div class="chat-footer">
            <textarea placeholder="Введите сообщение..." rows="2"></textarea>
            <button class="chat-send-btn">Отправить</button>
          </div>
        `;
      }
    } else {
      chatContainer.classList.add('hidden');
    }
  });
  
  console.log('Простой чат инициализирован');
}

// Делаем функции глобально доступными
window.initChat = initChat;
window.initBasicChat = initBasicChat;

console.log('Chat.js загружен');
