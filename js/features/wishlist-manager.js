
/**
 * Менеджер избранного
 */

let wishlistInitialized = false;

function initWishlist() {
  if (wishlistInitialized) return;
  wishlistInitialized = true;
  updateWishlistButtons();
}

function updateWishlistButtons() {
  try {
    let wishlist = getFromStorage('wishlist', []);
    
    if (wishlist.length > 0 && typeof wishlist[0] === 'object') {
      wishlist = wishlist.map(item => item.id);
      saveToStorage('wishlist', wishlist);
    }
    
    const buttons = document.querySelectorAll('.wishlist-button');
    
    buttons.forEach(button => {
      const productCard = button.closest('.product-card');
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
      
      if (wishlist.includes(productId)) {
        button.classList.add('active');
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
      } else {
        button.classList.remove('active');
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
      }
    });
  } catch (error) {
    console.error('Ошибка при обновлении кнопок избранного:', error);
  }
}

function toggleWishlist(productId, productTitle) {
  try {
    let wishlist = getFromStorage('wishlist', []);
    
    if (wishlist.length > 0 && typeof wishlist[0] === 'object') {
      wishlist = wishlist.map(item => item.id);
      saveToStorage('wishlist', wishlist);
    }
    
    const existingIndex = wishlist.indexOf(productId);
    
    if (existingIndex >= 0) {
      wishlist.splice(existingIndex, 1);
      saveToStorage('wishlist', wishlist);
      updateWishlistButtons();
      showNotification(`"${productTitle}" удален из избранного`);
    } else {
      wishlist.push(productId);
      saveToStorage('wishlist', wishlist);
      updateWishlistButtons();
      showNotification(`"${productTitle}" добавлен в избранное`);
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при работе с избранным:', error);
    return false;
  }
}

function handleWishlistClick(event) {
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
    
    const productTitleElement = productCard.querySelector('h3 a') || productCard.querySelector('h3');
    const productTitle = productTitleElement ? productTitleElement.textContent : 'Товар';
    
    toggleWishlist(productId, productTitle);
  } catch (error) {
    console.error('Ошибка в handleWishlistClick:', error);
  }
}

function initWishlistButtons() {
  try {
    const existingButtons = document.querySelectorAll('.wishlist-button, .wishlist-btn-large');
    existingButtons.forEach(button => {
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
    });
    
    const buttons = document.querySelectorAll('.wishlist-button, .wishlist-btn-large');
    buttons.forEach(button => {
      button.addEventListener('click', handleWishlistClick);
    });
    
    updateWishlistButtons();
  } catch (error) {
    console.error('Ошибка при инициализации кнопок избранного:', error);
  }
}

window.initWishlist = initWishlist;
window.initWishlistButtons = initWishlistButtons;
window.updateWishlistButtons = updateWishlistButtons;
