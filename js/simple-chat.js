
/**
 * Простой и надежный чат - полная перезаписка
 */

class SimpleChat {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    console.log('Инициализация простого чата...');
    
    const chatButton = document.getElementById('chat-button');
    const chatContainer = document.getElementById('chat-container');
    
    if (!chatButton || !chatContainer) {
      console.log('Элементы чата не найдены');
      return;
    }
    
    // Загружаем сохраненные сообщения
    this.loadMessages();
    
    // Добавляем обработчик на кнопку
    chatButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });
    
    // Закрытие чата при клике вне его
    document.addEventListener('click', (e) => {
      if (this.isOpen && !chatContainer.contains(e.target) && !chatButton.contains(e.target)) {
        this.close();
      }
    });
    
    this.initialized = true;
    console.log('Простой чат инициализирован');
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  open() {
    console.log('Открываем чат');
    const chatContainer = document.getElementById('chat-container');
    
    if (!chatContainer) return;
    
    this.render();
    chatContainer.classList.remove('hidden');
    this.isOpen = true;
    
    // Фокус на поле ввода
    setTimeout(() => {
      const input = chatContainer.querySelector('#chat-input');
      if (input) input.focus();
    }, 100);
  }
  
  close() {
    console.log('Закрываем чат');
    const chatContainer = document.getElementById('chat-container');
    
    if (!chatContainer) return;
    
    chatContainer.classList.add('hidden');
    this.isOpen = false;
  }
  
  render() {
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) return;
    
    chatContainer.innerHTML = `
      <div class="chat-header">
        <h3>Чат с оператором</h3>
        <button class="chat-close-btn" onclick="window.simpleChat.close()">×</button>
      </div>
      <div class="chat-body">
        <div class="chat-messages" id="chat-messages">
          ${this.renderMessages()}
        </div>
      </div>
      <div class="chat-footer">
        <textarea id="chat-input" placeholder="Введите сообщение..." rows="2"></textarea>
        <button id="chat-send-btn" onclick="window.simpleChat.sendMessage()">Отправить</button>
      </div>
    `;
    
    // Обработчик Enter
    const input = chatContainer.querySelector('#chat-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
    
    this.scrollToBottom();
  }
  
  renderMessages() {
    if (this.messages.length === 0) {
      return `
        <div class="chat-message system-message">
          <div class="message-content">Здравствуйте! Чем мы можем вам помочь?</div>
        </div>
      `;
    }
    
    return this.messages.map(msg => `
      <div class="chat-message ${msg.type}-message">
        <div class="message-content">${msg.text}</div>
        <div class="message-time">${this.formatTime(msg.time)}</div>
      </div>
    `).join('');
  }
  
  sendMessage() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    
    const text = input.value.trim();
    if (!text) return;
    
    // Добавляем сообщение пользователя
    this.addMessage('user', text);
    input.value = '';
    
    // Имитируем ответ оператора
    setTimeout(() => {
      this.addMessage('operator', 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.');
    }, 1000);
  }
  
  addMessage(type, text) {
    const message = {
      type: type,
      text: text,
      time: new Date().toISOString()
    };
    
    this.messages.push(message);
    this.saveMessages();
    
    if (this.isOpen) {
      this.updateMessages();
    }
  }
  
  updateMessages() {
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
      messagesContainer.innerHTML = this.renderMessages();
      this.scrollToBottom();
    }
  }
  
  scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
  
  formatTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  
  loadMessages() {
    try {
      const saved = localStorage.getItem('chat_messages');
      this.messages = saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Ошибка загрузки сообщений чата:', error);
      this.messages = [];
    }
  }
  
  saveMessages() {
    try {
      localStorage.setItem('chat_messages', JSON.stringify(this.messages));
    } catch (error) {
      console.error('Ошибка сохранения сообщений чата:', error);
    }
  }
}

// Создаем глобальный экземпляр чата
window.simpleChat = new SimpleChat();

// Инициализируем чат при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.simpleChat.init();
  });
} else {
  window.simpleChat.init();
}
