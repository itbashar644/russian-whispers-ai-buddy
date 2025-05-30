
/**
 * Утилиты для работы с ценами
 */

// Преобразовать текст цены в числовое значение
export function parsePrice(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const numeric = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
  return isNaN(numeric) ? 0 : numeric;
}

// Форматирование цены с пробелами между тысячами и знаком рубля
export function formatPrice(price) {
  const value = parsePrice(price);
  return value.toLocaleString('ru-RU') + ' ₽';
}

// Создание slug из названия товара
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
