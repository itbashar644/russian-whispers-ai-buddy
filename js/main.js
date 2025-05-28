
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
    console.log('Загружаю данные для главной страницы...');
    
    // Загружаем категории
    const categories = await loadCategories();
    console.log('Категории загружены:', categories);
    if (categories && categories.length > 0) {
      renderCategories(categories);
    } else {
      console.warn('Категории не найдены');
      renderCategoriesPlaceholder();
    }
    
    // Загружаем популярные товары
    const products = await loadProducts({ limit: 8 });
    console.log('Товары загружены:', products);
    if (products && products.length > 0) {
      renderProducts(products);
    } else {
      console.warn('Товары не найдены');
      renderProductsPlaceholder();
    }
  } catch (error) {
    console.error('Ошибка загрузки данных главной страницы:', error);
    renderCategoriesPlaceholder();
    renderProductsPlaceholder();
  }
}

// Рендеринг категорий
function renderCategories(categories) {
  const container = document.getElementById('categoriesGrid');
  if (!container) {
    console.warn('Контейнер categoriesGrid не найден');
    return;
  }
  
  container.innerHTML = categories.map(category => `
    <div class="category-card">
      <a href="catalog.html?category=${encodeURIComponent(category.name)}">
        ${category.image_url ? `<img src="${category.image_url}" alt="${category.name}" />` : ''}
        <h3>${category.name}</h3>
      </a>
    </div>
  `).join('');
}

// Плейсхолдер для категорий если данные не загрузились
function renderCategoriesPlaceholder() {
  const container = document.getElementById('categoriesGrid');
  if (!container) return;
  
  const placeholderCategories = [
    { name: 'Смарт-часы', image_url: '/lovable-uploads/5e17e20e-4457-4c61-be22-2d405cd6a88e.png' },
    { name: 'Планшеты', image_url: '/lovable-uploads/5e17e20e-4457-4c61-be22-2d405cd6a88e.png' },
    { name: 'Проекторы', image_url: '/lovable-uploads/5e17e20e-4457-4c61-be22-2d405cd6a88e.png' },
    { name: 'Наушники', image_url: '/lovable-uploads/5e17e20e-4457-4c61-be22-2d405cd6a88e.png' }
  ];
  
  container.innerHTML = placeholderCategories.map(category => `
    <div class="category-card">
      <a href="catalog.html?category=${encodeURIComponent(category.name)}">
        <img src="${category.image_url}" alt="${category.name}" />
        <h3>${category.name}</h3>
      </a>
    </div>
  `).join('');
}

// Рендеринг товаров
function renderProducts(products) {
  const container = document.getElementById('productsGrid');
  if (!container) {
    console.warn('Контейнер productsGrid не найден');
    return;
  }
  
  container.innerHTML = products.map(product => `
    <div class="product-card">
      <a href="product.html?id=${product.id}">
        <img src="${product.image_url || '/lovable-uploads/5e17e20e-4457-4c61-be22-2d405cd6a88e.png'}" alt="${product.title}" loading="lazy" />
        <h3>${product.title}</h3>
        <div class="price">
          ${product.discount_price ? 
            `<span class="discount-price">${formatPrice(product.discount_price)}</span>
             <span class="original-price">${formatPrice(product.price)}</span>` :
            `<span class="price">${formatPrice(product.price)}</span>`
          }
        </div>
        <div class="stock-status ${product.in_stock ? 'in-stock' : 'out-of-stock'}">
          ${product.in_stock ? 'В наличии' : 'Нет в наличии'}
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

// Плейсхолдер для товаров если данные не загрузились
function renderProductsPlaceholder() {
  const container = document.getElementById('productsGrid');
  if (!container) return;
  
  const placeholderProducts = [
    {
      id: '1',
      title: 'Смарт-часы HK9 Ultra',
      price: 2990,
      discount_price: 1990,
      image_url: '/lovable-uploads/5e17e20e-4457-4c61-be22-2d405cd6a88e.png',
      in_stock: true
    },
    {
      id: '2', 
      title: 'Планшет Android 512GB',
      price: 15990,
      image_url: '/lovable-uploads/5e17e20e-4457-4c61-be22-2d405cd6a88e.png',
      in_stock: true
    },
    {
      id: '3',
      title: 'Проектор Mini HD',
      price: 8990,
      image_url: '/lovable-uploads/5e17e20e-4457-4c61-be22-2d405cd6a88e.png',
      in_stock: true
    },
    {
      id: '4',
      title: 'Наушники Bluetooth',
      price: 3990,
      image_url: '/lovable-uploads/5e17e20e-4457-4c61-be22-2d405cd6a88e.png',
      in_stock: true
    }
  ];
  
  container.innerHTML = placeholderProducts.map(product => `
    <div class="product-card">
      <a href="product.html?id=${product.id}">
        <img src="${product.image_url}" alt="${product.title}" loading="lazy" />
        <h3>${product.title}</h3>
        <div class="price">
          ${product.discount_price ? 
            `<span class="discount-price">${formatPrice(product.discount_price)}</span>
             <span class="original-price">${formatPrice(product.price)}</span>` :
            `<span class="price">${formatPrice(product.price)}</span>`
          }
        </div>
        <div class="stock-status in-stock">В наличии</div>
      </a>
      <button class="add-to-cart-btn" data-product-id="${product.id}">
        В корзину
      </button>
    </div>
  `).join('');
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
    console.log('Категории для каталога загружены:', categories);
    // Здесь можно добавить рендеринг категорий в сайдбар каталога
  } catch (error) {
    console.error('Ошибка загрузки категорий для каталога:', error);
  }
}
