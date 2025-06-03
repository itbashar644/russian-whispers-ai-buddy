
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
              // Используем цену после скидки если есть
              const itemPrice = this.parsePrice(item.discount_price || item.price);
              const itemTotal = itemPrice * item.quantity;
              return `
                <div class="cart-item" data-id="${item.id}">
                  <div class="cart-item-image">
                    <img src="${item.image_url || '/placeholder.svg'}" alt="${item.title}" loading="lazy" onerror="this.src='/placeholder.svg'">
                  </div>
                  <div class="cart-item-info">
                    <h3>${item.title}</h3>
                    <div class="cart-item-price">${this.formatPrice(itemPrice)}</div>
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
                    <input type="radio" name="delivery_method" value="courier">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
                    <span>Курьер</span>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <span>Telegram</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="contact_method" value="whatsapp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M13 8l-5 5"></path><path d="M13 13l5-5"></path></svg>
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
