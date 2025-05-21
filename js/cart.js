
/**
 * Функционал для работы с корзиной
 */

// Функция для инициализации корзины
function initCart() {
  updateCartCounter();
}

// Функция для добавления товара в корзину
function addToCart(product) {
  try {
    // Получаем текущую корзину из localStorage
    let cart = getFromStorage('cart', []);
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Если товар уже есть в корзине, увеличиваем его количество
      existingItem.quantity += product.quantity || 1;
    } else {
      // Если товара нет в корзине, добавляем его
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: product.quantity || 1
      });
    }
    
    // Сохраняем обновленную корзину в localStorage
    saveToStorage('cart', cart);
    
    // Обновляем счетчик корзины
    updateCartCounter();
    
    return true;
  } catch (error) {
    console.error('Ошибка при добавлении товара в корзину:', error);
    return false;
  }
}

// Функция для удаления товара из корзины
function removeFromCart(productId) {
  try {
    // Получаем текущую корзину из localStorage
    let cart = getFromStorage('cart', []);
    
    // Фильтруем корзину, убирая товар с указанным ID
    cart = cart.filter(item => item.id !== productId);
    
    // Сохраняем обновленную корзину в localStorage
    saveToStorage('cart', cart);
    
    // Обновляем счетчик корзины
    updateCartCounter();
    
    // Обновляем страницу корзины, если мы на ней находимся
    if (window.location.pathname.endsWith('cart.html') && typeof renderCart === 'function') {
      renderCart();
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при удалении товара из корзины:', error);
    return false;
  }
}

// Функция для изменения количества товара в корзине
function updateCartItemQuantity(productId, quantity) {
  try {
    // Получаем текущую корзину из localStorage
    let cart = getFromStorage('cart', []);
    
    // Находим товар в корзине
    const item = cart.find(item => item.id === productId);
    
    if (!item) {
      return false;
    }
    
    // Обновляем количество товара
    item.quantity = quantity;
    
    // Если количество товара стало 0 или меньше, удаляем его из корзины
    if (item.quantity <= 0) {
      return removeFromCart(productId);
    }
    
    // Сохраняем обновленную корзину в localStorage
    saveToStorage('cart', cart);
    
    // Обновляем счетчик корзины
    updateCartCounter();
    
    // Обновляем страницу корзины, если мы на ней находимся
    if (window.location.pathname.endsWith('cart.html') && typeof renderCart === 'function') {
      renderCart();
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при обновлении количества товара в корзине:', error);
    return false;
  }
}

// Функция для очистки корзины
function clearCart() {
  try {
    // Сохраняем пустую корзину в localStorage
    saveToStorage('cart', []);
    
    // Обновляем счетчик корзины
    updateCartCounter();
    
    // Обновляем страницу корзины, если мы на ней находимся
    if (window.location.pathname.endsWith('cart.html') && typeof renderCart === 'function') {
      renderCart();
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при очистке корзины:', error);
    return false;
  }
}

// Функция для отображения страницы корзины
function renderCart() {
  const cartContainer = document.getElementById('cart-container');
  if (!cartContainer) return;
  
  // Получаем текущую корзину из localStorage
  const cart = getFromStorage('cart', []);
  
  if (cart.length === 0) {
    // Если корзина пуста, показываем сообщение
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из каталога, чтобы оформить заказ.</p>
        <a href="catalog.html" class="btn primary-btn">Перейти в каталог</a>
      </div>
    `;
    return;
  }
  
  // Рассчитываем общую стоимость
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Формируем HTML для корзины
  const cartHTML = `
    <div class="cart-content">
      <h2>Корзина</h2>
      <div class="cart-items">
        ${cart.map(item => `
          <div class="cart-item">
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-info">
              <h3>${item.title}</h3>
              <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="cart-item-quantity">
              <button class="quantity-btn decrease" data-id="${item.id}">-</button>
              <span class="quantity-value">${item.quantity}</span>
              <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-total">
              ${formatPrice(item.price * item.quantity)}
            </div>
            <button class="cart-item-remove" data-id="${item.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        `).join('')}
      </div>
      <div class="cart-footer">
        <div class="cart-total">
          <span class="cart-total-label">Итого:</span>
          <span class="cart-total-price">${formatPrice(totalPrice)}</span>
        </div>
        <div class="cart-actions">
          <button id="clear-cart" class="btn secondary-btn">Очистить корзину</button>
          <a href="checkout.html" class="btn primary-btn">Оформить заказ</a>
        </div>
      </div>
    </div>
  `;
  
  // Обновляем контейнер
  cartContainer.innerHTML = cartHTML;
  
  // Добавляем обработчики событий
  // Кнопки удаления товаров
  document.querySelectorAll('.cart-item-remove').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-id');
      removeFromCart(productId);
    });
  });
  
  // Кнопки изменения количества товара
  document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-id');
      const item = cart.find(item => item.id === productId);
      if (item) {
        updateCartItemQuantity(productId, item.quantity - 1);
      }
    });
  });
  
  document.querySelectorAll('.quantity-btn.increase').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-id');
      const item = cart.find(item => item.id === productId);
      if (item) {
        updateCartItemQuantity(productId, item.quantity + 1);
      }
    });
  });
  
  // Кнопка очистки корзины
  document.getElementById('clear-cart').addEventListener('click', function() {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
      clearCart();
    }
  });
}

// Функция для оформления заказа
function submitOrder(formData) {
  try {
    // Получаем текущую корзину из localStorage
    const cart = getFromStorage('cart', []);
    
    if (cart.length === 0) {
      showNotification('Корзина пуста', 'error');
      return false;
    }
    
    // Создаем объект заказа
    const order = {
      id: 'order_' + Date.now(),
      items: cart,
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        comment: formData.comment || ''
      },
      totalPrice: cart.reduce((total, item) => total + item.price * item.quantity, 0),
      status: 'new',
      created: new Date().toISOString()
    };
    
    // Получаем историю заказов пользователя
    let orders = getFromStorage('orders', []);
    
    // Добавляем новый заказ в историю
    orders.push(order);
    
    // Сохраняем историю заказов
    saveToStorage('orders', orders);
    
    // Отправляем заказ оператору в Telegram
    sendOrderToTelegram(order)
      .then(res => {
        console.log('Заказ отправлен в Telegram:', res);
      })
      .catch(err => {
        console.error('Ошибка при отправке заказа в Telegram:', err);
      });
    
    // Очищаем корзину
    clearCart();
    
    // Перенаправляем пользователя на страницу благодарности
    window.location.href = 'thank-you.html?order_id=' + order.id;
    
    return true;
  } catch (error) {
    console.error('Ошибка при оформлении заказа:', error);
    showNotification('Произошла ошибка при оформлении заказа', 'error');
    return false;
  }
}

// Функция для отправки заказа в Telegram
async function sendOrderToTelegram(order) {
  try {
    // Формируем текст сообщения
    const message = `
📦 Новый заказ #${order.id}

👤 Клиент:
- ФИО: ${order.customer.name}
- Телефон: ${order.customer.phone}
- Email: ${order.customer.email}
- Адрес: ${order.customer.address}
${order.customer.comment ? `- Комментарий: ${order.customer.comment}` : ''}

🛒 Товары:
${order.items.map(item => `- ${item.title} (${item.quantity} шт.) - ${formatPrice(item.price * item.quantity)}`).join('\n')}

💰 Итого: ${formatPrice(order.totalPrice)}
    `;
    
    // Отправляем сообщение через Telegram API
    const TELEGRAM_TOKEN = CONFIG.telegramBotToken;
    const CHAT_ID = CONFIG.telegramChatId;
    
    if (!TELEGRAM_TOKEN || !CHAT_ID) {
      console.error('Не настроены параметры для отправки в Telegram');
      return false;
    }
    
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при отправке заказа в Telegram:', error);
    throw error;
  }
}

// Инициализируем корзину при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  initCart();
  
  // Если мы на странице корзины, рендерим ее
  if (window.location.pathname.endsWith('cart.html')) {
    renderCart();
  }
});
