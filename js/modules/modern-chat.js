
/**
 * Современный модуль чата
 */

class ModernChat {
  constructor() {
    this.chatState = null;
    this.init();
  }

  init() {
    this.chatState = this.getFromStorage('chat_state', {
      open: false,
      messages: []
    });
    
    this.bindEvents();
  }

  getFromStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Ошибка при чтении из localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Ошибка при сохранении в localStorage (${key}):`, error);
      return false;
    }
  }

  bindEvents() {
    const chatButton = document.getElementById('chat-button');
    const chatContainer = document.getElementById('chat-container');
    
    if (!chatButton || !chatContainer) return;
    
    chatButton.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.toggleChat();
    });
    
    document.addEventListener('click', (event) => {
      if (!chatContainer.classList.contains('hidden')) {
        const isClickInsideChat = chatContainer.contains(event.target);
        const isClickOnChatButton = chatButton && chatButton.contains(event.target);
        
        if (!isClickInsideChat && !isClickOnChatButton) {
          this.closeChat();
        }
      }
    });
  }

  toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer.classList.contains('hidden')) {
      this.openChat();
    } else {
      this.closeChat();
    }
  }

  openChat() {
    const chatContainer = document.getElementById('chat-container');
    
    if (chatContainer.innerHTML.trim() === '') {
      this.renderChatInterface();
    }
    
    chatContainer.classList.remove('hidden');
    this.chatState.open = true;
    this.saveToStorage('chat_state', this.chatState);
    
    setTimeout(() => {
      this.scrollToLatestMessage();
    }, 100);
  }

  closeChat() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.classList.add('hidden');
    this.chatState.open = false;
    this.saveToStorage('chat_state', this.chatState);
  }

  renderChatInterface() {
    const chatContainer = document.getElementById('chat-container');
    
    const chatHTML = `
      <div class="modern-chat-header">
        <div class="chat-header-info">
          <div class="operator-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div class="chat-header-text">
            <h3>Поддержка</h3>
            <span class="status-online">Online</span>
          </div>
        </div>
        <button class="modern-chat-close-btn" onclick="modernChat.closeChat()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="modern-chat-body">
        <div class="modern-chat-messages" id="chat-messages">
          ${this.renderChatMessages()}
        </div>
      </div>
      <div class="modern-chat-footer">
        <div class="chat-input-container">
          <textarea id="chat-input" placeholder="Напишите сообщение..." rows="1"></textarea>
          <button class="modern-chat-send-btn" id="chat-send-btn" onclick="modernChat.sendMessage()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4z"></path></svg>
          </button>
        </div>
      </div>
    `;
    
    chatContainer.innerHTML = chatHTML;
    
    const chatInput = chatContainer.querySelector('#chat-input');
    if (chatInput) {
      chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          this.sendMessage();
        }
      });

      // Автоматическое изменение высоты textarea
      chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
      });
    }
    
    if (this.chatState.messages.length === 0) {
      this.addSystemMessage('Здравствуйте! Как мы можем вам помочь? 😊');
    }
  }

  renderChatMessages() {
    return this.chatState.messages.map(message => {
      let messageClass = '';
      let nameLabel = '';
      let avatar = '';
      
      switch (message.type) {
        case 'user':
          messageClass = 'user-message';
          nameLabel = 'Вы';
          avatar = '<div class="message-avatar user-avatar">👤</div>';
          break;
        case 'operator':
          messageClass = 'operator-message';
          nameLabel = 'Поддержка';
          avatar = '<div class="message-avatar operator-avatar">🎧</div>';
          break;
        case 'system':
          messageClass = 'system-message';
          nameLabel = 'Система';
          avatar = '<div class="message-avatar system-avatar">ℹ️</div>';
          break;
        default:
          messageClass = '';
          nameLabel = '';
          avatar = '';
      }
      
      return `
        <div class="modern-chat-message ${messageClass}">
          ${avatar}
          <div class="message-bubble">
            <div class="message-content">${message.text}</div>
            <div class="message-time">${this.formatDate(message.time)}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  addSystemMessage(text) {
    const message = {
      type: 'system',
      text: text,
      time: new Date().toISOString()
    };
    
    this.chatState.messages.push(message);
    this.saveToStorage('chat_state', this.chatState);
    this.updateChatMessages();
  }

  updateChatMessages() {
    const chatContainer = document.getElementById('chat-container');
    const chatMessagesEl = chatContainer.querySelector('#chat-messages');
    if (chatMessagesEl) {
      chatMessagesEl.innerHTML = this.renderChatMessages();
      this.scrollToLatestMessage();
    }
  }

  scrollToLatestMessage() {
    const chatContainer = document.getElementById('chat-container');
    const chatMessagesEl = chatContainer.querySelector('#chat-messages');
    if (chatMessagesEl) {
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  sendMessage() {
    const chatContainer = document.getElementById('chat-container');
    const chatInput = chatContainer.querySelector('#chat-input');
    
    if (!chatInput) {
      console.error('Поле ввода чата не найдено');
      return;
    }
    
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    const userMessage = {
      type: 'user',
      text: message,
      time: new Date().toISOString()
    };
    
    this.chatState.messages.push(userMessage);
    this.saveToStorage('chat_state', this.chatState);
    this.updateChatMessages();
    
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Показать индикатор печатания
    this.showTypingIndicator();
    
    setTimeout(() => {
      this.hideTypingIndicator();
      const responses = [
        'Спасибо за ваше сообщение! Мы обязательно вам поможем.',
        'Отличный вопрос! Наш специалист скоро ответит.',
        'Мы получили ваше сообщение и обрабатываем его.',
        'Спасибо за обращение! Как можем помочь?'
      ];
      
      const operatorMessage = {
        type: 'operator',
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toISOString()
      };
      
      this.chatState.messages.push(operatorMessage);
      this.saveToStorage('chat_state', this.chatState);
      this.updateChatMessages();
    }, 1500 + Math.random() * 1000);
  }

  showTypingIndicator() {
    const chatMessagesEl = document.querySelector('#chat-messages');
    if (chatMessagesEl) {
      const typingIndicator = document.createElement('div');
      typingIndicator.id = 'typing-indicator';
      typingIndicator.className = 'modern-chat-message operator-message typing';
      typingIndicator.innerHTML = `
        <div class="message-avatar operator-avatar">🎧</div>
        <div class="message-bubble">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      `;
      chatMessagesEl.appendChild(typingIndicator);
      this.scrollToLatestMessage();
    }
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
}

// Глобальный экземпляр
window.modernChat = new ModernChat();
