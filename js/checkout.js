
/**
 * Функционал для оформления заказа
 */

document.addEventListener('DOMContentLoaded', function() {
  // Проверяем, есть ли форма оформления заказа на странице
  const checkoutForm = document.getElementById('checkout-form');
  
  if (!checkoutForm) return;
  
  // Обработчик отправки формы
  checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Получаем данные формы
    const formData = {
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value,
      comment: document.getElementById('comment').value,
      contact_method: document.querySelector('input[name="contact_method"]:checked').value
    };
    
    // Если выбран Telegram, добавляем username
    if (formData.contact_method === 'telegram' && document.getElementById('telegram_username')) {
      formData.telegram_username = document.getElementById('telegram_username').value;
    }
    
    // Проверяем обязательные поля
    if (!formData.name || !formData.phone || !formData.email || !formData.address) {
      showNotification('Пожалуйста, заполните все обязательные поля', 'error');
      return;
    }
    
    // Проверяем, что username заполнен для Telegram
    if (formData.contact_method === 'telegram' && !formData.telegram_username) {
      showNotification('Пожалуйста, укажите ваш Telegram username', 'error');
      return;
    }
    
    // Отправляем заказ
    submitOrder(formData)
      .then(success => {
        if (success) {
          // Если заказ оформлен успешно, перенаправляем на страницу благодарности
          // Перенаправление происходит внутри функции submitOrder
        } else {
          showNotification('Произошла ошибка при оформлении заказа', 'error');
        }
      })
      .catch(error => {
        console.error('Ошибка при оформлении заказа:', error);
        showNotification('Произошла ошибка при оформлении заказа', 'error');
      });
  });
});

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
    const order = {
      id: 'order_' + Date.now(),
      items: cart,
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        comment: formData.comment || '',
        contact_method: formData.contact_method || 'phone'
      },
      totalPrice: cart.reduce((total, item) => total + item.price * item.quantity, 0),
      status: 'new',
      created: new Date().toISOString()
    };
    
    // Добавляем telegram_username если есть
    if (formData.telegram_username) {
      order.customer.telegram_username = formData.telegram_username;
    }
    
    // Получаем историю заказов пользователя
    let orders = getFromStorage('orders', []);
    
    // Добавляем новый заказ в историю
    orders.push(order);
    
    // Сохраняем историю заказов
    saveToStorage('orders', orders);
    
    // Отправляем заказ оператору в Telegram
    try {
      await sendOrderToTelegram(order);
      console.log('Заказ отправлен в Telegram');
    } catch (err) {
      console.error('Ошибка при отправке заказа в Telegram:', err);
      // Продолжаем обработку заказа, даже если отправка в Telegram не удалась
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
${order.customer.comment ? `- Комментарий: ${order.customer.comment}` : ''}

🛒 Товары:
${order.items.map(item => `- ${item.title} (${item.quantity} шт.) - ${formatPrice(item.price * item.quantity)}`).join('\n')}

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

// Преобразование кода способа связи в читаемый текст
function getContactMethodText(method) {
  switch(method) {
    case 'phone': return 'По телефону';
    case 'telegram': return 'Telegram';
    case 'whatsapp': return 'WhatsApp';
    default: return method;
  }
}
