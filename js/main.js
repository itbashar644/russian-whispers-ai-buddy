
/**
 * Главный файл инициализации приложения
 */

// Импортируем модули
import { initializeApp } from './app/init.js';

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
  
  // Запускаем основную инициализацию
  try {
    initializeApp();
  } catch (error) {
    console.error('Ошибка при инициализации приложения:', error);
    
    // Фоллбэк - инициализируем базовые функции напрямую
    setTimeout(() => {
      console.log('Запускаем фоллбэк инициализацию...');
      
      if (typeof initCart === 'function') {
        initCart();
      }
      
      if (typeof initWishlist === 'function') {
        initWishlist();
      }
      
      if (typeof initSearch === 'function') {
        initSearch();
      }
      
      if (typeof initChat === 'function') {
        initChat();
      }
      
      // Инициализируем кнопки
      setTimeout(() => {
        if (typeof initAddToCartButtons === 'function') {
          initAddToCartButtons();
        }
        
        if (typeof initWishlistButtons === 'function') {
          initWishlistButtons();
        }
        
        if (typeof updateCartCounter === 'function') {
          updateCartCounter();
        }
      }, 500);
    }, 100);
  }
});
