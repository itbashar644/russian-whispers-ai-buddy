
/**
 * Функции для работы с избранным
 */

function initWishlist() {
  console.log('Инициализируем избранное...');
  updateWishlistButtons();
}

function updateWishlistButtons() {
  try {
    console.log('Обновляем кнопки избранного...');
    // Получаем текущий список избранных товаров из localStorage
    let wishlist = getFromStorage('wishlist', []);
    
    // Поддержка старого формата хранения (массив объектов)
    if (wishlist.length > 0 && typeof wishlist[0] === 'object') {
      wishlist = wishlist.map(item => item.id);
      saveToStorage('wishlist', wishlist);
    }
    
    // Обновляем состояние всех кнопок избранного на странице
    document.querySelectorAll('.wishlist-button').forEach(button => {
      const productCard = button.closest('.product-card');
      if (!productCard) return;
      
      const productLink = productCard.querySelector('.product-link');
      if (!productLink) return;
      
      // Получаем ID товара из URL или атрибута
      let productId;
      if (productLink.href && productLink.href.includes('id=')) {
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
    
    console.log('Кнопки избранного обновлены, товаров в избранном:', wishlist.length);
  } catch (error) {
    console.error('Ошибка при обновлении кнопок избранного:', error);
  }
}

function toggleWishlist(productId, productTitle) {
  try {
    console.log('Переключаем избранное для товара:', productId, productTitle);
    
    // Получаем текущий список избранных товаров из localStorage
    let wishlist = getFromStorage('wishlist', []);
    
    // Поддержка старого формата хранения (массив объектов)
    if (wishlist.length > 0 && typeof wishlist[0] === 'object') {
      wishlist = wishlist.map(item => item.id);
      saveToStorage('wishlist', wishlist);
    }
    
    // Проверяем, есть ли уже этот товар в избранном
    const existingIndex = wishlist.indexOf(productId);
    
    if (existingIndex >= 0) {
      // Если товар уже в избранном, удаляем его
      wishlist.splice(existingIndex, 1);
      
      // Сохраняем обновленный список
      saveToStorage('wishlist', wishlist);
      
      // Обновляем статус кнопок избранного
      updateWishlistButtons();
      
      if (typeof showNotification === 'function') {
        showNotification(`"${productTitle}" удален из избранного`);
      }
    } else {
      // Если товара нет в избранном, добавляем его
      wishlist.push(productId);
      
      // Сохраняем обновленный список
      saveToStorage('wishlist', wishlist);
      
      // Обновляем статус кнопок избранного
      updateWishlistButtons();
      
      if (typeof showNotification === 'function') {
        showNotification(`"${productTitle}" добавлен в избранное`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при работе с избранным:', error);
    return false;
  }
}

function initWishlistButtons() {
  console.log('Инициализируем кнопки избранного...');
  
  document.querySelectorAll('.wishlist-button, .wishlist-btn-large').forEach(button => {
    // Удаляем старые обработчики событий
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const productCard = this.closest('.product-card');
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
      
      const productTitle = productCard.querySelector('h3 a').textContent;
      
      toggleWishlist(productId, productTitle);
    });
  });
  
  // Обновляем состояние кнопок
  updateWishlistButtons();
  
  console.log('Кнопки избранного инициализированы для', document.querySelectorAll('.wishlist-button, .wishlist-btn-large').length, 'кнопок');
}

// Делаем функции глобально доступными
window.initWishlist = initWishlist;
window.updateWishlistButtons = updateWishlistButtons;
window.toggleWishlist = toggleWishlist;
window.initWishlistButtons = initWishlistButtons;
