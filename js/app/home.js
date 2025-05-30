
/**
 * Функционал для главной страницы
 */

import { loadCategories, loadProducts } from '../supabase.js';
import { createProductCard } from '../utils/productCard.js';

// Инициализация главной страницы
export async function initHomePage() {
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

// Делаем функцию глобально доступной
window.initHomePage = initHomePage;
