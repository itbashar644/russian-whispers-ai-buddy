
/**
 * Функции для работы с избранным
 */

// Глобальная переменная для предотвращения повторной инициализации
let wishlistInitialized = false;
let wishlistButtonsInitialized = false;

function initWishlist() {
  console.log('Инициализируем избранное...');
  
  if (wishlistInitialized) {
    console.log('Избранное уже инициализировано');
    return;
  }
  
  wishlistInitialized = true;
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
    const buttons = document.querySelectorAll('.wishlist-button');
    console.log('Найдено кнопок избранного для обновления:', buttons.length);
    
    buttons.forEach((button, index) => {
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
      } else {
        console.log(`"${productTitle}" удален из избранного`);
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
      } else {
        console.log(`"${productTitle}" добавлен в избранное`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при работе с избранным:', error);
    return false;
  }
}

function handleWishlistClick(event) {
  event.preventDefault();
  event.stopPropagation();
  
  console.log('Кнопка избранного нажата');
  
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
  
  const productTitleElement = productCard.querySelector('h3 a');
  const productTitle = productTitleElement ? productTitleElement.textContent : 'Товар';
  
  console.log('Данные для избранного:', { productId, productTitle });
  
  toggleWishlist(productId, productTitle);
}

function initWishlistButtons() {
  console.log('Инициализируем кнопки избранного...');
  
  if (wishlistButtonsInitialized) {
    console.log('Кнопки избранного уже инициализированы');
    return;
  }
  
  wishlistButtonsInitialized = true;
  
  // Сначала удаляем старые обработчики
  const existingButtons = document.querySelectorAll('.wishlist-button, .wishlist-btn-large');
  existingButtons.forEach(button => {
    button.removeEventListener('click', handleWishlistClick);
  });
  
  // Добавляем новые обработчики
  const buttons = document.querySelectorAll('.wishlist-button, .wishlist-btn-large');
  console.log('Найдено кнопок избранного для инициализации:', buttons.length);
  
  buttons.forEach((button, index) => {
    console.log(`Добавляем обработчик для кнопки избранного ${index + 1}`);
    button.addEventListener('click', handleWishlistClick);
  });
  
  // Обновляем состояние кнопок
  updateWishlistButtons();
  
  console.log('Кнопки избранного инициализированы для', buttons.length, 'кнопок');
}

// Делаем функции глобально доступными
window.initWishlist = initWishlist;
window.updateWishlistButtons = updateWishlistButtons;
window.toggleWishlist = toggleWishlist;
window.initWishlistButtons = initWishlistButtons;
