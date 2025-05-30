
/**
 * Упрощенный scripts.js - только для совместимости
 */

// Простые функции для форматирования цены
function parsePrice(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const numeric = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
  return isNaN(numeric) ? 0 : numeric;
}

function formatPrice(price) {
  const value = parsePrice(price);
  return value.toLocaleString('ru-RU') + ' ₽';
}

// Делаем функции глобально доступными для совместимости
window.parsePrice = parsePrice;
window.formatPrice = formatPrice;

console.log('Scripts.js загружен (упрощенная версия)');
