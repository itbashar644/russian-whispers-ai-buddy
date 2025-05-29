
import { loadCategories, loadProducts } from './supabase.js';

// Глобальная инициализация приложения
document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOM загружен, инициализируем приложение...');
  
  // Инициализируем счетчик корзины
  if (typeof updateCartCounter === 'function') {
    updateCartCounter();
  }
  
  // Определяем текущую страницу
  const currentPage = window.location.pathname;
  console.log('Текущая страница:', currentPage);
  
  // Инициализация в зависимости от страницы
  if (currentPage === '/' || currentPage === '/index.html' || currentPage.endsWith('index.html')) {
    console.log('Инициализируем главную страницу...');
    await initHomePage();
  } else if (currentPage === '/catalog.html' || currentPage.endsWith('catalog.html')) {
    console.log('Инициализируем страницу каталога...');
    await initCatalogPage();
  } else if (currentPage === '/product.html' || currentPage.endsWith('product.html')) {
    console.log('Инициализируем страницу товара...');
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
  if (typeof initAddToCartButtons === 'function') {
    initAddToCartButtons();
  }
  if (typeof initWishlistButtons === 'function') {
    initWishlistButtons();
  }
  if (typeof initWishlist === 'function') {
    initWishlist();
  }
});

// Инициализация главной страницы
async function initHomePage() {
  try {
    console.log('Загружаем товары для главной страницы...');
    
    // Загружаем все товары
    const allProducts = await loadProducts();
    console.log('Все товары загружены:', allProducts.length);
    
    // Фильтруем бестселлеры и новинки
    const bestsellers = allProducts.filter(product => product.is_bestseller).slice(0, 8);
    const newProducts = allProducts.filter(product => product.is_new).slice(0, 8);
    const popularProducts = allProducts.slice(0, 8);
    
    console.log('Бестселлеры найдены:', bestsellers.length);
    console.log('Новинки найдены:', newProducts.length);
    
    // Рендерим секции товаров
    console.log('Рендерим секции товаров...');
    renderProductSection('bestsellers-products', bestsellers, 'бестселлеры');
    renderProductSection('new-products', newProducts, 'новинки');
    renderProductSection('popular-products', popularProducts, 'популярные товары');
    
  } catch (error) {
    console.error('Ошибка при инициализации главной страницы:', error);
  }
}

// Инициализация страницы каталога
async function initCatalogPage() {
  try {
    console.log('Инициализируем каталог...');
    
    // Загружаем категории
    if (typeof loadCategoriesFromSupabase === 'function') {
      await loadCategoriesFromSupabase();
    }
    
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
      const searchInput = document.getElementById('search-input');
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
  
  console.log(`Рендерим ${sectionName}:`, products.length);
  
  if (products.length === 0) {
    container.innerHTML = '<div class="empty-message">Товары не найдены</div>';
    return;
  }
  
  container.innerHTML = '';
  
  products.forEach(product => {
    if (typeof createProductCard === 'function') {
      const productCard = createProductCard(product);
      container.appendChild(productCard);
    }
  });
}

// Обработчик изменения размера окна
window.addEventListener('resize', function() {
  // Можно добавить логику для адаптивности
});

// Обработчик перед выгрузкой страницы
window.addEventListener('beforeunload', function() {
  // Можно добавить логику сохранения данных
});
