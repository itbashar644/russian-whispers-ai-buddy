
/**
 * Утилиты для работы с ценами
 */

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

window.parsePrice = parsePrice;
window.formatPrice = formatPrice;
