
/**
 * Функционал для работы с фильтрами в каталоге
 */

// Функция для инициализации фильтров
function initFilters() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Focus search input if requested via URL
  if (urlParams.get('focus') === 'search') {
    const searchField = document.getElementById('search-input');
    if (searchField) {
      searchField.focus();
    }
  }
  
  // Фильтр по цене
  const priceMinInput = document.getElementById('price-min');
  const priceMaxInput = document.getElementById('price-max');
  const applyPriceBtn = document.getElementById('apply-price-filter');
  
  if (priceMinInput && priceMaxInput && applyPriceBtn) {
    // Восстанавливаем фильтры из URL
    const minPrice = urlParams.get('min_price');
    const maxPrice = urlParams.get('max_price');
    
    if (minPrice) priceMinInput.value = minPrice;
    if (maxPrice) priceMaxInput.value = maxPrice;
    
    // Обработчик применения фильтра цены
    applyPriceBtn.addEventListener('click', function() {
      applyFilters();
    });
  }
  

  
  // Фильтр по поиску
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  
  if (searchInput && searchButton) {
    // Восстанавливаем поисковый запрос из URL
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
      searchInput.value = searchQuery;
    }
    
    // Обработчик нажатия на кнопку поиска
    searchButton.addEventListener('click', function() {
      applyFilters();
    });
    
    // Обработчик нажатия Enter в поле поиска
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        applyFilters();
      }
    });
  }
  
  // Сортировка
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    // Восстанавливаем сортировку из URL
    const sortParam = urlParams.get('sort');
    if (sortParam) {
      sortSelect.value = sortParam;
    }
    
    // Обработчик изменения сортировки
    sortSelect.addEventListener('change', function() {
      applyFilters();
    });
  }
  
  // Инициализация отображения активных фильтров
  updateActiveFilters();
}

// Функция для применения фильтров
function applyFilters() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Сохраняем категорию, если она была выбрана
  const category = urlParams.get('category');
  
  // Создаем новый URLSearchParams
  const newParams = new URLSearchParams();
  
  // Добавляем категорию, если она была
  if (category) {
    newParams.set('category', category);
  }
  
  // Добавляем фильтр по цене
  const priceMinInput = document.getElementById('price-min');
  const priceMaxInput = document.getElementById('price-max');
  
  if (priceMinInput.value) {
    newParams.set('min_price', priceMinInput.value);
  }
  
  if (priceMaxInput.value) {
    newParams.set('max_price', priceMaxInput.value);
  }
  
  
  // Добавляем поисковый запрос
  const searchInput = document.getElementById('search-input');
  if (searchInput && searchInput.value.trim()) {
    newParams.set('search', searchInput.value.trim());
  }
  
  // Добавляем сортировку
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    newParams.set('sort', sortSelect.value);
  }
  
  // Обновляем URL с новыми параметрами
  window.location.href = `${window.location.pathname}?${newParams.toString()}`;
}

// Функция для обновления отображения активных фильтров
function updateActiveFilters() {
  const activeFiltersContainer = document.getElementById('active-filters');
  if (!activeFiltersContainer) return;
  
  const urlParams = new URLSearchParams(window.location.search);
  let hasActiveFilters = false;
  let filtersHTML = '';
  
  // Проверяем наличие категории
  const category = urlParams.get('category');
  if (category) {
    filtersHTML += createFilterTag('Категория', category, () => removeFilter('category'));
    hasActiveFilters = true;
  }
  
  // Проверяем фильтр по цене
  const minPrice = urlParams.get('min_price');
  const maxPrice = urlParams.get('max_price');
  
  if (minPrice && maxPrice) {
    filtersHTML += createFilterTag('Цена', `${minPrice} - ${maxPrice} ₽`, () => removeFilter('min_price', 'max_price'));
    hasActiveFilters = true;
  } else if (minPrice) {
    filtersHTML += createFilterTag('Цена от', `${minPrice} ₽`, () => removeFilter('min_price'));
    hasActiveFilters = true;
  } else if (maxPrice) {
    filtersHTML += createFilterTag('Цена до', `${maxPrice} ₽`, () => removeFilter('max_price'));
    hasActiveFilters = true;
  }
  

  
  // Проверяем поисковый запрос
  const searchQuery = urlParams.get('search');
  if (searchQuery) {
    filtersHTML += createFilterTag('Поиск', searchQuery, () => removeFilter('search'));
    hasActiveFilters = true;
  }
  
  // Добавляем кнопку сброса всех фильтров, если есть активные фильтры
  if (hasActiveFilters) {
    filtersHTML += `
      <button class="filter-tag clear-all" onclick="clearAllFilters()">
        Сбросить все <i class="fas fa-times"></i>
      </button>
    `;
  }
  
  // Обновляем контейнер активных фильтров
  if (hasActiveFilters) {
    activeFiltersContainer.innerHTML = filtersHTML;
    activeFiltersContainer.style.display = 'flex';
  } else {
    activeFiltersContainer.style.display = 'none';
  }
}

// Функция для создания тега фильтра
function createFilterTag(name, value, removeCallback) {
  const displayText = value ? `${name}: ${value}` : name;
  return `
    <div class="filter-tag">
      ${displayText}
      <button class="filter-tag-remove" onclick="event.preventDefault(); ${removeCallback.toString().replace(/function\s*\(\)\s*\{\s*(return\s*)?|\s*\}$/g, '')}">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
}

// Функция для удаления фильтра из URL
function removeFilter(...paramNames) {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Удаляем указанные параметры
  paramNames.forEach(param => {
    urlParams.delete(param);
  });
  
  // Обновляем URL с новыми параметрами
  window.location.href = `${window.location.pathname}?${urlParams.toString()}`;
}

// Функция для сброса всех фильтров
function clearAllFilters() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  
  if (category) {
    // Если была выбрана категория, оставляем только её
    window.location.href = `${window.location.pathname}?category=${category}`;
  } else {
    // Если категории не было, полностью очищаем URL
    window.location.href = window.location.pathname;
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Проверяем, находимся ли мы на странице каталога
  if (document.getElementById('products-container')) {
    initFilters();
  }
});
