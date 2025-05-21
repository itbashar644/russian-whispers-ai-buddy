
/**
 * Функционал для оформления заказа
 */

// Инициализация формы заказа
function initCheckoutForm() {
  const checkoutForm = document.getElementById('checkout-form');
  if (!checkoutForm) return;
  
  // Инициализация формы с сохраненными данными
  loadSavedCheckoutInfo();
  
  // Обработчик отправки формы
  checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Проверка валидности формы
    if (!checkoutForm.checkValidity()) {
      showNotification('Пожалуйста, заполните все обязательные поля', 'error');
      return;
    }
    
    // Получаем данные формы
    const formData = new FormData(checkoutForm);
    const orderData = {
      items: getCartItems(),
      customer: {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        contactMethod: formData.get('contactMethod'),
        telegramNickname: formData.get('telegramNickname') || ''
      },
      delivery: {
        method: formData.get('deliveryMethod'),
        address: formData.get('address')
      },
      payment: {
        method: formData.get('paymentMethod')
      },
      total: calculateTotal(),
      subtotal: calculateSubtotal(),
      deliveryCost: calculateDeliveryCost()
    };
    
    // Сохраняем данные для будущих заказов, если пользователь согласен
    if (formData.get('saveInfo')) {
      saveCheckoutInfo(orderData.customer);
    }
    
    // Отправка заказа
    submitOrder(orderData);
  });
  
  // Инициализация выбора способа доставки
  initDeliveryMethodSelection();
  
  // Инициализация выбора способа оплаты
  initPaymentMethodSelection();
  
  // Обработка изменения способа контакта
  const contactMethodSelect = document.querySelector('[name="contactMethod"]');
  const telegramField = document.getElementById('telegram-field');
  
  if (contactMethodSelect && telegramField) {
    contactMethodSelect.addEventListener('change', function() {
      if (this.value === 'telegram') {
        telegramField.style.display = 'block';
        telegramField.querySelector('input').required = true;
      } else {
        telegramField.style.display = 'none';
        telegramField.querySelector('input').required = false;
      }
    });
    
    // Вызываем событие change для инициализации
    contactMethodSelect.dispatchEvent(new Event('change'));
  }
}

// Функция для инициализации выбора способа доставки
function initDeliveryMethodSelection() {
  const deliveryMethods = document.querySelectorAll('[name="deliveryMethod"]');
  const deliveryCost = document.getElementById('delivery-cost');
  const orderTotal = document.getElementById('order-total');
  
  if (deliveryMethods.length && deliveryCost && orderTotal) {
    deliveryMethods.forEach(method => {
      method.addEventListener('change', function() {
        const cost = calculateDeliveryCost();
        deliveryCost.textContent = cost > 0 ? `${cost} ₽` : 'Бесплатно';
        orderTotal.textContent = `${calculateTotal()} ₽`;
      });
    });
  }
}

// Функция для инициализации выбора способа оплаты
function initPaymentMethodSelection() {
  const paymentMethods = document.querySelectorAll('[name="paymentMethod"]');
  if (paymentMethods.length) {
    paymentMethods.forEach(method => {
      method.addEventListener('change', function() {
        // Логика в зависимости от выбранного метода оплаты
      });
    });
  }
}

// Функция для загрузки сохраненной информации о заказе
function loadSavedCheckoutInfo() {
  try {
    const savedInfo = localStorage.getItem('savedCheckoutInfo');
    if (!savedInfo) return;
    
    const info = JSON.parse(savedInfo);
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    // Заполняем форму сохраненными данными
    if (info.name) form.querySelector('[name="name"]').value = info.name;
    if (info.email) form.querySelector('[name="email"]').value = info.email;
    if (info.phone) form.querySelector('[name="phone"]').value = info.phone;
    if (info.address) form.querySelector('[name="address"]').value = info.address;
    
    const contactMethodSelect = form.querySelector('[name="contactMethod"]');
    if (contactMethodSelect && info.contactMethod) {
      contactMethodSelect.value = info.contactMethod;
      contactMethodSelect.dispatchEvent(new Event('change'));
    }
    
    if (info.telegramNickname) {
      const telegramInput = form.querySelector('[name="telegramNickname"]');
      if (telegramInput) telegramInput.value = info.telegramNickname;
    }
  } catch (e) {
    console.error('Ошибка загрузки сохраненных данных о заказе:', e);
  }
}

// Функция для сохранения данных о заказе
function saveCheckoutInfo(customerData) {
  try {
    localStorage.setItem('savedCheckoutInfo', JSON.stringify(customerData));
  } catch (e) {
    console.error('Ошибка сохранения данных о заказе:', e);
  }
}

// Функция для отправки заказа
function submitOrder(orderData) {
  // Показываем индикатор загрузки
  const submitButton = document.querySelector('#checkout-form button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Обработка...';
  
  // Формирование тела запроса
  const requestData = {
    user_id: null, // Для гостевого оформления
    items: orderData.items.map(item => ({
      product: {
        id: item.id,
        title: item.title,
        price: item.price,
        discountPrice: item.discountPrice || null,
        articleNumber: item.articleNumber || ''
      },
      quantity: item.quantity,
      color: item.color || null,
      size: item.size || null
    })),
    total: orderData.total,
    delivery_method: orderData.delivery.method,
    customer_name: orderData.customer.name,
    customer_email: orderData.customer.email,
    customer_phone: orderData.customer.phone,
    delivery_address: orderData.delivery.address
  };
  
  // Отправка запроса на создание заказа
  fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...CONFIG.apiHeaders
    },
    body: JSON.stringify(requestData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка при оформлении заказа');
    }
    return response.json();
  })
  .then(data => {
    // Очищаем корзину
    clearCart();
    
    // Показываем сообщение об успехе
    showNotification('Заказ успешно оформлен! Спасибо за покупку.', 'success');
    
    // Перенаправляем на страницу с подтверждением заказа
    setTimeout(() => {
      window.location.href = '/order-success.html?order_id=' + data.id;
    }, 2000);
  })
  .catch(error => {
    console.error('Ошибка при оформлении заказа:', error);
    showNotification('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.', 'error');
  })
  .finally(() => {
    // Восстанавливаем кнопку
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  });
}

// Функция для расчета стоимости доставки
function calculateDeliveryCost() {
  const deliveryMethodEl = document.querySelector('[name="deliveryMethod"]:checked');
  if (!deliveryMethodEl) return 0;
  
  const deliveryMethod = deliveryMethodEl.value;
  const subtotal = calculateSubtotal();
  
  // Примеры правил доставки
  switch (deliveryMethod) {
    case 'pickup':
      return 0;
    case 'courier':
      return subtotal > 5000 ? 0 : 300;
    case 'post':
      return subtotal > 3000 ? 0 : 250;
    default:
      return 0;
  }
}

// Функция для расчета промежуточной суммы (без доставки)
function calculateSubtotal() {
  const cartItems = getCartItems();
  return cartItems.reduce((sum, item) => {
    const price = item.discountPrice || item.price;
    return sum + (price * item.quantity);
  }, 0);
}

// Функция для расчета итоговой суммы (с доставкой)
function calculateTotal() {
  return calculateSubtotal() + calculateDeliveryCost();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  initCheckoutForm();
  updateCartSummary(); // Обновляем сводку по корзине
});

// Функция для обновления сводки по корзине
function updateCartSummary() {
  const subtotalEl = document.getElementById('order-subtotal');
  const deliveryCostEl = document.getElementById('delivery-cost');
  const totalEl = document.getElementById('order-total');
  
  if (subtotalEl && totalEl) {
    const subtotal = calculateSubtotal();
    const deliveryCost = calculateDeliveryCost();
    const total = subtotal + deliveryCost;
    
    subtotalEl.textContent = `${subtotal} ₽`;
    if (deliveryCostEl) {
      deliveryCostEl.textContent = deliveryCost > 0 ? `${deliveryCost} ₽` : 'Бесплатно';
    }
    totalEl.textContent = `${total} ₽`;
  }
}
