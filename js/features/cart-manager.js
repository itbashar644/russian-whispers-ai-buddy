
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
    
    const productCard = event.target.closest('.product-card');
    if (!productCard) return;
    
    const productLink = productCard.querySelector('.product-link');
    if (!productLink) return;
    
    let productId;
    if (productLink.href && productLink.href.includes('id=')) {
      productId = productLink.href.split('id=')[1];
    } else if (productLink.dataset.id) {
      productId = productLink.dataset.id;
    }
    
    if (!productId) return;
    
    const titleElement = productCard.querySelector('h3');
    if (!titleElement) return;
    const productTitle = titleElement.textContent;
    
    const priceElement = productCard.querySelector('.current-price');
    if (!priceElement) return;
    
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
