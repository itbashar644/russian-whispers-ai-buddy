
/**
 * Модуль корзины - функциональность корзины
 */

// Утилиты для работы с ценами
function parsePrice(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const numeric = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
  return isNaN(numeric) ? 0 : numeric;
}

function formatPrice(price) {
  const value = parsePrice(price);
  return value.toLocaleString('ru-RU') + ' ₽';
}

// Утилиты localStorage
function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Ошибка при чтении из localStorage (${key}):`, error);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Ошибка при сохранении в localStorage (${key}):`, error);
    return false;
  }
}

// Система уведомлений
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = type === 'error' ? '#dc3545' : '#28a745';
  notification.style.color = 'white';
  notification.style.padding = '10px 15px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
  notification.style.zIndex = '1000';
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(20px)';
  notification.style.transition = 'opacity 0.3s, transform 0.3s';
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Функции корзины
function getCart() {
  return getFromStorage('cart', []);
}

function saveCart(cart) {
  return saveToStorage('cart', cart);
}

function updateCartCounter() {
  const cart = getCart();
  const counter = document.getElementById('cart-counter');
  if (counter) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    counter.textContent = totalItems > 0 ? totalItems : '';
    counter.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  updateCartCounter();
  displayCart();
  showNotification('Товар удален из корзины');
}

function updateQuantity(productId, newQuantity) {
  let cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      saveCart(cart);
      updateCartCounter();
      displayCart();
    }
  }
}

function clearCart() {
  saveToStorage('cart', []);
  updateCartCounter();
  displayCart();
  showNotification('Корзина очищена');
}

function displayCart() {
  const cart = getCart();
  const cartContainer = document.getElementById('cart-container');
  const checkoutFormContainer = document.getElementById('checkout-form-container');
  
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
        </div>
        <h2>Корзина пустая</h2>
        <p>Добавьте товары из каталога</p>
        <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
      </div>
    `;
    
    if (checkoutFormContainer) {
      checkoutFormContainer.style.display = 'none';
    }
    return;
  }

  if (checkoutFormContainer) {
    checkoutFormContainer.style.display = 'block';
  }

  let total = 0;
  let cartHTML = `
    <div class="cart-header">
      <h2>Товары в корзине</h2>
      <button class="clear-cart-btn" onclick="clearCart()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
        Очистить корзину
      </button>
    </div>
    <div class="cart-items">
  `;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    cartHTML += `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
        <div class="cart-item-info">
          <h3>${item.title}</h3>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-controls">
            <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
          </div>
          <div class="item-total">${formatPrice(itemTotal)}</div>
          <button class="remove-btn" onclick="removeFromCart('${item.id}')" aria-label="Удалить товар">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `;
  });

  cartHTML += `
    </div>
    <div class="cart-summary">
      <div class="cart-total">
        <span class="total-label">Итого:</span>
        <span class="total-price">${formatPrice(total)}</span>
      </div>
    </div>
  `;

  cartContainer.innerHTML = cartHTML;
}

function initCheckoutForm() {
  const form = document.getElementById('checkout-form');
  const contactMethodRadios = document.querySelectorAll('input[name="contact_method"]');
  const telegramUsernameContainer = document.getElementById('telegram-username-container');
  
  if (contactMethodRadios && telegramUsernameContainer) {
    contactMethodRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.value === 'telegram') {
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
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const formData = new FormData(form);
      const cart = getCart();
      
      if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
      }
      
      showNotification('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.');
      
      setTimeout(() => {
        clearCart();
        form.reset();
      }, 2000);
    });
  }
}

// Экспорт функций
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.displayCart = displayCart;
window.updateCartCounter = updateCartCounter;
window.initCheckoutForm = initCheckoutForm;
