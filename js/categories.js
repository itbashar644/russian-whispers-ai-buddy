
/**
 * Функционал для работы с категориями
 */

// Функция для загрузки категорий
async function loadCategories() {
  const categoriesContainer = document.getElementById('categories');
  const catalogCategoriesContainer = document.querySelector('.catalog-categories');
  
  if (!categoriesContainer && !catalogCategoriesContainer) return;
  
  try {
    // Получаем категории
    const categories = await fetchCategories();
    
    // Если ничего не получили, выходим
    if (!categories || categories.length === 0) {
      console.log('Категории не найдены');
      return;
    }
    
    // Если мы на главной странице и есть контейнер для категорий
    if (categoriesContainer) {
      const categoriesHTML = `
        <h2 class="section-title">Категории товаров</h2>
        <div class="categories-grid">
          ${categories.map(category => `
            <a href="catalog.html?category=${category.name}" class="category-card">
              <div class="category-image">
                <img src="${category.image}" alt="${category.name}" loading="lazy">
              </div>
              <div class="category-name">${category.name}</div>
            </a>
          `).join('')}
        </div>
      `;
      
      categoriesContainer.innerHTML = categoriesHTML;
    }
    
    // Если мы в каталоге и есть контейнер для категорий
    if (catalogCategoriesContainer) {
      const urlParams = new URLSearchParams(window.location.search);
      const currentCategory = urlParams.get('category');
      
      const catalogCategoriesHTML = `
        <h2 class="sidebar-title">Категории</h2>
        <ul class="category-list">
          <li>
            <a href="catalog.html" class="category-link ${!currentCategory ? 'active' : ''}">
              Все категории
            </a>
          </li>
          ${categories.map(category => `
            <li>
              <a href="catalog.html?category=${category.name}" class="category-link ${currentCategory === category.name ? 'active' : ''}">
                ${category.name}
              </a>
            </li>
          `).join('')}
        </ul>
      `;
      
      catalogCategoriesContainer.innerHTML = catalogCategoriesHTML;
    }
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
  }
}

// Функция для получения категорий из базы данных
async function fetchCategories() {
  try {
    // Для демонстрационных целей используем моковые данные
    // В реальном проекте здесь будет запрос к API
    return [
      {
        id: '1',
        name: 'Электроника',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      },
      {
        id: '2',
        name: 'Дом и сад',
        image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      },
      {
        id: '3',
        name: 'Аксессуары',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      },
      {
        id: '4',
        name: 'Одежда',
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      }
    ];
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return [];
  }
}

// Загружаем категории при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  loadCategories();
});
