
/**
 * Функционал для работы с товарами
 */

// Функция для загрузки выделенных товаров с Supabase
async function loadFeaturedProducts() {
  try {
    const productsContainer = document.querySelector('.featured-products');
    if (!productsContainer) return;
    
    // Показываем состояние загрузки
    productsContainer.innerHTML = '<div class="loading">Загрузка товаров...</div>';
    
    // Загружаем товары с Supabase
    const response = await fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?select=*&archived=eq.false&order=created_at.desc&limit=8', {
      headers: CONFIG.apiHeaders
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить товары');
    }
    
    const products = await response.json();
    
    if (products.length === 0) {
      productsContainer.innerHTML = '<div class="empty-message">Товары не найдены</div>';
      return;
    }
    
    // Очищаем контейнер
    productsContainer.innerHTML = '';
    
    // Добавляем товары в контейнер
    products.forEach(product => {
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
    });
    
    // Инициализируем кнопки после добавления карточек
    if (typeof initAddToCartButtons === 'function') {
      initAddToCartButtons();
    }
    if (typeof initWishlistButtons === 'function') {
      initWishlistButtons();
    }
    if (typeof initWishlist === 'function') {
      initWishlist();
    }
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    const productsContainer = document.querySelector('.featured-products');
    if (productsContainer) {
      productsContainer.innerHTML = '<div class="error-message">Ошибка при загрузке товаров</div>';
    }
  }
}

// Функция для загрузки товаров для каталога
async function loadCatalogProducts(category = null) {
  try {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) {
      console.warn('Контейнер products-container не найден');
      return;
    }
    
    // Показываем состояние загрузки
    productsContainer.innerHTML = '<div class="loading">Загрузка товаров...</div>';
    
    // Формируем параметры фильтрации
    const urlParams = new URLSearchParams(window.location.search);
    const minPrice = urlParams.get('min_price');
    const maxPrice = urlParams.get('max_price');
    const searchQuery = urlParams.get('search');
    const sortParam = urlParams.get('sort');
    
    // Строим URL для запроса
    let apiUrl = 'https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?select=*&archived=eq.false&in_stock=eq.true';
    
    if (category) {
      apiUrl += `&category=eq.${encodeURIComponent(category)}`;
    }
    
    if (searchQuery) {
      apiUrl += `&title=ilike.%${encodeURIComponent(searchQuery)}%`;
    }
    
    // Добавляем сортировку по умолчанию
    apiUrl += '&order=created_at.desc';
    
    console.log('Загружаем товары с URL:', apiUrl);
    
    // Загружаем товары с таймаутом
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(apiUrl, {
      headers: CONFIG.apiHeaders,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let products = await response.json();
    console.log('Товары загружены:', products.length);
    
    // Применяем фильтры на стороне клиента
    if (minPrice) {
      products = products.filter(product => {
        const price = product.discount_price || product.price;
        return price >= parseFloat(minPrice);
      });
    }
    
    if (maxPrice) {
      products = products.filter(product => {
        const price = product.discount_price || product.price;
        return price <= parseFloat(maxPrice);
      });
    }
    
    // Применяем сортировку
    if (sortParam) {
      switch (sortParam) {
        case 'price-asc':
          products.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
          break;
        case 'price-desc':
          products.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
          break;
        case 'new':
          products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        default:
          products.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
      }
    }
    
    if (products.length === 0) {
      productsContainer.innerHTML = '<div class="empty-message">Товары не найдены</div>';
      return;
    }
    
    // Очищаем контейнер
    productsContainer.innerHTML = '';
    
    // Добавляем товары в контейнер
    products.forEach(product => {
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
    });
    
    // Инициализируем кнопки после добавления карточек
    if (typeof initAddToCartButtons === 'function') {
      initAddToCartButtons();
    }
    if (typeof initWishlistButtons === 'function') {
      initWishlistButtons();
    }
    if (typeof initWishlist === 'function') {
      initWishlist();
    }
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
      productsContainer.innerHTML = '<div class="error-message">Ошибка при загрузке товаров: ' + error.message + '</div>';
    }
  }
}

// Функция для создания карточки товара
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const priceDisplay = product.discount_price
    ? `<span class="old-price">${formatPrice(product.price)}</span><span class="current-price with-background">${formatPrice(product.discount_price)}</span>`
    : `<span class="current-price with-background">${formatPrice(product.price)}</span>`;
  
  // Подготовка блока маркетплейсов
  const marketplaceLinks = createMarketplaceLinksHtml(product);

  // Обрезаем название до 50 символов для консистентного отображения
  const displayTitle = product.title.length > 50
    ? `${product.title.slice(0, 50)}…`
    : product.title;

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

// Функция для создания HTML-блока с маркетплейсами
function createMarketplaceLinksHtml(product) {
  // Проверяем, есть ли у товара хотя бы одна ссылка на маркетплейс
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

// Функция для загрузки данных о товаре на странице товара
async function loadProductDetails() {
  try {
    // Получаем ID товара из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
      const container = document.querySelector('.product-details-container');
      if (container) {
        container.innerHTML = '<div class="error-message">Товар не найден</div>';
      }
      return;
    }
    
    // Показываем состояние загрузки
    const container = document.querySelector('.product-details-container');
    if (container) {
      container.innerHTML = '<div class="loading">Загрузка информации о товаре...</div>';
    }
    
    // Загружаем данные о товаре напрямую через REST API Supabase
    const response = await fetch(
      `${CONFIG.supabaseUrl}/rest/v1/products?id=eq.${productId}&select=*`,
      { headers: CONFIG.apiHeaders }
    );

    if (!response.ok) {
      console.error('Ошибка HTTP при загрузке товара:', response.status);
      throw new Error('Не удалось загрузить данные о товаре');
    }

    const products = await response.json();
    
    if (!products || products.length === 0) {
      if (container) {
        container.innerHTML = '<div class="error-message">Товар не найден</div>';
      }
      return;
    }

    const product = products[0];
    console.log('Товар загружен:', product);

    // Обновляем breadcrumbs
    const breadcrumbCategory = document.getElementById('breadcrumb-category');
    const breadcrumbProduct = document.getElementById('breadcrumb-product');
    
    if (breadcrumbCategory) breadcrumbCategory.textContent = product.category || 'Категория';
    if (breadcrumbProduct) breadcrumbProduct.textContent = product.title;

    // Обновляем title страницы
    document.title = `${product.title} | The X Shop`;

    // Создаем HTML для страницы товара
    const productHTML = createProductDetailsHTML(product);
    
    if (container) {
      container.innerHTML = productHTML;
    }

    // Инициализируем функциональность после рендеринга
    initProductPage(product);
    
  } catch (error) {
    console.error('Ошибка при загрузке товара:', error);
    const container = document.querySelector('.product-details-container');
    if (container) {
      container.innerHTML = '<div class="error-message">Ошибка при загрузке товара: ' + error.message + '</div>';
    }
  }
}

// Функция для создания HTML страницы товара
function createProductDetailsHTML(product) {
  const priceDisplay = product.discount_price
    ? `<span class="old-price">${formatPrice(product.price)}</span><span class="current-price with-background">${formatPrice(product.discount_price)}</span>`
    : `<span class="current-price with-background">${formatPrice(product.price)}</span>`;

  const marketplaceLinks = createMarketplaceLinksHtml(product);

  return `
    <div class="product-details">
      <div class="product-gallery">
        <div class="main-image">
          <img src="${product.image_url}" alt="${product.title}" id="main-product-image">
        </div>
      </div>
        ${product.additional_images && product.additional_images.length > 0 ? `
          <div class="additional-images">
            ${product.additional_images.map(img => `
              <div class="thumbnail">
                <img src="${img}" alt="${product.title}">
              </div>
            `).join('')}
          </div>
        ` : ''}
      
      <div class="product-info-detail">
        <h1 class="product-title">${product.title}</h1>
        
        <div class="product-rating">
          <div class="stars">
            ${'★'.repeat(Math.floor(product.rating || 4.8))}${'☆'.repeat(5 - Math.floor(product.rating || 4.8))}
          </div>
          <span class="rating-value">${product.rating || 4.8}</span>
        </div>
        
        <div class="product-price-detail">
          <button class="price-cart-btn" data-id="${product.id}" aria-label="Добавить в корзину">
            ${priceDisplay}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          </button>
        </div>
        
        <div class="product-description">
          <p>${product.description}</p>
        </div>
        
        ${marketplaceLinks}
        
        <div class="product-actions">
          <button class="add-to-cart-btn btn primary-btn" data-id="${product.id}">
            Добавить в корзину
          </button>
          <button class="wishlist-button btn secondary-btn" data-id="${product.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
            В избранное
          </button>
        </div>
      </div>
    </div>
  `;
}

// Функция для инициализации страницы товара
function initProductPage(product) {
  // Инициализируем кнопки корзины и избранного
  if (typeof initAddToCartButtons === 'function') {
    initAddToCartButtons();
  }

  if (typeof initProductGallery === 'function') {
    initProductGallery();
  }

  if (typeof initWishlistButtons === 'function') {
    initWishlistButtons();
  }
  
  // Загружаем похожие товары
  loadRelatedProducts(product.category, product.id);
}

// Функция для загрузки похожих товаров
async function loadRelatedProducts(category, currentProductId) {
  try {
    const relatedContainer = document.getElementById('related-products');
    if (!relatedContainer) return;
    
    relatedContainer.innerHTML = '<div class="loading">Загрузка похожих товаров...</div>';
    
    const response = await fetch(
      `${CONFIG.supabaseUrl}/rest/v1/products?category=eq.${encodeURIComponent(category)}&archived=eq.false&in_stock=eq.true&id=neq.${currentProductId}&limit=4`,
      { headers: CONFIG.apiHeaders }
    );
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить похожие товары');
    }
    
    const products = await response.json();
    
    if (products.length === 0) {
      relatedContainer.innerHTML = '<div class="empty-message">Похожие товары не найдены</div>';
      return;
    }
    
    relatedContainer.innerHTML = '';
    
    products.forEach(product => {
      const productCard = createProductCard(product);
      relatedContainer.appendChild(productCard);
    });
    
    // Инициализируем кнопки для похожих товаров
    if (typeof initAddToCartButtons === 'function') {
      initAddToCartButtons();
    }
    if (typeof initWishlistButtons === 'function') {
      initWishlistButtons();
    }
    
  } catch (error) {
    console.error('Ошибка при загрузке похожих товаров:', error);
    const relatedContainer = document.getElementById('related-products');
    if (relatedContainer) {
      relatedContainer.innerHTML = '<div class="error-message">Ошибка при загрузке похожих товаров</div>';
    }
  }
}
