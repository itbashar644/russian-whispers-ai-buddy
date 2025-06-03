/**
 * Функции для работы с корзиной
 */

// Добавление товара в корзину
function addToCart(product) {
  if (!product || !product.id) {
    console.error('Некорректный товар для добавления в корзину');
    return false;
  }

  const cart = getFromStorage('cart', []);
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    // Определяем правильную цену - используем discount_price если есть, иначе price
    const price = product.discount_price && product.discount_price !== product.price 
      ? parsePrice(product.discount_price) 
      : parsePrice(product.price);
    
    cart.push({
      id: product.id,
      title: product.title,
      price: price,
      original_price: parsePrice(product.price),
      image_url: product.image_url,
      quantity: 1
    });
  }

  saveToStorage('cart', cart);
  updateCartCounter();
  showSuccess('Товар добавлен в корзину');
  return true;
}

// Удаление товара из корзины
function removeFromCart(productId) {
  const cart = getFromStorage('cart', []);
  const updatedCart = cart.filter(item => item.id !== productId);
  saveToStorage('cart', updatedCart);
  updateCartCounter();
  showSuccess('Товар удален из корзины');
}

// Обновление количества товара в корзине
function updateCartQuantity(productId, quantity) {
  const cart = getFromStorage('cart', []);
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveToStorage('cart', cart);
      updateCartCounter();
    }
  }
}

// Получение товаров корзины
function getCartItems() {
  return getFromStorage('cart', []);
}

// Очистка корзины
function clearCart() {
  saveToStorage('cart', []);
  updateCartCounter();
}

// Подсчет общей суммы корзины
function getCartTotal() {
  const cart = getFromStorage('cart', []);
  return cart.reduce((total, item) => {
    const itemPrice = parsePrice(item.price);
    return total + (itemPrice * item.quantity);
  }, 0);
}

// Обновление счетчика корзины
function updateCartCounter() {
  const cart = getFromStorage('cart', []);
  const counters = document.querySelectorAll('.cart-counter');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  counters.forEach(counter => {
    counter.textContent = totalItems > 0 ? totalItems : '';
    counter.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

// Инициализация обработчиков кнопок "В корзину"
function initAddToCartButtons() {
  const buttons = document.querySelectorAll('.add-to-cart-btn, .price-cart-btn');
  
  buttons.forEach(button => {
    // Удаляем старые обработчики
    button.removeEventListener('click', handleAddToCart);
    // Добавляем новый обработчик
    button.addEventListener('click', handleAddToCart);
  });
}

function handleAddToCart(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const productId = this.getAttribute('data-id');
  if (!productId) {
    console.error('Не найден ID товара');
    return;
  }
  
  // Получаем данные товара из DOM или делаем запрос к API
  const productCard = this.closest('.product-card');
  if (productCard) {
    const product = {
      id: productId,
      title: productCard.querySelector('h3 a, .product-title')?.textContent?.trim() || 'Товар',
      price: extractPriceFromElement(productCard),
      image_url: productCard.querySelector('img')?.src || '/placeholder.svg'
    };
    
    addToCart(product);
  } else {
    // Fallback: загружаем данные товара из API
    loadProductAndAddToCart(productId);
  }
}

function extractPriceFromElement(element) {
  // Сначала ищем скидочную цену
  const discountPriceElement = element.querySelector('.current-price:not(.old-price)');
  if (discountPriceElement) {
    const priceText = discountPriceElement.textContent.replace(/[^\d]/g, '');
    const price = parseInt(priceText) || 0;
    if (price > 0) return price;
  }
  
  // Если скидочной цены нет, берем обычную цену
  const priceElement = element.querySelector('.product-price, .current-price');
  if (priceElement) {
    const priceText = priceElement.textContent.replace(/[^\d]/g, '');
    return parseInt(priceText) || 0;
  }
  return 0;
}

async function loadProductAndAddToCart(productId) {
  try {
    const response = await fetch(`https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?id=eq.${productId}&select=*`, {
      headers: window.CONFIG.apiHeaders
    });
    
    if (!response.ok) throw new Error('Ошибка загрузки товара');
    
    const products = await response.json();
    if (products.length > 0) {
      addToCart(products[0]);
    } else {
      showError('Товар не найден');
    }
  } catch (error) {
    console.error('Ошибка при загрузке товара:', error);
    showError('Ошибка при добавлении товара в корзину');
  }
}

// Экспорт функций
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.getCartItems = getCartItems;
window.clearCart = clearCart;
window.getCartTotal = getCartTotal;
window.updateCartCounter = updateCartCounter;
window.initAddToCartButtons = initAddToCartButtons;
