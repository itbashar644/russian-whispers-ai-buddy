
/**
 * Основной файл приложения
 */

let isAppInitialized = false;

function initializeApp() {
  if (isAppInitialized) return;
  isAppInitialized = true;
  
  console.log('Инициализируем приложение...');
  
  initCart();
  initWishlist();
  
  const path = window.location.pathname;
  if (path === '/' || path === '/index.html' || path.endsWith('index.html')) {
    loadHomePageProducts();
  }
  
  setTimeout(() => {
    initializeButtons();
  }, 200);
}

function initializeButtons() {
  console.log('Инициализируем кнопки...');
  
  initAddToCartButtons();
  initWishlistButtons();
  updateWishlistButtons();
  updateCartCounter();
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', initializeApp);

// Глобальная функция для переинициализации
window.reinitializeApp = function() {
  console.log('Переинициализация приложения...');
  setTimeout(() => {
    initializeButtons();
  }, 100);
};

window.initializeButtons = initializeButtons;
