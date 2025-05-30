
import { loadCategories, loadProducts } from './supabase.js';
import { createProductCard } from './utils/productCard.js';

// Глобальная инициализация приложения
document.addEventListener('DOMContentLoaded', async function() {
  console.log('Main.js: DOM загружен, инициализируем приложение...');
  
  // Инициализируем счетчик корзины
  if (typeof updateCartCounter === 'function') {
    updateCartCounter();
  }
  
  // Определяем текущую страницу
  const currentPage = window.location.pathname;
  console.log('Main.js: Текущая страница:', currentPage);
  
  // Инициализация в зависимости от страницы
  if (currentPage === '/' || currentPage === '/index.html' || currentPage.endsWith('index.html')) {
    console.log('Main.js: Инициализируем главную страницу...');
    await initHomePage();
  } else if (currentPage === '/catalog.html' || currentPage.endsWith('catalog.html')) {
    console.log('Main.js: Инициализируем страницу каталога...');
    await initCatalogPage();
  } else if (currentPage === '/product.html' || currentPage.endsWith('product.html')) {
    console.log('Main.js: Инициализируем страницу товара...');
    await initProductPage();
  }
  
  // Инициализируем поиск на всех страницах
  if (typeof initSearch === 'function') {
    initSearch();
  }
  
  // Инициализируем чат на всех страницах
  if (typeof initChat === 'function') {
    initChat();
  }
  
  // Инициализируем функциональность корзины и избранного
  setTimeout(() => {
    if (typeof initAddToCartButtons === 'function') {
      initAddToCartButtons();
    }
    if (typeof initWishlistButtons === 'function') {
      initWishlistButtons();
    }
    if (typeof initWishlist === 'function') {
      initWishlist();
    }
  }, 500);
});

// Инициализация главной страницы
async function initHomePage() {
  try {
    console.log('Загружаем товары для главной страницы...');
    
    // Загружаем категории для секции категорий
    await loadCategoriesForHomePage();
    
    // Загружаем все товары
    const allProducts = await loadProducts();
    console.log('Все товары загружены:', allProducts ? allProducts.length : 0);
    
    if (!allProducts || allProducts.length === 0) {
      console.log('Товары не загружены или пустой массив');
      return;
    }
    
    // Фильтруем бестселлеры и новинки
    const bestsellers = allProducts.filter(product => product.is_bestseller).slice(0, 8);
    const newProducts = allProducts.filter(product => product.is_new).slice(0, 8);
    const popularProducts = allProducts.slice(0, 8);
    
    console.log('Бестселлеры найдены:', bestsellers.length);
    console.log('Новинки найдены:', newProducts.length);
    
    // Рендерим секции товаров
    console.log('Рендерим секции товаров...');
    renderProductSection('bestsellersGrid', bestsellers, 'бестселлеры');
    renderProductSection('newProductsGrid', newProducts, 'новинки');
    renderProductSection('productsGrid', popularProducts, 'популярные товары');
    
  } catch (error) {
    console.error('Ошибка при инициализации главной страницы:', error);
  }
}

// Загрузка категорий для главной страницы
async function loadCategoriesForHomePage() {
  try {
    const categoriesContainer = document.getElementById('categoriesGrid');
    if (!categoriesContainer) return;
    
    categoriesContainer.innerHTML = '<div class="loading">Загружаем категории...</div>';
    
    const categories = await loadCategories();
    
    if (!categories || categories.length === 0) {
      categoriesContainer.innerHTML = '<div class="empty-message">Категории не найдены</div>';
      return;
    }
    
    categoriesContainer.innerHTML = '';
    
    categories.forEach(category => {
      const categoryCard = document.createElement('div');
      categoryCard.className = 'category-card';
      categoryCard.innerHTML = `
        <a href="catalog.html?category=${encodeURIComponent(category.name)}" class="category-link">
          <div class="category-image">
            <img src="${category.image_url}" alt="${category.name}" loading="lazy">
          </div>
          <div class="category-info">
            <h3>${category.name}</h3>
          </div>
        </a>
      `;
      categoriesContainer.appendChild(categoryCard);
    });
    
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    const categoriesContainer = document.getElementById('categoriesGrid');
    if (categoriesContainer) {
      categoriesContainer.innerHTML = '<div class="error-message">Ошибка при загрузке категорий</div>';
    }
  }
}

// Инициализация страницы каталога
async function initCatalogPage() {
  try {
    console.log('Инициализируем каталог...');
    
    // Загружаем категории
    await loadCategoriesForHomePage();
    
    // Загружаем товары
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (typeof loadCatalogProducts === 'function') {
      await loadCatalogProducts(category);
    }
    
    // Инициализируем фильтры
    if (typeof initFilters === 'function') {
      initFilters();
    }
    
    // Фокус на поиске если нужно
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

// Инициализация страницы товара
async function initProductPage() {
  try {
    console.log('Инициализируем страницу товара...');
    
    if (typeof loadProductDetails === 'function') {
      await loadProductDetails();
    }
    
  } catch (error) {
    console.error('Ошибка при инициализации страницы товара:', error);
  }
}

// Функция для рендеринга секции товаров
function renderProductSection(containerId, products, sectionName) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Контейнер ${containerId} не найден`);
    return;
  }
  
  console.log(`Рендерим ${sectionName}:`, products ? products.length : 0);
  
  if (!products || products.length === 0) {
    container.innerHTML = '<div class="empty-message">Товары не найдены</div>';
    return;
  }
  
  container.innerHTML = '';
  
  products.forEach(product => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
  
  // Инициализируем кнопки после добавления карточек
  setTimeout(() => {
    if (typeof initAddToCartButtons === 'function') {
      initAddToCartButtons();
    }
    if (typeof initWishlistButtons === 'function') {
      initWishlistButtons();
    }
    if (typeof updateWishlistButtons === 'function') {
      updateWishlistButtons();
    }
  }, 100);
}

// Обработчик изменения размера окна
window.addEventListener('resize', function() {
  // Можно добавить логику для адаптивности
});

// Обработчик перед выгрузкой страницы
window.addEventListener('beforeunload', function() {
  // Можно добавить логику сохранения данных
});
