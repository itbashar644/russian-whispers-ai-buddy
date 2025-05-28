
import { loadCategories, loadProducts } from './supabase.js';

/**
 * Основной скрипт приложения
 */

document.addEventListener('DOMContentLoaded', function() {
  // Функция для работы с корзиной
  if (typeof initCart === 'function') {
    initCart();
  }
  
  // Функция для работы с избранным
  if (typeof initWishlist === 'function') {
    initWishlist();
  }
  
  // Обработка кнопок добавления в корзину
  if (typeof initAddToCartButtons === 'function') {
    initAddToCartButtons();
  }
  
  // Обработка кнопок добавления в избранное
  if (typeof initWishlistButtons === 'function') {
    initWishlistButtons();
  }
  
  // Инициализация поиска
  if (typeof initSearch === 'function') {
    initSearch();
  }
  
  // Загрузка товаров с Supabase, если мы находимся на главной странице
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    loadHomePageData();
  }
  
  // Загрузка товаров в каталоге
  if (window.location.pathname === '/catalog.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // Загружаем категории для сайдбара каталога
    loadCategoriesForCatalog();
    
    if (typeof loadCatalogProducts === 'function') {
      loadCatalogProducts(categoryParam);
    }
  }
  
  // Находим форму обратной связи
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      if (typeof submitContactForm === 'function') {
        submitContactForm(e);
      }
    });
  }
  
  // Если мы на странице корзины, рендерим корзину
  if (window.location.pathname.endsWith('cart.html')) {
    if (typeof renderCart === 'function') {
      renderCart();
    }
  }
  
  // Инициализация чата, если он есть на странице
  if (typeof initChat === 'function') {
    initChat();
  }
  
  // Инициализация мобильного меню
  initMobileMenu();
});

// Загрузка данных для главной страницы
async function loadHomePageData() {
  try {
    // Загружаем категории
    const categories = await loadCategories();
    renderCategories(categories);
    
    // Загружаем популярные товары
    const products = await loadProducts({ limit: 8 });
    renderProducts(products);
  } catch (error) {
    console.error('Error loading home page data:', error);
  }
}

// Рендеринг категорий
function renderCategories(categories) {
  const container = document.getElementById('categoriesGrid');
  if (!container) return;
  
  container.innerHTML = categories.map(category => `
    <div class="category-card">
      <a href="catalog.html?category=${encodeURIComponent(category.name)}">
        ${category.imageUrl ? `<img src="${category.imageUrl}" alt="${category.name}" />` : ''}
        <h3>${category.name}</h3>
        ${category.description ? `<p>${category.description}</p>` : ''}
      </a>
    </div>
  `).join('');
}

// Рендеринг товаров
function renderProducts(products) {
  const container = document.getElementById('productsGrid');
  if (!container) return;
  
  container.innerHTML = products.map(product => `
    <div class="product-card">
      <a href="product.html?id=${product.id}">
        <img src="${product.imageUrl}" alt="${product.title}" loading="lazy" />
        <h3>${product.title}</h3>
        <div class="price">
          ${product.discountPrice ? 
            `<span class="discount-price">${formatPrice(product.discountPrice)}</span>
             <span class="original-price">${formatPrice(product.price)}</span>` :
            `<span class="price">${formatPrice(product.price)}</span>`
          }
        </div>
        <div class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
          ${product.inStock ? 'В наличии' : 'Нет в наличии'}
        </div>
      </a>
      <button class="add-to-cart-btn" data-product-id="${product.id}">
        В корзину
      </button>
    </div>
  `).join('');
  
  // Добавляем обработчики для кнопок "В корзину"
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      if (typeof addToCart === 'function') {
        addToCart(productId);
      }
    });
  });
}

// Форматирование цены
function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(price);
}

// Функция для инициализации мобильного меню
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      // Здесь должен быть код для открытия/закрытия мобильного меню
      // Для простоты реализации просто переключаем видимость навигации
      const mainNav = document.querySelector('.nav-links');
      
      if (mainNav) {
        mainNav.classList.toggle('mobile-open');
      }
    });
  }
}

// Загрузка категорий для каталога
async function loadCategoriesForCatalog() {
  try {
    const categories = await loadCategories();
    // Здесь можно добавить рендеринг категорий в сайдбар каталога
    console.log('Categories loaded for catalog:', categories);
  } catch (error) {
    console.error('Error loading categories for catalog:', error);
  }
}
