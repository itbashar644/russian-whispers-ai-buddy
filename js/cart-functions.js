
/**
 * Функции для работы с корзиной
 */

// Глобальная переменная для предотвращения повторной инициализации
let cartInitialized = false;

function initCart() {
  console.log('Инициализируем корзину...');
  
  if (cartInitialized) {
    console.log('Корзина уже инициализирована');
    return;
  }
  
  cartInitialized = true;
  
  // Получаем сохраненную корзину из localStorage или создаем пустую
  let cart = getFromStorage('cart', []);
  
  // Обновляем счетчик товаров в корзине
  updateCartCounter(cart);
  console.log('Корзина инициализирована, товаров:', cart.length);
}

function updateCartCounter(cart) {
  if (!cart) {
    cart = getFromStorage('cart', []);
  }
  const counters = document.querySelectorAll('.cart-counter');
  console.log('Обновляем счетчики корзины, найдено элементов:', counters.length);
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  counters.forEach(counter => {
    counter.textContent = totalItems > 0 ? totalItems : '';
    counter.style.display = totalItems > 0 ? 'flex' : 'none';
  });
  console.log('Счетчики корзины обновлены, всего товаров:', totalItems);
}

function parsePrice(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const numeric = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
  return isNaN(numeric) ? 0 : numeric;
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
  const productPrice = parsePrice(priceText);
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
    if (typeof showNotification === 'function') {
      showNotification(`"${productTitle}" добавлен в корзину`);
    } else {
      console.log(`"${productTitle}" добавлен в корзину`);
    }
  } else {
    if (typeof showNotification === 'function') {
      showNotification('Ошибка при добавлении товара в корзину', 'error');
    } else {
      console.log('Ошибка при добавлении товара в корзину');
    }
  }
}

function initAddToCartButtons() {
  console.log('Инициализируем кнопки корзины...');
  
  // Удаляем старые обработчики
  const existingButtons = document.querySelectorAll('.add-to-cart-btn, .price-cart-btn');
  existingButtons.forEach(button => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
  });
  
  // Добавляем новые обработчики
  const buttons = document.querySelectorAll('.add-to-cart-btn, .price-cart-btn');
  console.log('Найдено кнопок корзины для инициализации:', buttons.length);
  
  buttons.forEach((button, index) => {
    console.log(`Добавляем обработчик для кнопки ${index + 1}`);
    button.addEventListener('click', handleAddToCart);
  });
  
  console.log('Обработчики кнопок корзины инициализированы для', buttons.length, 'кнопок');
}

// Делаем функции глобально доступными
window.initCart = initCart;
window.updateCartCounter = updateCartCounter;
window.addToCart = addToCart;
window.handleAddToCart = handleAddToCart;
window.initAddToCartButtons = initAddToCartButtons;
window.parsePrice = parsePrice;
