
/**
 * Функционал для работы с категориями
 */

// Функция для загрузки категорий с Supabase
async function loadCategories() {
  const sectionContainer = document.querySelector('.categories-section');
  const listContainer = document.getElementById('categories-list');

  try {
    if (!sectionContainer && !listContainer) return;

    // Показываем состояние загрузки
    if (sectionContainer) {
      sectionContainer.innerHTML = '<div class="loading">Загрузка категорий...</div>';
    }
    if (listContainer) {
      listContainer.innerHTML = '<div class="loading">Загрузка категорий...</div>';
    }
    
    // Загружаем категории с Supabase
    const response = await fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/categories?select=*', {
      headers: CONFIG.apiHeaders
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить категории');
    }
    
    const categories = await response.json();
    
    if (categories.length === 0) {
      if (sectionContainer) {
        sectionContainer.innerHTML = '<div class="empty-message">Категории не найдены</div>';
      }
      if (listContainer) {
        listContainer.innerHTML = '<div class="empty-message">Категории не найдены</div>';
      }
      return;
    }

    // Создаем HTML для секции с карточками категорий
    if (sectionContainer) {
      const sectionHTML = `
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
      sectionContainer.innerHTML = sectionHTML;
    }

    // Создаем HTML для списка категорий в каталоге
    if (listContainer) {
      const listHTML = `
        <a href="catalog.html" class="category-link">Все категории</a>
        ${categories
          .map(category => `<a href="catalog.html?category=${category.name}" class="category-link">${category.name}</a>`)
          .join('')}
      `;
      listContainer.innerHTML = listHTML;
      
      // Выделяем активную категорию
      const urlParams = new URLSearchParams(window.location.search);
      const activeCategory = urlParams.get('category');
      
      if (activeCategory) {
        const activeLink = listContainer.querySelector(`a[href="catalog.html?category=${activeCategory}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      } else {
        // Если категория не выбрана, выделяем "Все категории"
        const allCategoriesLink = listContainer.querySelector(`a[href="catalog.html"]`);
        if (allCategoriesLink) {
          allCategoriesLink.classList.add('active');
        }
      }
    }
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    if (sectionContainer) {
      sectionContainer.innerHTML = '<div class="error-message">Ошибка при загрузке категорий</div>';
    }
    if (listContainer) {
      listContainer.innerHTML = '<div class="error-message">Ошибка при загрузке категорий</div>';
    }
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  loadCategories();
});
