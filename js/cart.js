/**
 * Функционал для работы с корзиной
 */
// Проверяем наличие необходимых функций
if (typeof getFromStorage !== 'function') {
  console.error('Функция getFromStorage не найдена');
}

if (typeof saveToStorage !== 'function') {
  console.error('Функция saveToStorage не найдена');
}

if (typeof parsePrice !== 'function') {
  console.error('Функция parsePrice не найдена');
}

if (typeof formatPrice !== 'function') {
  console.error('Функция formatPrice не найдена');
}

// Provide helpers if utils.js is missing
if (typeof parsePrice !== 'function') {
  function parsePrice(value) {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    const numeric = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
    return isNaN(numeric) ? 0 : numeric;
  }
}
if (typeof formatPrice !== 'function') {
  function formatPrice(price) {
    const value = parsePrice(price);
    return value.toLocaleString('ru-RU') + ' ₽';
  }
}

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
      // Обрабатываем цены через parsePrice
      const originalPrice = parsePrice(product.price);
      const discountPrice = product.discount_price ? parsePrice(product.discount_price) : null;
      
      cart.push({
        id: product.id,
        title: product.title,
        price: discountPrice || originalPrice, // действующая цена
        original_price: originalPrice, // оригинальная цена
        discount_price: discountPrice, // цена со скидкой (если есть)
        image: product.image,
        quantity: product.quantity || 1
      });
    }
    
    // Сохраняем обновленную корзину в localStorage
    saveToStorage('cart', cart);
    
    // Обновляем счетчик корзины
    updateCartCounter();
    
    // Показываем уведомление
    showNotification('Товар добавлен в корзину', 'success');
    
    return true;
  } catch (error) {
    console.error('Ошибка при добавлении товара в корзину:', error);
    showNotification('Ошибка при добавлении товара в корзину', 'error');
    return false;
  }
}

// Функция для обновления счетчика корзины
function updateCartCounter() {
  const counters = document.querySelectorAll('.cart-counter');
  if (!counters.length) return;

  const cart = getFromStorage('cart', []);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  counters.forEach(counter => {
    counter.textContent = totalItems;
    if (totalItems > 0) {
      counter.classList.add('active');
    } else {
      counter.classList.remove('active');
    }
  });
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
    if (window.location.pathname.endsWith('cart.html')) {
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
    if (window.location.pathname.endsWith('cart.html')) {
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
  const cartContainer = document.getElementById('cart-content');
  
  if (!cartContainer) {
    console.error('Контейнер корзины не найден');
    return;
  }
  
  try {
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
    
    // Рассчитываем общую стоимость по действующим ценам
    const totalPrice = cart.reduce((total, item) => {
      const currentPrice = item.discount_price || item.price;
      return total + (parsePrice(currentPrice) * item.quantity);
    }, 0);
    
    // Формируем HTML для корзины
    const cartHTML = `
      <div class="cart-content">
        <h2>Ваши товары</h2>
        <div class="cart-items">
          ${cart.map(item => `
            <div class="cart-item">
              <div class="cart-item-image">
                <img src="${item.image_url || item.image || '/placeholder.svg'}" alt="${item.title}" onerror="this.src='/placeholder.svg'">
              </div>
              <div class="cart-item-info">
                <h3 class="cart-item-title">${item.title}</h3>
                <div class="cart-item-price">
                  ${item.discount_price ? `
                    <span class="old-price">${formatPrice(item.original_price)}</span>
                    <span class="current-price">${formatPrice(item.discount_price)}</span>
                  ` : `
                    <span class="current-price">${formatPrice(item.price)}</span>
                  `}
                </div>
              </div>
              <div class="cart-item-quantity">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
              </div>
              <div class="cart-item-total">
                ${formatPrice((item.discount_price || item.price) * item.quantity)}
              </div>
              <button class="cart-item-remove" data-id="${item.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          `).join('')}
        </div>
        <div class="cart-summary">
          <div class="cart-totals">
            <div class="cart-total-row">
              <span>Товары (${cart.reduce((count, item) => count + item.quantity, 0)} шт.):</span>
              <span>${formatPrice(totalPrice)}</span>
            </div>
            <div class="cart-total-row">
              <span>Доставка:</span>
              <span>Бесплатно</span>
            </div>
            <div class="cart-total-row cart-grand-total">
              <span>Итого:</span>
              <span>${formatPrice(totalPrice)}</span>
            </div>
          </div>
          <div class="cart-actions">
            <button id="clear-cart" class="btn secondary-btn">Очистить корзину</button>
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
    
  } catch (error) {
    console.error('Ошибка при отображении корзины:', error);
    cartContainer.innerHTML = `
      <div class="error-message">
        <p>Произошла ошибка при загрузке корзины</p>
        <button onclick="renderCart()" class="btn primary-btn">Попробовать снова</button>
      </div>
    `;
  }
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
        comment: formData.comment || '',
        contact_method: formData.contact_method || 'phone',
        telegram_username: formData.telegram_username || '',
        delivery_method: formData.delivery_method || 'cdek',
        payment_method: formData.payment_method || 'cash'
      },
      totalPrice: cart.reduce((total, item) => total + parsePrice(item.price) * item.quantity, 0),
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
    try {
      sendOrderToTelegram(order)
        .then(result => {
          console.log('Заказ отправлен в Telegram:', result);
        })
        .catch(err => {
          console.error('Ошибка при отправке заказа в Telegram:', err);
        });
    } catch (err) {
      console.error('Ошибка при отправке заказа в Telegram:', err);
    }
    
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
- Способ связи: ${getContactMethodText(order.customer.contact_method)}${order.customer.telegram_username ? `\n- Telegram: ${order.customer.telegram_username}` : ''}
- Способ доставки: ${getDeliveryMethodText(order.customer.delivery_method)}
- Способ оплаты: ${order.customer.payment_method === 'cash' ? 'Наличными при получении' : 'Картой при получении'}
${order.customer.comment ? `- Комментарий: ${order.customer.comment}` : ''}

🛒 Товары:
 ${order.items.map(item => `- ${item.title} (${item.quantity} шт.) - ${formatPrice(parsePrice(item.price) * item.quantity)}`).join('\n')}

💰 Итого: ${formatPrice(order.totalPrice)}
    `;
    
    // Отправляем сообщение через Telegram API
    const TELEGRAM_TOKEN = CONFIG.telegramBotToken;
    const CHAT_ID = CONFIG.telegramChatId;
    
    if (!TELEGRAM_TOKEN || !CHAT_ID || TELEGRAM_TOKEN === 'your_telegram_bot_token' || CHAT_ID === 'your_telegram_chat_id') {
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
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при отправке заказа в Telegram:', error);
    throw error;
  }
}

// Функция для отображения уведомлений
function showNotification(message, type = 'info') {
  // Проверяем, существует ли уже контейнер для уведомлений
  let notificationContainer = document.querySelector('.notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Добавляем уведомление в контейнер
  notificationContainer.appendChild(notification);
  
  // Показываем уведомление
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Через 3 секунды скрываем и удаляем уведомление
  setTimeout(() => {
    notification.classList.remove('show');
    
    // После завершения анимации удаляем элемент
    notification.addEventListener('transitionend', function() {
      notification.remove();
    });
  }, 3000);
}
// Преобразование кода способа связи в читаемый текст
function getContactMethodText(method) {
  switch(method) {
    case 'phone': return 'По телефону';
    case 'telegram': return 'Telegram';
    case 'whatsapp': return 'WhatsApp';
    default: return method;
  }
}

// Получение текста способа доставки
function getDeliveryMethodText(method) {
  switch(method) {
    case 'cdek': return 'СДЭК';
    case 'russianpost': return 'Почта РФ';
    case 'wbtrack': return 'WB Track';
    default: return method;
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
