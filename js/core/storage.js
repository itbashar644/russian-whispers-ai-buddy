
/**
 * Утилиты для работы с localStorage
 */

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

// Экспортируем функции глобально
window.getFromStorage = getFromStorage;
window.saveToStorage = saveToStorage;
