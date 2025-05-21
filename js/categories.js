
/**
 * Функционал для работы с категориями
 */

// Функция для загрузки категорий с Supabase
async function loadCategories() {
  try {
    const categoriesContainer = document.querySelector('.categories-section');
    if (!categoriesContainer) return;
    
    // Показываем состояние загрузки
    categoriesContainer.innerHTML = '<div class="loading">Загрузка категорий...</div>';
    
    // Загружаем категории с Supabase
    const response = await fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/categories?select=*', {
      headers: CONFIG.apiHeaders
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить категории');
    }
    
    const categories = await response.json();
    
    if (categories.length === 0) {
      categoriesContainer.innerHTML = '<div class="empty-message">Категории не найдены</div>';
      return;
    }
    
    // Создаем HTML для категорий
    const categoriesHTML = `
      <h2 class="section-title">Категории</h2>
      <div class="categories-grid">
        ${categories.map(category => `
          <a href="catalog.html?category=${category.name}" class="category-card">
            <div class="category-image">
              <img src="${category.image_url || '/placeholder.svg'}" alt="${category.name}">
            </div>
            <h3>${category.name}</h3>
          </a>
        `).join('')}
      </div>
    `;
    
    // Обновляем контейнер
    categoriesContainer.innerHTML = categoriesHTML;
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    const categoriesContainer = document.querySelector('.categories-section');
    if (categoriesContainer) {
      categoriesContainer.innerHTML = '<div class="error-message">Ошибка при загрузке категорий</div>';
    }
  }
}
