
/**
 * Функционал корзины
 */

// Инициализация корзины
function initCart() {
  // Получаем сохраненную корзину из localStorage или создаем пустую
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Обновляем счетчик товаров в корзине
  updateCartCounter(cart);
}

// Обновление счетчика товаров в корзине
function updateCartCounter(cart) {
  const cartCounter = document.querySelector('.cart-counter');
  if (cartCounter) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCounter.textContent = totalItems > 0 ? totalItems : '';
    cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Инициализация кнопок добавления в корзину
function initAddToCartButtons() {
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const productCard = this.closest('.product-card');
      if (!productCard) return;
      
      const productLink = productCard.querySelector('.product-link');
      if (!productLink) return;
      
      // Получаем ID товара из URL или атрибута
      let productId;
      if (productLink.href.includes('id=')) {
        productId = productLink.href.split('id=')[1];
      } else if (productLink.dataset.id) {
        productId = productLink.dataset.id;
      }
      
      if (!productId) return;
      
      const productTitle = productCard.querySelector('h3').textContent;
      const productPrice = productCard.querySelector('.current-price').textContent;
      const productImage = productCard.querySelector('.product-image img').src;
      
      addToCart({
        id: productId,
        title: productTitle,
        price: productPrice,
        image: productImage,
        quantity: 1
      });
      
      // Показываем уведомление
      showNotification(`"${productTitle}" добавлен в корзину`);
    });
  });
}

// Добавление товара в корзину
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Проверяем, есть ли уже такой товар в корзине
  const existingProductIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingProductIndex !== -1) {
    // Если товар уже в корзине - увеличиваем количество
    cart[existingProductIndex].quantity += 1;
  } else {
    // Иначе добавляем новый товар
    cart.push(product);
  }
  
  // Сохраняем корзину в localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Обновляем счетчик товаров
  updateCartCounter(cart);
}

// Функции для страницы корзины
function changeQuantity(index, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (index >= 0 && index < cart.length) {
    cart[index].quantity = Math.max(1, cart[index].quantity + delta);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCounter(cart);
  }
}

function updateQuantity(index, value) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (index >= 0 && index < cart.length) {
    const quantity = parseInt(value);
    if (quantity > 0) {
      cart[index].quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      updateCartCounter(cart);
    }
  }
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (index >= 0 && index < cart.length) {
    const removedItem = cart.splice(index, 1)[0];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCounter(cart);
    showNotification(`"${removedItem.title}" удален из корзины`);
  }
}

function renderCart() {
  const cartContainer = document.getElementById('cart-container');
  if (!cartContainer) return;
  
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-message">
        <p>Ваша корзина пуста</p>
        <div class="section-actions" style="margin-top: 2rem;">
          <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
        </div>
      </div>
    `;
    return;
  }
  
  let cartHTML = `
    <div class="cart-items">
  `;
  
  let totalPrice = 0;
  
  cart.forEach((item, index) => {
    const itemPrice = parseFloat(item.price.replace(/[^\d.,]/g, '').replace(',', '.')) * item.quantity;
    totalPrice += itemPrice;
    
    cartHTML += `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <h3><a href="product.html?id=${item.id}">${item.title}</a></h3>
          <div class="product-price">
            <span class="current-price">${item.price}</span>
          </div>
        </div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
          <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${index})">Удалить</button>
      </div>
    `;
  });
  
  cartHTML += `
    </div>
    <div class="cart-summary">
      <div class="cart-summary-row">
        <span>Товары (${cart.length}):</span>
        <span>${totalPrice.toFixed(2)} ₽</span>
      </div>
      <div class="cart-summary-row">
        <span>Доставка:</span>
        <span>Бесплатно</span>
      </div>
      <div class="cart-summary-row cart-total">
        <span>Итого:</span>
        <span>${totalPrice.toFixed(2)} ₽</span>
      </div>
      <div class="section-actions" style="margin-top: 2rem;">
        <button class="btn btn-primary" style="width: 100%;" onclick="checkout()">Оформить заказ</button>
      </div>
    </div>
  `;
  
  cartContainer.innerHTML = cartHTML;
}

function checkout() {
  // Здесь будет функционал для оформления заказа
  alert('Функция оформления заказа находится в разработке');
}
