
/**
 * Главный файл инициализации приложения - упрощенная версия
 */

// Глобальная переменная для отслеживания инициализации
let isMainInitialized = false;

// Основная инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log('Main.js: DOM загружен, запускаем инициализацию...');
  
  // Предотвращаем повторную инициализацию
  if (isMainInitialized) {
    console.log('Main.js: Приложение уже инициализировано');
    return;
  }
  
  isMainInitialized = true;
  
  // Инициализируем базовые функции сразу, без модулей
  initializeBaseFunctions();
});

function initializeBaseFunctions() {
  console.log('Инициализируем базовые функции...');
  
  // Инициализируем корзину
  if (typeof initCart === 'function') {
    initCart();
    console.log('Корзина инициализирована');
  }
  
  // Инициализируем избранное
  if (typeof initWishlist === 'function') {
    initWishlist();
    console.log('Избранное инициализировано');
  }
  
  // Инициализируем поиск
  if (typeof initSearch === 'function') {
    initSearch();
    console.log('Поиск инициализирован');
  }
  
  // Инициализируем чат
  if (typeof initChat === 'function') {
    initChat();
    console.log('Чат инициализирован');
  }
  
  // Инициализируем страницу
  initCurrentPage();
  
  // Инициализируем кнопки
  setTimeout(() => {
    initializeButtons();
  }, 200);
}

function initCurrentPage() {
  const path = window.location.pathname;
  console.log('Инициализируем текущую страницу:', path);
  
  if (path === '/' || path === '/index.html' || path.endsWith('index.html')) {
    if (typeof initHomePage === 'function') {
      initHomePage();
    }
  } else if (path === '/catalog.html' || path.endsWith('catalog.html')) {
    if (typeof initCatalogPage === 'function') {
      initCatalogPage();
    }
  }
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

// Глобальная функция для переинициализации (для использования из других скриптов)
window.reinitializeApp = function() {
  console.log('Переинициализация приложения...');
  setTimeout(() => {
    initializeButtons();
  }, 100);
};
