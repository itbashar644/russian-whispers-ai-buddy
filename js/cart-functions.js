
/**
 * Функции для работы с корзиной
 */

function initCart() {
  // Получаем сохраненную корзину из localStorage или создаем пустую
  let cart = getFromStorage('cart', []);
  
  // Обновляем счетчик товаров в корзине
  updateCartCounter(cart);
}

function updateCartCounter(cart) {
  if (!cart) {
    cart = getFromStorage('cart', []);
  }
  const counters = document.querySelectorAll('.cart-counter');
  if (!counters.length) return;
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  counters.forEach(counter => {
    counter.textContent = totalItems > 0 ? totalItems : '';
    counter.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

function addToCart(product) {
  console.log('Добавляем товар в корзину:', product);
  
  let cart = getFromStorage('cart', []);
  
  const existingProductIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity += 1;
    console.log('Товар уже в корзине, увеличиваем количество');
  } else {
    cart.push(product);
    console.log('Добавляем новый товар в корзину');
  }
  
  const saved = saveToStorage('cart', cart);
  console.log('Корзина сохранена:', saved, cart);
  
  updateCartCounter(cart);
  
  return true;
}

function handleAddToCart(event) {
  event.preventDefault();
  event.stopPropagation();
  
  console.log('Кнопка добавления в корзину нажата');
  
  const productCard = event.target.closest('.product-card');
  if (!productCard) {
    console.log('Карточка товара не найдена');
    return;
  }
  
  const productLink = productCard.querySelector('.product-link');
  if (!productLink) {
    console.log('Ссылка на товар не найдена');
    return;
  }
  
  let productId;
  if (productLink.href && productLink.href.includes('id=')) {
    productId = productLink.href.split('id=')[1];
  } else if (productLink.dataset.id) {
    productId = productLink.dataset.id;
  }
  
  if (!productId) {
    console.log('ID товара не найден');
    return;
  }
  
  const productTitle = productCard.querySelector('h3').textContent;
  const priceElement = productCard.querySelector('.current-price');
  if (!priceElement) {
    console.log('Элемент цены не найден');
    return;
  }
  
  const priceText = priceElement.textContent;
  const productPrice = parsePrice ? parsePrice(priceText) : parseFloat(priceText.replace(/[^0-9.-]+/g, '')) || 0;
  const productImageElement = productCard.querySelector('.product-image img');
  const productImage = productImageElement ? productImageElement.src : '';
  
  const product = {
    id: productId,
    title: productTitle,
    price: productPrice,
    image: productImage,
    quantity: 1
  };
  
  console.log('Данные товара для корзины:', product);
  
  const success = addToCart(product);
  
  if (success) {
    showNotification(`"${productTitle}" добавлен в корзину`);
  } else {
    showNotification('Ошибка при добавлении товара в корзину', 'error');
  }
}

function initAddToCartButtons() {
  // Удаляем старые обработчики
  document.querySelectorAll('.add-to-cart-btn, .price-cart-btn').forEach(button => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
  });
  
  // Добавляем новые обработчики
  document.querySelectorAll('.add-to-cart-btn, .price-cart-btn').forEach(button => {
    button.addEventListener('click', handleAddToCart);
  });
  
  console.log('Обработчики кнопок корзины инициализированы для', document.querySelectorAll('.add-to-cart-btn, .price-cart-btn').length, 'кнопок');
}

// Делаем функции глобально доступными
window.initCart = initCart;
window.updateCartCounter = updateCartCounter;
window.addToCart = addToCart;
window.handleAddToCart = handleAddToCart;
window.initAddToCartButtons = initAddToCartButtons;
