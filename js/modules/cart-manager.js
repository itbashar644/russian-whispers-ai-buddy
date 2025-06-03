
/**
 * Современный модуль управления корзиной
 */

class CartManager {
  constructor() {
    this.config = {
      supabaseUrl: 'https://lpwvhyawvxibtuxfhitx.supabase.co',
      supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI'
    };
    this.init();
  }

  init() {
    this.updateCartCounter();
    this.renderCart();
    this.initCheckoutForm();
  }

  // Утилиты
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

  parsePrice(value) {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    const numeric = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
    return isNaN(numeric) ? 0 : numeric;
  }

  formatPrice(price) {
    const value = this.parsePrice(price);
    return value.toLocaleString('ru-RU') + ' ₽';
  }

  // Функции корзины
  removeFromCart(productId) {
    const cart = this.getFromStorage('cart', []);
    const updatedCart = cart.filter(item => item.id !== productId);
    this.saveToStorage('cart', updatedCart);
    this.updateCartCounter();
    this.renderCart();
    this.showNotification('Товар удален из корзины', 'success');
  }

  updateCartQuantity(productId, quantity) {
    const cart = this.getFromStorage('cart', []);
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveToStorage('cart', cart);
        this.updateCartCounter();
        this.renderCart();
      }
    }
  }

  getCartTotal() {
    const cart = this.getFromStorage('cart', []);
    return cart.reduce((total, item) => {
      // Используем цену после скидки если есть, иначе обычную цену
      const price = item.discount_price || item.price;
      return total + (this.parsePrice(price) * item.quantity);
    }, 0);
  }

  clearCart() {
    this.saveToStorage('cart', []);
    this.updateCartCounter();
    this.renderCart();
    this.showNotification('Корзина очищена', 'success');
  }

  updateCartCounter() {
    const cart = this.getFromStorage('cart', []);
    const counters = document.querySelectorAll('.cart-counter');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    counters.forEach(counter => {
      counter.textContent = totalItems > 0 ? totalItems : '';
      counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
  }

  renderCart() {
    const cartContent = document.getElementById('cart-content');
    const cart = this.getFromStorage('cart', []);

    if (cart.length === 0) {
      cartContent.innerHTML = `
        <div class="empty-cart">
          <h2>Корзина пуста</h2>
          <p>Добавьте товары из каталога</p>
          <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
        </div>
      `;
      return;
    }

    const cartHTML = `
      <div class="cart-layout">
        <div class="cart-items-section">
          <h2>Товары в корзине</h2>
          <div class="cart-items">
            ${cart.map(item => {
              // Используем только цену после скидки (discount_price) если она есть, иначе обычную цену
              const displayPrice = item.discount_price || item.price;
              const itemTotal = this.parsePrice(displayPrice) * item.quantity;
              return `
                <div class="cart-item" data-id="${item.id}">
                  <div class="cart-item-image">
                    <img src="${item.image_url || '/placeholder.svg'}" alt="${item.title}" loading="lazy" onerror="this.src='/placeholder.svg'">
                  </div>
                  <div class="cart-item-info">
                    <h3>${item.title}</h3>
                    <div class="cart-item-price">${this.formatPrice(displayPrice)}</div>
                  </div>
                  <div class="cart-item-quantity">
                    <button class="quantity-btn minus" onclick="cartManager.updateCartQuantity('${item.id}', ${item.quantity - 1})">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="cartManager.updateCartQuantity('${item.id}', ${item.quantity + 1})">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                  </div>
                  <div class="cart-item-total">
                    ${this.formatPrice(itemTotal)}
                  </div>
                  <button class="remove-btn" onclick="cartManager.removeFromCart('${item.id}')" aria-label="Удалить товар">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="cart-sidebar">
          <div class="cart-summary">
            <h3>Итого: ${this.formatPrice(this.getCartTotal())}</h3>
            <div class="cart-actions">
              <button onclick="cartManager.clearCart()" class="btn btn-outline btn-full">Очистить корзину</button>
            </div>
          </div>
          
          <div class="checkout-form">
            <h3>Информация для заказа</h3>
            <form id="checkout-form">
              <div class="form-group">
                <label for="name">ФИО *</label>
                <input type="text" id="name" name="name" required>
              </div>
              
              <div class="form-group">
                <label for="phone">Телефон *</label>
                <input type="tel" id="phone" name="phone" required>
              </div>
              
              <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" required>
              </div>
              
              <div class="form-group">
                <label for="address">Адрес доставки *</label>
                <textarea id="address" name="address" rows="3" required></textarea>
              </div>
              
              <div class="form-group">
                <label>Способ доставки *</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input type="radio" name="delivery_method" value="cdek" checked>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span>СДЭК</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="delivery_method" value="russianpost">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path><path d="M22 13a18.15 18.15 0 0 1-20 0"></path></svg>
                    <span>Почта России</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="delivery_method" value="wbtrack">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    <span>WbTrack</span>
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <label>Способ связи *</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input type="radio" name="contact_method" value="phone" checked>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <span>По телефону</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="contact_method" value="telegram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.905 7.864l-1.612 7.596c-.121.572-.439.714-.89.444l-2.458-1.81-1.185 1.14c-.131.131-.242.242-.497.242l.177-2.525 4.578-4.135c.198-.177-.043-.275-.308-.098l-5.661 3.565-2.438-.762c-.53-.166-.541-.53.111-.784l9.542-3.677c.442-.166.829.098.685.784z"/>
                    </svg>
                    <span>Telegram</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="contact_method" value="whatsapp">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12.017 2.001C6.486 2.001 2.003 6.482 2.003 12.014c-.001 1.752.458 3.466 1.33 4.967L2.001 22l5.233-1.237c1.438.784 3.052 1.196 4.784 1.196 5.531 0 10.014-4.481 10.014-10.014C21.932 6.484 17.548 2.001 12.017 2.001zm5.542 14.204c-.246.69-1.228 1.267-1.98 1.318-.523.034-1.204.156-3.478-.727-2.45-1.197-4.039-3.694-4.16-3.866-.121-.171-.989-1.305-.989-2.49 0-1.185.623-1.771.844-2.013.221-.242.482-.303.643-.303.161 0 .322.007.462.013.148.006.346-.056.541.413.196.469.669 1.628.728 1.747.059.119.098.259.02.42-.079.161-.118.26-.237.402-.118.142-.249.317-.356.425-.118.118-.241.246-.103.482.138.236.615 1.014 1.32 1.641.905.806 1.667 1.055 1.903 1.174.236.118.373.099.509-.059.136-.158.582-.679.737-.912.155-.233.31-.194.522-.116.212.078 1.344.634 1.575.749.231.115.385.173.442.269.057.096.057.556-.189 1.095z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </label>
                </div>
              </div>
              
              <div id="telegram-username-container" class="form-group" style="display: none;">
                <label for="telegram_username">Telegram username</label>
                <input type="text" id="telegram_username" name="telegram_username" placeholder="@username">
              </div>
              
              <div class="form-group">
                <label for="comment">Комментарий к заказу</label>
                <textarea id="comment" name="comment" rows="2"></textarea>
              </div>
              
              <button type="submit" class="btn btn-primary btn-full">Оформить заказ</button>
            </form>
          </div>
        </div>
      </div>
    `;

    cartContent.innerHTML = cartHTML;
    this.initCheckoutForm();
  }

  initCheckoutForm() {
    const form = document.getElementById('checkout-form');
    const contactMethodRadios = document.querySelectorAll('input[name="contact_method"]');
    const telegramUsernameContainer = document.getElementById('telegram-username-container');
    
    if (contactMethodRadios && telegramUsernameContainer) {
      contactMethodRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          if (radio.value === 'telegram') {
            telegramUsernameContainer.style.display = 'block';
            document.getElementById('telegram_username').setAttribute('required', '');
          } else {
            telegramUsernameContainer.style.display = 'none';
            document.getElementById('telegram_username').removeAttribute('required');
          }
        });
      });
    }

    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        const cart = this.getFromStorage('cart', []);
        
        if (cart.length === 0) {
          this.showNotification('Корзина пуста', 'error');
          return;
        }
        
        this.showNotification('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.');
        
        setTimeout(() => {
          this.clearCart();
          form.reset();
        }, 2000);
      });
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
      color: white;
      border-radius: 8px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Глобальный экземпляр
window.cartManager = new CartManager();
