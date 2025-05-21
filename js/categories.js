
/**
 * Функционал для работы с категориями
 */

// Набор категорий по умолчанию, который будет показан при ошибке загрузки
const FALLBACK_CATEGORIES = [
  { name: 'Популярное', image_url: '/placeholder.svg' },
  { name: 'Новинки', image_url: '/placeholder.svg' },
  { name: 'Скидки', image_url: '/placeholder.svg' }
];

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
    const url = `${CONFIG.supabaseUrl}/rest/v1/categories?select=*`;
    const response = await fetch(url, { headers: CONFIG.apiHeaders });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить категории');
    }
    
    const categories = await response.json();
    const items = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

   renderCategories(items);
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    // При ошибке используем резервный список категорий
    renderCategories(FALLBACK_CATEGORIES);
  }
}

// Вспомогательная функция для отрисовки секции категорий и списка
function renderCategories(categories) {
  const sectionContainer = document.querySelector('.categories-section');
  const listContainer = document.getElementById('categories-list');

  if (sectionContainer) {
    const sectionHTML = `
      <h2 class="section-title">Категории</h2>
      <div class="categories-grid">
        ${categories
          .map(c => `
            <a href="catalog.html?category=${c.name}" class="category-card">
              <div class="category-image">
               <img src="${c.image_url || '/placeholder.svg'}" alt="${c.name}">
              </div>
             <h3>${c.name}</h3>
            </a>
             `)
          .join('')}
      </div>`;
    sectionContainer.innerHTML = sectionHTML;
  }
if (listContainer) {
    const listHTML = categories
      .map(c => `<a href="catalog.html?category=${c.name}" class="category-link">${c.name}</a>`)
      .join('');
    listContainer.innerHTML = listHTML;
  }
}
