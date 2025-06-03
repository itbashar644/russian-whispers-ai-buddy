
/**
 * Менеджер корзины
 */

let cartInitialized = false;

function initCart() {
  if (cartInitialized) return;
  cartInitialized = true;
  
  let cart = getFromStorage('cart', []);
  updateCartCounter(cart);
  console.log('Корзина инициализирована, товаров:', cart.length);
}

function updateCartCounter(cart) {
  try {
    if (!cart) {
      cart = getFromStorage('cart', []);
    }
    const counters = document.querySelectorAll('.cart-counter');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    counters.forEach(counter => {
      counter.textContent = totalItems > 0 ? totalItems : '';
      counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
  } catch (error) {
    console.error('Ошибка при обновлении счетчика корзины:', error);
  }
}

function addToCart(product) {
  try {
    let cart = getFromStorage('cart', []);
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push(product);
    }
    
    saveToStorage('cart', cart);
    updateCartCounter(cart);
    return true;
  } catch (error) {
    console.error('Ошибка при добавлении в корзину:', error);
    return false;
  }
}

function handleAddToCart(event) {
  try {
    event.preventDefault();
    event.stopPropagation();
    
    const button = event.target.closest('.add-to-cart-btn, .price-cart-btn');
    if (!button) return;
    
    // Получаем данные из data-атрибутов кнопки
    const productId = button.dataset.id;
    const productTitle = button.dataset.title;
    const productPrice = button.dataset.price; // Это уже актуальная цена (со скидкой если есть)
    const originalPrice = button.dataset.originalPrice;
    const discountPrice = button.dataset.discountPrice;
    const productImage = button.dataset.image;
    
    if (!productId || !productTitle || !productPrice) {
      console.error('Недостаточно данных для добавления товара в корзину');
      return;
    }
    
    const product = {
      id: productId,
      title: productTitle,
      price: originalPrice, // Оригинальная цена
      discount_price: discountPrice || null, // Цена со скидкой (если есть)
      image_url: productImage,
      quantity: 1
    };
    
    console.log('Добавляем товар в корзину:', product);
    
    const success = addToCart(product);
    
    if (success) {
      showNotification(`"${productTitle}" добавлен в корзину`);
    } else {
      showNotification('Ошибка при добавлении товара в корзину', 'error');
    }
  } catch (error) {
    console.error('Ошибка в handleAddToCart:', error);
  }
}

function initAddToCartButtons() {
  try {
    const existingButtons = document.querySelectorAll('.add-to-cart-btn, .price-cart-btn');
    existingButtons.forEach(button => {
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
    });
    
    const buttons = document.querySelectorAll('.add-to-cart-btn, .price-cart-btn');
    buttons.forEach(button => {
      button.addEventListener('click', handleAddToCart);
    });
  } catch (error) {
    console.error('Ошибка при инициализации кнопок корзины:', error);
  }
}

window.initCart = initCart;
window.updateCartCounter = updateCartCounter;
window.addToCart = addToCart;
window.initAddToCartButtons = initAddToCartButtons;
