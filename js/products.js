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
    
    // Импортируем функцию загрузки из supabase.js
    const { loadProducts } = await import('./supabase.js');
    
    // Формируем параметры фильтрации
    const urlParams = new URLSearchParams(window.location.search);
    const minPrice = urlParams.get('min_price');
    const maxPrice = urlParams.get('max_price');
    const searchQuery = urlParams.get('search');
    const sortParam = urlParams.get('sort');
    
    const filters = {};
    
    if (category) {
      filters.category = category;
    }
    
    // Загружаем товары
    let products = await loadProducts(filters);
    console.log('Товары загружены для каталога:', products);
    
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
    
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      products = products.filter(product => 
        product.title.toLowerCase().includes(searchLower) || 
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
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
    ? `<span class="old-price">${product.price} ₽</span><span class="current-price">${product.discount_price} ₽</span>` 
    : `<span class="current-price">${product.price} ₽</span>`;
  
  // Подготовка блока маркетплейсов
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
        <a href="product.html?id=${product.id}" class="product-link" data-id="${product.id}">${product.title}</a>
      </h3>
      <div class="product-price">
        ${priceDisplay}
      </div>
      ${marketplaceLinks}
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
      if (container) {
        container.innerHTML = '<div class="error-message">Товар не найден</div>';
      }
      return;
    }

    const products = await response.json();
    const product = products[0];

    if (!product) {
      console.error('Товар не найден');
      if (container) {
        container.innerHTML = '<div class="error-message">Товар не найден</div>';
      }
      return;
    }
    
    // Обновляем заголовок страницы
    document.title = `${product.title} | The X Shop`;
    
    // Обновляем breadcrumbs
    const breadcrumbCategory = document.getElementById('breadcrumb-category');
    const breadcrumbProduct = document.getElementById('breadcrumb-product');
    if (breadcrumbCategory) breadcrumbCategory.textContent = product.category || 'Категория';
    if (breadcrumbProduct) breadcrumbProduct.textContent = product.title;
    
    // Подготовка блока маркетплейсов
    const marketplaceLinks = createMarketplaceLinksHtml(product);
    
    // Формируем HTML для страницы товара
    const productHTML = `
      <div class="product-details">
        <div class="product-gallery">
          <div class="main-image">
            <img src="${product.image_url || '/lovable-uploads/5e17e20e-4457-4c61-be22-2d405cd6a88e.png'}" alt="${product.title}">
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
        </div>
        <div class="product-info">
          <h1>${product.title}</h1>
          <div class="product-price">
            ${product.discount_price 
              ? `<span class="old-price">${formatPrice(product.price)}</span><span class="current-price">${formatPrice(product.discount_price)}</span>` 
              : `<span class="current-price">${formatPrice(product.price)}</span>`}
          </div>
          <div class="product-meta">
            <div class="product-rating">
              <span class="stars">${'★'.repeat(Math.floor(product.rating || 4.8))}${(product.rating || 4.8) % 1 > 0 ? '☆' : ''}</span>
              <span class="rating-value">${product.rating || 4.8}</span>
            </div>
            <div class="product-availability">
              <span class="${product.in_stock ? 'in-stock' : 'out-of-stock'}">${product.in_stock ? 'В наличии' : 'Нет в наличии'}</span>
            </div>
          </div>
          <div class="product-description">
            <p>${product.description}</p>
          </div>
          ${marketplaceLinks}
          <div class="product-actions">
            <button class="btn add-to-cart-btn-large" data-id="${product.id}">В корзину</button>
            <button class="btn wishlist-btn-large" data-id="${product.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              В избранное
            </button>
          </div>
          <div class="product-details-tabs">
            <ul class="tabs-nav">
              <li class="active" data-tab="description">Описание</li>
              <li data-tab="specifications">Характеристики</li>
            </ul>
            <div class="tabs-content">
              <div class="tab-pane active" id="description">
                <p>${product.description}</p>
              </div>
              <div class="tab-pane" id="specifications">
                <ul class="specs-list">
                  ${product.specifications ? Object.entries(product.specifications).map(([key, value]) => `
                    <li><strong>${key}:</strong> ${value}</li>
                  `).join('') : '<li>Нет данных о характеристиках</li>'}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Обновляем контейнер
    if (container) {
      container.innerHTML = productHTML;
      
      // Инициализируем табы
      initProductTabs();
      
      // Инициализируем галерею
      initProductGallery();
      
      // Инициализируем кнопки
      initProductButtons(product);
      
      // Загружаем похожие товары
      loadRelatedProducts(product.category, product.id);
    }
  } catch (error) {
    console.error('Ошибка при загрузке информации о товаре:', error);
    const container = document.querySelector('.product-details-container');
    if (container) {
      container.innerHTML = '<div class="error-message">Ошибка при загрузке информации о товаре</div>';
    }
  }
}

// Функция для загрузки похожих товаров
async function loadRelatedProducts(category, currentProductId) {
  try {
    const relatedContainer = document.getElementById('related-products');
    if (!relatedContainer) return;
    
    relatedContainer.innerHTML = '<div class="loading">Загрузка похожих товаров...</div>';
    
    const { loadProducts } = await import('./supabase.js');
    const products = await loadProducts({ category });
    
    // Исключаем текущий товар и берем первые 4
    const relatedProducts = products.filter(p => p.id !== currentProductId).slice(0, 4);
    
    if (relatedProducts.length > 0) {
      relatedContainer.innerHTML = relatedProducts.map(product => createProductHTML(product)).join('');
      addProductEventListeners(relatedContainer);
    } else {
      relatedContainer.innerHTML = '<div class="empty-message">Похожие товары не найдены</div>';
    }
  } catch (error) {
    console.error('Ошибка загрузки похожих товаров:', error);
    const relatedContainer = document.getElementById('related-products');
    if (relatedContainer) {
      relatedContainer.innerHTML = '<div class="error-message">Ошибка загрузки похожих товаров</div>';
    }
  }
}

// Функция для форматирования цены
function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(price);
}

// Инициализация табов на странице товара
function initProductTabs() {
  document.querySelectorAll('.tabs-nav li').forEach(tab => {
    tab.addEventListener('click', function() {
      // Убираем активный класс у всех табов
      document.querySelectorAll('.tabs-nav li').forEach(t => t.classList.remove('active'));
      
      // Добавляем активный класс к текущему табу
      this.classList.add('active');
      
      // Скрываем все панели табов
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      
      // Показываем нужную панель
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// Инициализация галереи на странице товара
function initProductGallery() {
  const thumbnails = document.querySelectorAll('.thumbnail img');
  const mainImage = document.querySelector('.main-image img');
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function() {
      mainImage.src = this.src;
    });
  });
}

// Инициализация кнопок на странице товара
function initProductButtons(product) {
  // Кнопка "В корзину"
  const addToCartBtn = document.querySelector('.add-to-cart-btn-large');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      if (typeof addToCart === 'function') {
        addToCart({
          id: product.id,
          title: product.title,
          price: parsePrice(product.discount_price || product.price),
          image: product.image_url,
          quantity: 1
        });
        
        if (typeof showNotification === 'function') {
          showNotification(`"${product.title}" добавлен в корзину`);
        }
      }
    });
  }
  
  // Кнопка "В избранное"
  const wishlistBtn = document.querySelector('.wishlist-btn-large');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', function() {
      if (typeof toggleWishlist === 'function') {
        toggleWishlist(product.id, product.title);
      }
    });
  }
}

// Инициализация кнопок "В корзину" для всех карточек товаров
function initAddToCartButtons() {
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-id');
      const productTitle = this.closest('.product-card').querySelector('.product-link').textContent;
      const productPrice = this.closest('.product-card').querySelector('.current-price').textContent;
      const productImage = this.closest('.product-card').querySelector('img').src;
      
      if (typeof addToCart === 'function') {
        addToCart({
          id: productId,
          title: productTitle,
          price: parsePrice(productPrice),
          image: productImage,
          quantity: 1
        });
        
        if (typeof showNotification === 'function') {
          showNotification(`"${productTitle}" добавлен в корзину`);
        }
      }
    });
  });
}

// Инициализация кнопок "В избранное" для всех карточек товаров
function initWishlistButtons() {
  document.querySelectorAll('.wishlist-button').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-id');
      const productTitle = this.closest('.product-card').querySelector('.product-link').textContent;
      
      if (typeof toggleWishlist === 'function') {
        toggleWishlist(productId, productTitle);
      }
    });
  });
}

// Функция для преобразования строки цены в число
function parsePrice(priceString) {
  // Удаляем все символы, кроме цифр и десятичной точки
  const cleanedString = priceString.replace(/[^\d.]/g, '');
  
  // Заменяем запятую на точку, если она используется в качестве десятичного разделителя
  const normalizedString = cleanedString.replace(',', '.');
  
  // Преобразуем строку в число с плавающей точкой
  const price = parseFloat(normalizedString);
  
  return price;
}

// Функция для генерации slug из названия продукта
function generateSlug(title) {
  // Приводим строку к нижнему регистру
  let slug = title.toLowerCase();
  
  // Заменяем пробелы на дефисы
  slug = slug.replace(/\s+/g, '-');
  
  // Удаляем все символы, кроме букв, цифр и дефисов
  slug = slug.replace(/[^a-z0-9-]+/g, '');
  
  // Удаляем повторяющиеся дефисы
  slug = slug.replace(/--+/g, '-');
  
  // Обрезаем дефисы в начале и конце строки
  slug = slug.replace(/^-+|-+$/g, '');
  
  return slug;
}
