
/**
 * Функционал для оформления заказа
 */

document.addEventListener('DOMContentLoaded', function() {
  initializeCheckout();
});

/**
 * Инициализация функционала оформления заказа
 */
function initializeCheckout() {
  // Проверяем, есть ли форма оформления заказа на странице
  const checkoutForm = document.getElementById('checkout-form');
  if (!checkoutForm) return;
  
  // Инициализация формы
  setupFormHandlers();
  setupContactMethodHandlers();
  loadCartItems();
}

/**
 * Настройка обработчиков формы
 */
function setupFormHandlers() {
  const checkoutForm = document.getElementById('checkout-form');
  
  checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Получаем данные формы
    const formData = collectFormData();
    
    // Валидация данных формы
    if (!validateFormData(formData)) return;
    
    // Отправляем заказ
    submitOrder(formData)
      .then(success => {
        if (!success) {
          showNotification('Произошла ошибка при оформлении заказа', 'error');
        }
      })
      .catch(error => {
        console.error('Ошибка при оформлении заказа:', error);
        showNotification('Произошла ошибка при оформлении заказа', 'error');
      });
  });
}

/**
 * Сбор данных формы
 */
function collectFormData() {
  return {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    comment: document.getElementById('comment')?.value,
    contact_method: document.querySelector('input[name="contact_method"]:checked').value,
    delivery_method: document.querySelector('input[name="delivery_method"]:checked')?.value || 'russianpost',
    telegram_username: document.getElementById('telegram_username')?.value
  };
}

/**
 * Валидация данных формы
 */
function validateFormData(formData) {
  // Проверяем обязательные поля
  if (!formData.name || !formData.phone || !formData.email || !formData.address) {
    showNotification('Пожалуйста, заполните все обязательные поля', 'error');
    return false;
  }
  
  // Проверяем, что username заполнен для Telegram
  if (formData.contact_method === 'telegram' && !formData.telegram_username) {
    showNotification('Пожалуйста, укажите ваш Telegram username', 'error');
    return false;
  }
  
  return true;
}

/**
 * Настройка обработчиков способа связи
 */
function setupContactMethodHandlers() {
  const contactMethodRadios = document.querySelectorAll('input[name="contact_method"]');
  const telegramUsernameContainer = document.getElementById('telegram-username-container');
  
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

/**
 * Загрузка товаров из корзины
 */
function loadCartItems() {
  // Получаем корзину
  const cart = getFromStorage('cart', []);
  
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }
  
  // Заполняем список товаров
  populateCheckoutItems(cart);
}

/**
 * Заполнение списка товаров в оформлении заказа
 */
function populateCheckoutItems(cart) {
  const checkoutItemsContainer = document.getElementById('checkout-items');
  checkoutItemsContainer.innerHTML = '';
  
  let subtotal = 0;
  
  cart.forEach(item => {
    const itemPrice = item.price || 0;
    const itemTotal = itemPrice * item.quantity;
    subtotal += itemTotal;
    
    const itemHTML = `
      <div class="checkout-item">
        <div class="checkout-item-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="checkout-item-title">${item.title}</div>
        <div class="checkout-item-quantity">x${item.quantity}</div>
        <div class="checkout-item-price">${formatPrice(itemTotal)}</div>
      </div>
    `;
    
    checkoutItemsContainer.innerHTML += itemHTML;
  });
  
  // Обновляем итоговую стоимость
  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('grand-total').textContent = formatPrice(subtotal);
}

// Функция для оформления заказа
async function submitOrder(formData) {
  try {
    // Получаем текущую корзину из localStorage
    const cart = getFromStorage('cart', []);
    
    if (cart.length === 0) {
      showNotification('Корзина пуста', 'error');
      return false;
    }
    
    // Создаем объект заказа
    const order = createOrderObject(formData, cart);
    
    // Отправляем заказ оператору в Telegram
    try {
      await sendOrderToTelegram(order);
      console.log('Заказ отправлен в Telegram');
    } catch (err) {
      console.error('Ошибка при отправке заказа в Telegram:', err);
      // Продолжаем обработку заказа, даже если отправка в Telegram не удалась
    }
    
    // Сохраняем заказ в историю
    saveOrderToHistory(order);
    
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

/**
 * Создание объекта заказа
 */
function createOrderObject(formData, cart) {
  return {
    id: 'order_' + Date.now(),
    items: cart,
    customer: {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      comment: formData.comment || '',
      contact_method: formData.contact_method || 'phone',
      delivery_method: formData.delivery_method || 'russianpost',
      telegram_username: formData.telegram_username || ''
    },
    totalPrice: cart.reduce((total, item) => {
      const itemPrice = typeof item.price === 'number' ? item.price : 0;
      return total + (itemPrice * item.quantity);
    }, 0),
    status: 'new',
    created: new Date().toISOString()
  };
}

/**
 * Сохранение заказа в историю
 */
function saveOrderToHistory(order) {
  // Получаем историю заказов пользователя
  let orders = getFromStorage('orders', []);
  
  // Добавляем новый заказ в историю
  orders.push(order);
  
  // Сохраняем историю заказов
  saveToStorage('orders', orders);
}

// Функция для отправки заказа в Telegram
async function sendOrderToTelegram(order) {
  try {
    // Формируем текст сообщения
    const message = formatTelegramMessage(order);
    
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

/**
 * Форматирование сообщения для Telegram
 */
function formatTelegramMessage(order) {
  return `
📦 Новый заказ #${order.id}

👤 Клиент:
- ФИО: ${order.customer.name}
- Телефон: ${order.customer.phone}
- Email: ${order.customer.email}
- Адрес: ${order.customer.address}
- Способ связи: ${getContactMethodText(order.customer.contact_method)}${order.customer.telegram_username ? `\n- Telegram: ${order.customer.telegram_username}` : ''}
- Способ доставки: ${getDeliveryMethodText(order.customer.delivery_method)}
${order.customer.comment ? `- Комментарий: ${order.customer.comment}` : ''}

🛒 Товары:
${order.items.map(item => `- ${item.title} (${item.quantity} шт.) - ${formatPrice(item.price * item.quantity)}`).join('\n')}

💰 Итого: ${formatPrice(order.totalPrice)}
`;
}

/**
 * Получение текста способа доставки
 */
function getDeliveryMethodText(method) {
  switch(method) {
    case 'russianpost': return 'Почта РФ';
    case 'cdek': return 'СДЭК';
    case 'wb': return 'В ПВЗ WB';
    default: return method;
  }
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
