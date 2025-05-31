
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
  
  // Инициализируем базовые функции последовательно
  initializeBaseFunctions();
  
  // Определяем и инициализируем текущую страницу
  const currentPage = getCurrentPage();
  initializePage(currentPage);
}

function initializeBaseFunctions() {
  console.log('Инициализируем базовые функции...');
  
  // Таймауты для правильной последовательности инициализации
  setTimeout(() => {
    if (typeof initSearch === 'function') {
      initSearch();
      console.log('Поиск инициализирован');
    }
  }, 100);
  
  setTimeout(() => {
    initChat();
    console.log('Чат инициализирован');
  }, 200);
  
  setTimeout(() => {
    if (typeof initCart === 'function') {
      initCart();
      console.log('Корзина инициализирована');
    }
  }, 300);
  
  setTimeout(() => {
    if (typeof initWishlist === 'function') {
      initWishlist();
      console.log('Избранное инициализировано');
    }
  }, 400);
  
  // Инициализируем кнопки после всех базовых функций
  setTimeout(() => {
    initializeButtons();
  }, 500);
}

function initializeButtons() {
  console.log('Инициализируем кнопки...');
  
  if (typeof initAddToCartButtons === 'function') {
    initAddToCartButtons();
    console.log('Кнопки корзины инициализированы');
  }
  
  if (typeof initWishlistButtons === 'function') {
    initWishlistButtons();
    console.log('Кнопки избранного инициализированы');
  }
  
  if (typeof updateWishlistButtons === 'function') {
    updateWishlistButtons();
    console.log('Состояние кнопок избранного обновлено');
  }
  
  if (typeof updateCartCounter === 'function') {
    updateCartCounter();
    console.log('Счетчик корзины обновлен');
  }
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
