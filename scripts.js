
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

async function loadCatalogProducts(category) {
  console.log('loadCatalogProducts вызвана с категорией:', category);
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
  
  // Важно: инициализируем обработчики после добавления карточек
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
    console.log('Обработчики событий инициализированы для секции:', containerId);
  }, 100);
}

// Делаем функции глобально доступными
window.loadFeaturedProducts = loadFeaturedProducts;
window.loadCategories = loadCategories;
window.loadCatalogProducts = loadCatalogProducts;

// Минимальная инициализация только если main.js не загружен
document.addEventListener('DOMContentLoaded', function() {
  console.log('Scripts.js: DOM загружен...');
  
  // Проверяем, загружен ли main.js
  const isMainPageWithMainJs = (window.location.pathname === '/' || window.location.pathname === '/index.html') && typeof window.initHomePage !== 'undefined';
  
  if (!isMainPageWithMainJs) {
    console.log('Scripts.js: Инициализируем fallback функции...');
    
    // Функция для работы с корзиной
    if (typeof initCart === 'function') {
      initCart();
    }
    
    // Обработка кнопок добавления в корзину
    if (typeof initAddToCartButtons === 'function') {
      initAddToCartButtons();
    }
    
    // Инициализация избранного
    if (typeof initWishlist === 'function') {
      initWishlist();
    }
    
    // Инициализация поиска
    if (typeof initSearch === 'function') {
      initSearch();
    }
    
    // Инициализация чата
    if (typeof initChat === 'function') {
      console.log('Инициализируем чат из scripts.js');
      initChat();
    }
    
    // Загрузка товаров с Supabase, если мы находимся на главной странице
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      loadFeaturedProducts();
      loadCategories();
    }
    
    // Загрузка товаров в каталоге
    if (window.location.pathname.includes('catalog.html')) {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      loadCatalogProducts(categoryParam);
    }
  }
});
