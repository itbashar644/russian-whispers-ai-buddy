
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
  initializeApp();
});
