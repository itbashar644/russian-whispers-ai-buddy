
/**
 * Функции для работы с избранным
 */

// Добавление товара в избранное
function addToWishlist(product) {
  if (!product || !product.id) {
    console.error('Некорректный товар для добавления в избранное');
    return false;
  }

  const wishlist = getFromStorage('wishlist', []);
  const existingItem = wishlist.find(item => item.id === product.id);

  if (!existingItem) {
    wishlist.push(product);
    saveToStorage('wishlist', wishlist);
    showSuccess('Товар добавлен в избранное');
    updateWishlistButtons();
    return true;
  } else {
    showNotification('Товар уже в избранном');
    return false;
  }
}

// Удаление товара из избранного
function removeFromWishlist(productId) {
  const wishlist = getFromStorage('wishlist', []);
  const updatedWishlist = wishlist.filter(item => item.id !== productId);
  saveToStorage('wishlist', updatedWishlist);
  showSuccess('Товар удален из избранного');
  updateWishlistButtons();
}

// Проверка, есть ли товар в избранном
function isInWishlist(productId) {
  const wishlist = getFromStorage('wishlist', []);
  return wishlist.some(item => item.id === productId);
}

// Получение товаров избранного
function getWishlistItems() {
  return getFromStorage('wishlist', []);
}

// Обновление состояния кнопок избранного
function updateWishlistButtons() {
  const buttons = document.querySelectorAll('.wishlist-button');
  
  buttons.forEach(button => {
    const productId = button.getAttribute('data-id');
    if (productId && isInWishlist(productId)) {
      button.classList.add('active');
      button.style.color = '#e74c3c';
    } else {
      button.classList.remove('active');
      button.style.color = '';
    }
  });
}

// Инициализация обработчиков кнопок избранного
function initWishlistButtons() {
  const buttons = document.querySelectorAll('.wishlist-button');
  
  buttons.forEach(button => {
    button.removeEventListener('click', handleWishlistClick);
    button.addEventListener('click', handleWishlistClick);
  });
  
  updateWishlistButtons();
}

function handleWishlistClick(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const productId = this.getAttribute('data-id');
  if (!productId) {
    console.error('Не найден ID товара');
    return;
  }
  
  if (isInWishlist(productId)) {
    removeFromWishlist(productId);
  } else {
    // Получаем данные товара из DOM
    const productCard = this.closest('.product-card');
    if (productCard) {
      const product = {
        id: productId,
        title: productCard.querySelector('h3 a, .product-title')?.textContent?.trim() || 'Товар',
        price: extractPriceFromElement(productCard),
        image_url: productCard.querySelector('img')?.src || '/placeholder.svg'
      };
      
      addToWishlist(product);
    }
  }
}

// Экспорт функций
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.isInWishlist = isInWishlist;
window.getWishlistItems = getWishlistItems;
window.updateWishlistButtons = updateWishlistButtons;
window.initWishlistButtons = initWishlistButtons;
