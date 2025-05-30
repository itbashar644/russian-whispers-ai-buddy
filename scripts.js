
// Упрощенный scripts.js без дублирования функциональности
// Только для загрузки товаров, вся остальная логика в main.js

import { parsePrice, formatPrice } from './js/utils/priceUtils.js';
import { createProductCard } from './js/utils/productCard.js';

// Экспортируем глобальные функции для загрузки товаров
async function loadFeaturedProducts() {
  try {
    const { loadProducts } = await import('./js/supabase.js');
    const products = await loadProducts();
    
    if (products && products.length > 0) {
      const bestsellers = products.filter(product => product.is_bestseller).slice(0, 8);
      const newProducts = products.filter(product => product.is_new).slice(0, 8);
      const popularProducts = products.slice(0, 8);
      
      renderProductSection('bestsellersGrid', bestsellers);
      renderProductSection('newProductsGrid', newProducts);
      renderProductSection('productsGrid', popularProducts);
    }
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
  }
}

async function loadCategories() {
  try {
    const { loadCategories: loadCategoriesFromSupabase } = await import('./js/supabase.js');
    const categories = await loadCategoriesFromSupabase();
    
    const categoriesContainer = document.getElementById('categoriesGrid');
    if (!categoriesContainer || !categories) return;
    
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
  }
}

function renderProductSection(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container || !products) return;
  
  container.innerHTML = '';
  
  products.forEach(product => {
    let productCard;
    if (typeof createProductCard === 'function') {
      productCard = createProductCard(product);
    } else {
      // Простая альтернатива если createProductCard недоступна
      productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <div class="product-image">
          <a href="product.html?id=${product.id}" class="product-link" data-id="${product.id}">
            <img src="${product.image_url}" alt="${product.title}" loading="lazy">
          </a>
        </div>
        <div class="product-info">
          <h3><a href="product.html?id=${product.id}" class="product-link" data-id="${product.id}">${product.title}</a></h3>
          <div class="product-price">
            <span class="current-price">${product.price} ₽</span>
          </div>
          <button class="add-to-cart-btn" data-id="${product.id}">В корзину</button>
        </div>
      `;
    }
    container.appendChild(productCard);
  });
}

// Делаем функции глобально доступными
window.loadFeaturedProducts = loadFeaturedProducts;
window.loadCategories = loadCategories;

// НЕ ИНИЦИАЛИЗИРУЕМ НИЧЕГО ЗДЕСЬ - все инициализация в main.js
