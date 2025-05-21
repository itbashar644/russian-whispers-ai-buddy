
document.addEventListener('DOMContentLoaded', function() {
  // Функция для работы с корзиной
  initCart();
  
  // Функция для работы с избранным
  initWishlist();
  
  // Обработка кнопок добавления в корзину
  initAddToCartButtons();
  
  // Обработка кнопок добавления в избранное
  initWishlistButtons();
  
  // Инициализация поиска
  initSearch();
});

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

// Инициализация избранного
function initWishlist() {
  // Получаем сохраненное избранное из localStorage или создаем пустой массив
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  
  // Обновляем отображение кнопок избранного
  updateWishlistButtons(wishlist);
}

// Обновление кнопок избранного
function updateWishlistButtons(wishlist) {
  document.querySelectorAll('.wishlist-button').forEach(button => {
    const productId = button.closest('.product-card').querySelector('.product-link').href.split('id=')[1];
    
    if (wishlist.includes(productId)) {
      button.classList.add('active');
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
    } else {
      button.classList.remove('active');
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
    }
  });
}

// Инициализация кнопок добавления в корзину
function initAddToCartButtons() {
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const productCard = this.closest('.product-card');
      const productLink = productCard.querySelector('.product-link');
      const productId = productLink.href.split('id=')[1];
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

// Инициализация кнопок добавления в избранное
function initWishlistButtons() {
  document.querySelectorAll('.wishlist-button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const productCard = this.closest('.product-card');
      const productLink = productCard.querySelector('.product-link');
      const productId = productLink.href.split('id=')[1];
      const productTitle = productCard.querySelector('h3').textContent;
      
      toggleWishlist(productId, productTitle);
    });
  });
}

// Добавление/удаление товара из избранного
function toggleWishlist(productId, productTitle) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  
  // Проверяем, есть ли товар в избранном
  const index = wishlist.indexOf(productId);
  
  if (index !== -1) {
    // Если товар уже в избранном - удаляем
    wishlist.splice(index, 1);
    showNotification(`"${productTitle}" удален из избранного`);
  } else {
    // Иначе добавляем
    wishlist.push(productId);
    showNotification(`"${productTitle}" добавлен в избранное`);
  }
  
  // Сохраняем избранное в localStorage
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  
  // Обновляем отображение кнопок
  updateWishlistButtons(wishlist);
}

// Инициализация поиска
function initSearch() {
  const searchButton = document.querySelector('.search-button');
  
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      window.location.href = 'catalog.html?focus=search';
    });
  }
}

// Показать уведомление
function showNotification(message) {
  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // Добавляем стили
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = 'white';
  notification.style.color = 'var(--text-color)';
  notification.style.padding = '10px 15px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
  notification.style.zIndex = '1000';
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(20px)';
  notification.style.transition = 'opacity 0.3s, transform 0.3s';
  
  // Добавляем на страницу
  document.body.appendChild(notification);
  
  // Анимация появления
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Удаление через 3 секунды
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}
