
/**
 * Функционал избранного
 */

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
    const productCard = button.closest('.product-card');
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
    
    if (wishlist.includes(productId)) {
      button.classList.add('active');
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
    } else {
      button.classList.remove('active');
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
    }
  });
}

// Инициализация кнопок добавления в избранное
function initWishlistButtons() {
  document.querySelectorAll('.wishlist-button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
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
