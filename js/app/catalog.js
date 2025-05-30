
/**
 * Функционал для страницы каталога
 */

// Инициализация страницы каталога
export async function initCatalogPage() {
  try {
    console.log('Инициализируем каталог...');
    
    // Загружаем категории
    if (typeof loadCatalogCategories === 'function') {
      await loadCatalogCategories();
    }
    
    // Загружаем товары
    if (typeof loadCatalogProducts === 'function') {
      await loadCatalogProducts();
    }
    
    // Инициализируем фильтры
    if (typeof initFilters === 'function') {
      initFilters();
    }
    
    // Фокус на поиске если нужно
    const urlParams = new URLSearchParams(window.location.search);
    const focus = urlParams.get('focus');
    if (focus === 'search') {
      let searchInput = document.querySelector('.catalog-search #search-input');
      if (!searchInput) {
        searchInput = document.getElementById('search-input');
      }
      if (searchInput) {
        searchInput.focus();
      }
    }
    
  } catch (error) {
    console.error('Ошибка при инициализации каталога:', error);
  }
}

// Делаем функцию глобально доступной
window.initCatalogPage = initCatalogPage;
