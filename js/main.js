
/**
 * Главный файл инициализации приложения
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
  
  // Инициализируем базовые функции
  initializeBaseFunctions();
  
  // Пытаемся загрузить модульную версию, но не блокируем работу при ошибке
  setTimeout(() => {
    try {
      import('./app/init.js').then(module => {
        if (module.initializeApp) {
          module.initializeApp();
          console.log('Модульная инициализация выполнена');
        }
      }).catch(error => {
        console.log('Модульная инициализация недоступна, используем базовую');
      });
    } catch (error) {
      console.log('Ошибка при загрузке модулей, работаем без них');
    }
  }, 100);
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
  
  // Инициализируем кнопки
  setTimeout(() => {
    initializeButtons();
  }, 200);
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
