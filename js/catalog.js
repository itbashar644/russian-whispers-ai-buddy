/**
 * Функционал для работы с каталогом товаров
 */

// Конфигурация для Supabase
const CATALOG_CONFIG = {
  supabaseUrl: 'https://lpwvhyawvxibtuxfhitx.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI',
  get apiHeaders() {
    return {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json'
    };
  }
};

// Fallback helpers if utils.js failed to load
if (typeof parsePrice !== 'function') {
  function parsePrice(value) {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    const numeric = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
    return isNaN(numeric) ? 0 : numeric;
  }
  window.parsePrice = parsePrice;
}

if (typeof formatPrice !== 'function') {
  function formatPrice(price) {
    const value = parsePrice(price);
    return value.toLocaleString('ru-RU') + ' ₽';
  }
  window.formatPrice = formatPrice;
}

// Функция создания карточки товара
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
      <span class="marketplace-title">Доступен на:</span>
      <div class="marketplace-icons">
        ${marketplaceIconsHtml}
      </div>
    </div>
  `;
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const priceDisplay = product.discount_price
    ? `<span class="old-price">${formatPrice(product.price)}</span><span class="current-price with-background">${formatPrice(product.discount_price)}</span>`
    : `<span class="current-price with-background">${formatPrice(product.price)}</span>`;

  const displayTitle = product.title.length > 50
    ? `${product.title.slice(0, 50)}…`
    : product.title;
  const marketplaceLinks = createMarketplaceLinksHtml(product);

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
        <div class="product-price">
          <button class="price-cart-btn" data-id="${product.id}" aria-label="Добавить в корзину">
            ${priceDisplay}
         </button>
        </div>
        ${marketplaceLinks}
        <button class="add-to-cart-btn" data-id="${product.id}">В корзину</button>
        </div>
    `;
  
  return card;
}

// Загрузка товаров для каталога
async function loadCatalogProducts() {
  try {
    console.log('Начинаем загрузку товаров для каталога...');
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) {
      console.log('Контейнер товаров не найден');
      return;
    }
    
    productsContainer.innerHTML = '<div class="loading">Загрузка товаров...</div>';
    
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const searchQuery = urlParams.get('search');
    
    console.log('Параметры поиска:', { category, searchQuery });
    
    // Строим URL для запроса
    let apiUrl = `${CATALOG_CONFIG.supabaseUrl}/rest/v1/products?select=*&archived=eq.false&in_stock=eq.true`;
    
    if (category) {
      apiUrl += `&category=eq.${encodeURIComponent(category)}`;
    }
    
    if (searchQuery) {
      apiUrl += `&title=ilike.%${encodeURIComponent(searchQuery)}%`;
    }
    
    apiUrl += '&order=created_at.desc';
    
    console.log('URL запроса товаров:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: CATALOG_CONFIG.apiHeaders
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const products = await response.json();
    console.log('Товары загружены:', products.length);
    
    if (products.length === 0) {
      productsContainer.innerHTML = '<div class="empty-message">Товары не найдены</div>';
      return;
    }
    
    productsContainer.innerHTML = '';
    products.forEach(product => {
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
    });
    
    // Инициализируем обработчики для кнопок после рендеринга
    setTimeout(() => {
      if (typeof initAddToCartButtons === 'function') {
        initAddToCartButtons();
      }
      if (typeof initWishlistButtons === 'function') {
        initWishlistButtons();
      }
      console.log('Обработчики событий инициализированы для каталога');
    }, 100);
    
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
      productsContainer.innerHTML = '<div class="error-message">Ошибка при загрузке товаров: ' + error.message + '</div>';
    }
  }
}

// Загрузка категорий
async function loadCatalogCategories() {
  try {
    console.log('Начинаем загрузку категорий для каталога...');
    const categoriesContainer = document.getElementById('categories-list');
    if (!categoriesContainer) {
      console.log('Контейнер категорий не найден');
      return;
    }
    
    const response = await fetch(`${CATALOG_CONFIG.supabaseUrl}/rest/v1/categories?select=*&order=name.asc`, {
      headers: CATALOG_CONFIG.apiHeaders
    });
    
    if (!response.ok) {
      throw new Error('Ошибка загрузки категорий');
    }
    
    const categories = await response.json();
    console.log('Категории загружены:', categories.length);
    
    categoriesContainer.innerHTML = '';
    
    // Добавляем ссылку "Все категории"
    const allCategoriesLink = document.createElement('a');
    allCategoriesLink.href = 'catalog.html';
    allCategoriesLink.className = 'category-item';
    allCategoriesLink.textContent = 'Все категории';
    categoriesContainer.appendChild(allCategoriesLink);
    
    categories.forEach(category => {
      const categoryItem = document.createElement('a');
      categoryItem.href = `catalog.html?category=${encodeURIComponent(category.name)}`;
      categoryItem.className = 'category-item';
      categoryItem.textContent = category.name;
      categoriesContainer.appendChild(categoryItem);
    });
    
    // Выделяем активную категорию
    const urlParams = new URLSearchParams(window.location.search);
    const activeCategory = urlParams.get('category');
    
    if (activeCategory) {
      const activeLink = categoriesContainer.querySelector(`a[href="catalog.html?category=${encodeURIComponent(activeCategory)}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    } else {
      allCategoriesLink.classList.add('active');
    }
    
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
    const categoriesContainer = document.getElementById('categories-list');
    if (categoriesContainer) {
      categoriesContainer.innerHTML = '<div class="error-message">Ошибка загрузки категорий</div>';
    }
  }
}

// Инициализация каталога
function initCatalog() {
  console.log('Инициализируем каталог...');
  
  // Проверяем, что мы на странице каталога
  if (!window.location.pathname.includes('catalog.html')) {
    console.log('Не на странице каталога, пропускаем инициализацию');
    return;
  }
  
  loadCatalogCategories();
  loadCatalogProducts();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM загружен, проверяем необходимость инициализации каталога...');
  initCatalog();
});

// Экспортируем функции для использования в других файлах
window.loadCatalogProducts = loadCatalogProducts;
window.loadCatalogCategories = loadCatalogCategories;
