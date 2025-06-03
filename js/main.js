
/**
 * Главный файл инициализации приложения - упрощенная версия
 */

// Глобальная переменная для отслеживания инициализации
let isMainInitialized = false;

// Основная инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log('Main.js: DOM загружен, запускаем инициализацию...');
  
  // Предотвращаем повторную инициализацию
  if (isMainInitialized) {
    console.log('Main.js: Приложение уже инициализировано');
    return;
  }
  
  isMainInitialized = true;
  
  // Инициализируем базовые функции сразу, без модулей
  initializeBaseFunctions();
});

function initializeBaseFunctions() {
  console.log('Инициализируем базовые функции...');
  
  // Инициализируем корзину
  if (typeof initCart === 'function') {
    initCart();
    console.log('Корзина инициализирована');
  }
  
  // Инициализируем избранное
  if (typeof initWishlist === 'function') {
    initWishlist();
    console.log('Избранное инициализировано');
  }
  
  // Инициализируем поиск
  if (typeof initSearch === 'function') {
    initSearch();
    console.log('Поиск инициализирован');
  }
  
  // Инициализируем чат
  if (typeof initChat === 'function') {
    initChat();
    console.log('Чат инициализирован');
  }
  
  // Инициализируем страницу
  initCurrentPage();
  
  // Инициализируем кнопки
  setTimeout(() => {
    initializeButtons();
  }, 200);
}

function initCurrentPage() {
  const path = window.location.pathname;
  console.log('Инициализируем текущую страницу:', path);
  
  if (path === '/' || path === '/index.html' || path.endsWith('index.html')) {
    // Загружаем товары для главной страницы
    loadHomePageProducts();
  } else if (path === '/catalog.html' || path.endsWith('catalog.html')) {
    // Загружаем товары для каталога
    if (typeof loadCatalogProducts === 'function') {
      loadCatalogProducts();
    }
    if (typeof loadCatalogCategories === 'function') {
      loadCatalogCategories();
    }
  }
}

// Новая упрощенная функция загрузки товаров для главной страницы
async function loadHomePageProducts() {
  try {
    console.log('Загружаем товары для главной страницы...');
    
    // Загружаем категории
    await loadHomePageCategories();
    
    // Загружаем товары из Supabase
    const response = await fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?select=*&archived=eq.false&in_stock=eq.true&order=created_at.desc', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить товары');
    }
    
    const allProducts = await response.json();
    console.log('Товары загружены:', allProducts.length);
    
    if (!allProducts || allProducts.length === 0) {
      console.log('Товары не найдены');
      return;
    }
    
    // Фильтруем бестселлеры и новинки
    const bestsellers = allProducts.filter(product => product.is_bestseller).slice(0, 8);
    const newProducts = allProducts.filter(product => product.is_new).slice(0, 8);
    const popularProducts = allProducts.slice(0, 8);
    
    console.log('Бестселлеры:', bestsellers.length);
    console.log('Новинки:', newProducts.length);
    
    // Рендерим секции товаров
    renderProductSection('bestsellersGrid', bestsellers);
    renderProductSection('newProductsGrid', newProducts);
    renderProductSection('productsGrid', popularProducts);
    
    // Инициализируем кнопки после рендеринга
    setTimeout(() => {
      initializeButtons();
    }, 100);
    
  } catch (error) {
    console.error('Ошибка при загрузке товаров для главной:', error);
  }
}

// Загрузка категорий для главной страницы
async function loadHomePageCategories() {
  try {
    const categoriesContainer = document.getElementById('categoriesGrid');
    if (!categoriesContainer) return;
    
    categoriesContainer.innerHTML = '<div class="loading">Загружаем категории...</div>';
    
    const response = await fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/categories?select=*&order=name.asc', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить категории');
    }
    
    const categories = await response.json();
    console.log('Категории загружены:', categories.length);
    
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
function renderProductSection(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Контейнер ${containerId} не найден`);
    return;
  }
  
  if (!products || products.length === 0) {
    container.innerHTML = '<div class="empty-message">Товары не найдены</div>';
    return;
  }
  
  container.innerHTML = '';
  
  products.forEach(product => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
  
  console.log(`Секция ${containerId} отрендерена с ${products.length} товарами`);
}

// Функция создания карточки товара
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const formatPrice = (price) => {
    if (!price) return '0 ₽';
    return parseFloat(price).toLocaleString('ru-RU') + ' ₽';
  };

  const priceDisplay = product.discount_price
    ? `<span class="old-price">${formatPrice(product.price)}</span><span class="current-price with-background">${formatPrice(product.discount_price)}</span>`
    : `<span class="current-price with-background">${formatPrice(product.price)}</span>`;

  const displayTitle = product.title.length > 50
    ? `${product.title.slice(0, 50)}…`
    : product.title;

  // Создаем блок маркетплейсов
  let marketplaceLinks = '';
  if (product.ozon_url || product.wildberries_url || product.avito_url) {
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
    
    marketplaceLinks = `
      <div class="marketplace-links">
        <span class="marketplace-title">Доступен на:</span>
        <div class="marketplace-icons">
          ${marketplaceIconsHtml}
        </div>
      </div>
    `;
  }

  card.innerHTML = `
    <div class="product-image">
      <a href="product.html?id=${product.id}" class="product-link" data-id="${product.id}">
        <img src="${product.image_url}" alt="${product.title}" loading="lazy">
      </a>
      <button class="wishlist-button" aria-label="Добавить в избранное" data-id="${product.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
      </button>
    </div>
    <div class="product-info">
      <h3>
        <a href="product.html?id=${product.id}" class="product-link" data-id="${product.id}">${displayTitle}</a>
      </h3>
      ${marketplaceLinks}
      <div class="product-price">
        <button class="price-cart-btn" data-id="${product.id}" aria-label="Добавить в корзину">
          ${priceDisplay}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </button>
      </div>
      <button class="add-to-cart-btn" data-id="${product.id}">В корзину</button>
    </div>
  `;
  
  return card;
}

function initializeButtons() {
  console.log('Инициализируем кнопки...');
  
  if (typeof initAddToCartButtons === 'function') {
    initAddToCartButtons();
    console.log('Кнопки корзины инициализированы');
  }
  
  if (typeof initWishlistButtons === 'function') {
    initWishlistButtons();
    console.log('Кнопки избранного инициализированы');
  }
  
  if (typeof updateWishlistButtons === 'function') {
    updateWishlistButtons();
    console.log('Состояние кнопок избранного обновлено');
  }
  
  if (typeof updateCartCounter === 'function') {
    updateCartCounter();
    console.log('Счетчик корзины обновлен');
  }
}

// Глобальная функция для переинициализации (для использования из других скриптов)
window.reinitializeApp = function() {
  console.log('Переинициализация приложения...');
  setTimeout(() => {
    initializeButtons();
  }, 100);
};

// Делаем функции глобально доступными
window.loadHomePageProducts = loadHomePageProducts;
window.createProductCard = createProductCard;
