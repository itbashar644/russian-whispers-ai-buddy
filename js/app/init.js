
/**
 * Основная инициализация приложения
 */

import { initHomePage } from './home.js';
import { initCatalogPage } from './catalog.js';
import { initChat } from './chat.js';

let isAppInitialized = false;

// Основная функция инициализации
export function initializeApp() {
  if (isAppInitialized) {
    console.log('Приложение уже инициализировано');
    return;
  }
  
  console.log('Инициализируем приложение...');
  isAppInitialized = true;
  
  // Определяем и инициализируем текущую страницу
  const currentPage = getCurrentPage();
  initializePage(currentPage);
  
  // Дополнительная инициализация кнопок
  setTimeout(() => {
    if (typeof initAddToCartButtons === 'function') {
      initAddToCartButtons();
    }
    if (typeof initWishlistButtons === 'function') {
      initWishlistButtons();
    }
    if (typeof updateWishlistButtons === 'function') {
      updateWishlistButtons();
    }
    if (typeof updateCartCounter === 'function') {
      updateCartCounter();
    }
  }, 300);
}

function getCurrentPage() {
  const path = window.location.pathname;
  if (path === '/' || path === '/index.html' || path.endsWith('index.html')) {
    return 'home';
  } else if (path === '/catalog.html' || path.endsWith('catalog.html')) {
    return 'catalog';
  } else if (path === '/product.html' || path.endsWith('product.html')) {
    return 'product';
  }
  return 'other';
}

function initializePage(pageType) {
  console.log('Инициализируем страницу:', pageType);
  
  switch (pageType) {
    case 'home':
      initHomePage();
      break;
    case 'catalog':
      initCatalogPage();
      break;
    case 'product':
      if (typeof initProductPage === 'function') {
        initProductPage();
      }
      break;
  }
}

// Делаем функции глобально доступными
window.initializeApp = initializeApp;
window.initHomePage = initHomePage;
window.initCatalogPage = initCatalogPage;
window.initChat = initChat;
