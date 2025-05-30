/**
 * Функционал для работы с корзиной
 */
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
  const cartCounter = document.getElementById('cart-counter');
  if (!cartCounter) return;
  
  const cart = getFromStorage('cart', []);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  cartCounter.textContent = totalItems;
  
  // Добавляем класс active, если в корзине есть товары
  if (totalItems > 0) {
    cartCounter.classList.add('active');
  } else {
    cartCounter.classList.remove('active');
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
  const cartContainer = document.getElementById('cart-container');
  const checkoutFormContainer = document.getElementById('checkout-form-container');
  
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
    
    // Скрываем форму оформления заказа
    if (checkoutFormContainer) {
      checkoutFormContainer.style.display = 'none';
    }
    
    return;
  }
  
  // Показываем форму оформления заказа, если она есть
  if (checkoutFormContainer) {
    checkoutFormContainer.style.display = 'block';
  }
  
  // Рассчитываем общую стоимость - убедимся, что у нас числа
    // Учитываем возможность хранения цены строкой
  const totalPrice = cart.reduce((total, item) => {
    const itemPrice = parsePrice(item.price);
    return total + itemPrice * item.quantity;
  }, 0);
  
  // Формируем HTML для корзины
  const cartHTML = `
    <div class="cart-content">
      <h2>Ваши товары</h2>
      <div class="cart-items">
        ${cart.map(item => `
          <div class="cart-item">
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-info">
              <h3 class="cart-item-title">${item.title}</h3>
              <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="cart-item-quantity">
              <button class="quantity-btn decrease" data-id="${item.id}">-</button>
              <span class="quantity-value">${item.quantity}</span>
              <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-total">
              ${formatPrice(parsePrice(item.price) * item.quantity)}
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
  
  // Обработчик отправки формы оформления заказа
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Проверка заполнения обязательных полей
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const address = document.getElementById('address').value.trim();
      
      if (!name || !phone || !email || !address) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
      }
      
      // Собираем данные формы
      const formData = {
        name: name,
        phone: phone,
        email: email,
        address: address,
        comment: document.getElementById('comment').value.trim(),
        contact_method: document.querySelector('input[name="contact_method"]:checked')?.value || 'phone',
        telegram_username: document.getElementById('telegram_username')?.value.trim(),
        delivery_method: document.querySelector('input[name="delivery_method"]:checked')?.value || 'cdek',
        payment_method: document.querySelector('input[name="payment_method"]:checked')?.value || 'cash'
      };
      
      // Отправляем заказ
      submitOrder(formData);
    });
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
