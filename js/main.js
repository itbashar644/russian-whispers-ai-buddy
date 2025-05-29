
import { loadCategories, loadProducts } from './supabase.js';

/**
 * Основной скрипт приложения
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM загружен, инициализация приложения...');
  
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
  const path = window.location.pathname.toLowerCase();
  if (path === '/' || path.endsWith('/index.html') || path === '/index.html') {
    console.log('Загружаем данные для главной страницы...');
    loadHomePageData();
  }
  
  // Загрузка товаров в каталоге
  if (path.endsWith('/catalog') || path.endsWith('/catalog.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // Загружаем категории для сайдбара каталога
    loadCategoriesForCatalog();
    
    // Загружаем товары для каталога
    loadCatalogProducts(categoryParam);
  }
  
  // Если мы на странице товара, загружаем детали товара
  if (path.endsWith('/product') || path.endsWith('/product.html')) {
    console.log('Загружаем страницу товара...');
    loadProductDetails();
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
  if (path.endsWith('/cart') || path.endsWith('/cart.html')) {
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
    
    // Загружаем все товары
    const allProducts = await loadProducts({ limit: 50 });
    console.log('Товары загружены:', allProducts);
    
    if (allProducts && allProducts.length > 0) {
      // Разделяем товары правильно
      const bestsellers = allProducts.filter(product => product.is_bestseller === true);
      const newProducts = allProducts.filter(product => product.is_new === true);
      
      console.log('Бестселлеры найдены:', bestsellers.length);
      console.log('Новинки найдены:', newProducts.length);
      
      // Если нет специальных товаров, берем первые 8 как популярные
      const popularProducts = allProducts.slice(0, 8);
      
      renderProductSections(bestsellers, newProducts, popularProducts);
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
  
  console.log('Рендерим категории в контейнер:', container);
  
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
  if (!container) {
    console.warn('Контейнер categoriesGrid не найден для плейсхолдера');
    return;
  }
  
  console.log('Рендерим плейсхолдер категорий');
  
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

// Рендеринг секций товаров на главной странице
function renderProductSections(bestsellers, newProducts, popularProducts) {
  console.log('Рендерим секции товаров...');
  
  // Рендерим бестселлеры
  const bestsellersContainer = document.getElementById('bestsellersGrid');
  if (bestsellersContainer) {
    console.log('Рендерим бестселлеры:', bestsellers.length);
    if (bestsellers.length > 0) {
      bestsellersContainer.innerHTML = bestsellers.slice(0, 4).map(product => createProductHTML(product)).join('');
      addProductEventListeners(bestsellersContainer);
    } else {
      bestsellersContainer.innerHTML = '<div class="no-products">Бестселлеры скоро появятся</div>';
    }
  } else {
    console.warn('Контейнер bestsellersGrid не найден');
  }
  
  // Рендерим новинки
  const newProductsContainer = document.getElementById('newProductsGrid');
  if (newProductsContainer) {
    console.log('Рендерим новинки:', newProducts.length);
    if (newProducts.length > 0) {
      newProductsContainer.innerHTML = newProducts.slice(0, 4).map(product => createProductHTML(product)).join('');
      addProductEventListeners(newProductsContainer);
    } else {
      newProductsContainer.innerHTML = '<div class="no-products">Новинки скоро появятся</div>';
    }
  } else {
    console.warn('Контейнер newProductsGrid не найден');
  }
  
  // Рендерим популярные товары
  const productsContainer = document.getElementById('productsGrid');
  if (productsContainer) {
    console.log('Рендерим популярные товары:', popularProducts.length);
    productsContainer.innerHTML = popularProducts.slice(0, 8).map(product => createProductHTML(product)).join('');
    addProductEventListeners(productsContainer);
  } else {
    console.warn('Контейнер productsGrid не найден');
  }
}

// Создание HTML для товара
function createProductHTML(product) {
    const priceHtml = product.discount_price
    ? `<span class="old-price">${formatPrice(product.price)}</span><span class="current-price">${formatPrice(product.discount_price)}</span>`
    : `<span class="current-price">${formatPrice(product.price)}</span>`;

  const categoryLink = product.category
    ? `<a href="catalog.html?category=${encodeURIComponent(product.category)}" class="product-category">${product.category}</a>`
    : '';

  const marketplaceLinks = createMarketplaceLinksHtml(product);

    // Текст для отображения ограничиваем 50 символами
  const displayTitle = product.title.length > 50
    ? `${product.title.slice(0, 50)}…`
    : product.title;

  return `
    <div class="product-card">
      <div class="product-image">
        <a href="product.html?id=${product.id}" class="product-link" data-id="${product.id}">
          <img src="${product.image_url || '/lovable-uploads/5e17e20e-4457-4c61-be22-2d405cd6a88e.png'}" alt="${product.title}" loading="lazy" />
        </a>
      </div>
      <div class="product-info">
        <h3><a href="product.html?id=${product.id}" class="product-link" data-id="${product.id}">${displayTitle}</a></h3>
        ${categoryLink}
        <div class="product-price">
          ${priceHtml}
        </div>
        <div class="stock-status ${product.in_stock ? 'in-stock' : 'out-of-stock'}">
          ${product.in_stock ? 'В наличии' : 'Нет в наличии'}
        </div>
        ${marketplaceLinks}
        <button class="add-to-cart-btn" data-product-id="${product.id}">В корзину</button>
      </div>
    </div>`;
}

function createMarketplaceLinksHtml(product) {
  if (!product.ozon_url && !product.wildberries_url && !product.avito_url) {
    return '';
  }

  let marketplaceIconsHtml = '';

    if (product.wildberries_url) {
    marketplaceIconsHtml += `
      <a href="${product.wildberries_url}" target="_blank" rel="noopener noreferrer" class="marketplace-icon wildberries-icon" title="Открыть на Wildberries">
        <img src="/lovable-uploads/e338f2d1-bca5-46f1-b305-fdc8cff079f6.png" alt="Wildberries">
      </a>
    `;
  }

  if (product.ozon_url) {
    marketplaceIconsHtml += `
      <a href="${product.ozon_url}" target="_blank" rel="noopener noreferrer" class="marketplace-icon ozon-icon" title="Открыть на Ozon">
        <img src="/lovable-uploads/cdd6cfcc-2939-4048-ad14-0718ccb5108b.png" alt="Ozon">
      </a>
    `;
  }

  if (product.avito_url) {
    marketplaceIconsHtml += `
      <a href="${product.avito_url}" target="_blank" rel="noopener noreferrer" class="marketplace-icon avito-icon" title="Открыть на Авито">
        <img src="/lovable-uploads/c9a01e33-cfba-4882-bd76-bf5242276fda.png" alt="Авито">
      </a>
    `;
  }

  return `
    <div class="marketplace-links">
      <span class="marketplace-title">Доступно на:</span>
      <div class="marketplace-icons">
        ${marketplaceIconsHtml}
      </div>
    </div>`;
}

// Добавление обработчиков событий для товаров
function addProductEventListeners(container) {
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      if (typeof addToCart === 'function') {
        addToCart(productId);
      }
    });
  });
}

// Рендеринг товаров (старая функция для обратной совместимости)
function renderProducts(products) {
  renderProductSections([], [], products);
}

// Плейсхолдер для товаров если данные не загрузились
function renderProductsPlaceholder() {
  console.log('Рендерим плейсхолдер товаров...');
  
  const bestsellersContainer = document.getElementById('bestsellersGrid');
  const newProductsContainer = document.getElementById('newProductsGrid');
  const productsContainer = document.getElementById('productsGrid');
  
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
  
  if (bestsellersContainer) {
    bestsellersContainer.innerHTML = placeholderProducts.slice(0, 2).map(product => createProductHTML(product)).join('');
  }
  
  if (newProductsContainer) {
    newProductsContainer.innerHTML = placeholderProducts.slice(0, 2).map(product => createProductHTML(product)).join('');
  }
  
  if (productsContainer) {
    productsContainer.innerHTML = placeholderProducts.map(product => createProductHTML(product)).join('');
  }
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
    renderCatalogCategories(categories);
  } catch (error) {
    console.error('Ошибка загрузки категорий для каталога:', error);
  }
}

// Рендеринг категорий в каталоге
function renderCatalogCategories(categories) {
  const container = document.getElementById('categories-list');
  if (!container || !categories) return;
  
  container.innerHTML = categories.map(category => `
    <a href="catalog.html?category=${encodeURIComponent(category.name)}" class="category-link">
      ${category.name}
    </a>
  `).join('');
}
