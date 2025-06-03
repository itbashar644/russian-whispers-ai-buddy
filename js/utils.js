// Утилиты приложения

// Утилиты для работы с localStorage
function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Ошибка при чтении из localStorage (${key}):`, error);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Ошибка при сохранении в localStorage (${key}):`, error);
    return false;
  }
}

// Утилиты для работы с ценами
function parsePrice(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const numeric = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
  return isNaN(numeric) ? 0 : numeric;
}

function formatPrice(price) {
  const value = parsePrice(price);
  return value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
}

// Обновление счетчика корзины
function updateCartCounter() {
  const cart = getFromStorage('cart', []);
  const counters = document.querySelectorAll('.cart-counter');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  counters.forEach(counter => {
    counter.textContent = totalItems > 0 ? totalItems : '';
    counter.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

// Экспорт в глобальный scope
window.getFromStorage = getFromStorage;
window.saveToStorage = saveToStorage;
window.parsePrice = parsePrice;
window.formatPrice = formatPrice;
window.updateCartCounter = updateCartCounter;
