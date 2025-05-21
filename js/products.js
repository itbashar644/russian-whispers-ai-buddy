
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
    initAddToCartButtons();
    initWishlistButtons();
    initWishlist();
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
    const productsContainer = document.querySelector('.catalog-products');
    if (!productsContainer) return;
    
    // Показываем состояние загрузки
    productsContainer.innerHTML = '<div class="loading">Загрузка товаров...</div>';
    
    // Формируем URL запроса
    let url = 'https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?select=*&archived=eq.false';
    
    // Добавляем фильтр по категории, если указана
    if (category) {
      url += `&category=eq.${encodeURIComponent(category)}`;
    }
    
    // Загружаем товары с Supabase
    const response = await fetch(url, {
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
    
    // Добавляем заголовок с категорией, если указана
    if (category) {
      const categoryTitle = document.createElement('h1');
      categoryTitle.className = 'category-title';
      categoryTitle.textContent = category;
      productsContainer.appendChild(categoryTitle);
    }
    
    // Создаем грид для товаров
    const productsGrid = document.createElement('div');
    productsGrid.className = 'products-grid';
    
    // Добавляем товары в грид
    products.forEach(product => {
      const productCard = createProductCard(product);
      productsGrid.appendChild(productCard);
    });
    
    productsContainer.appendChild(productsGrid);
    
    // Инициализируем кнопки после добавления карточек
    initAddToCartButtons();
    initWishlistButtons();
    initWishlist();
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    const productsContainer = document.querySelector('.catalog-products');
    if (productsContainer) {
      productsContainer.innerHTML = '<div class="error-message">Ошибка при загрузке товаров</div>';
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
  
  card.innerHTML = `
    <div class="product-image">
      <a href="product.html?id=${product.id}" class="product-link" data-id="${product.id}">
        <img src="${product.image_url}" alt="${product.title}" loading="lazy">
      </a>
      <button class="wishlist-button" aria-label="Добавить в избранное">
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
      <button class="add-to-cart-btn">В корзину</button>
    </div>
  `;
  
  return card;
}

// Функция для загрузки данных о товаре на странице товара
async function loadProductDetails() {
  try {
    // Получаем ID товара из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
      document.querySelector('.product-details-container').innerHTML = 
        '<div class="error-message">Товар не найден</div>';
      return;
    }
    
    // Показываем состояние загрузки
    document.querySelector('.product-details-container').innerHTML = 
      '<div class="loading">Загрузка информации о товаре...</div>';
    
    // Загружаем данные о товаре с Supabase
    const response = await fetch(`https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?id=eq.${productId}&select=*`, {
      headers: CONFIG.apiHeaders
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить информацию о товаре');
    }
    
    const products = await response.json();
    
    if (products.length === 0) {
      document.querySelector('.product-details-container').innerHTML = 
        '<div class="error-message">Товар не найден</div>';
      return;
    }
    
    const product = products[0];
    
    // Обновляем заголовок страницы
    document.title = `${product.title} | The X Shop`;
    
    // Формируем HTML для страницы товара
    const productHTML = `
      <div class="product-details">
        <div class="product-gallery">
          <div class="main-image">
            <img src="${product.image_url}" alt="${product.title}">
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
              ? `<span class="old-price">${product.price} ₽</span><span class="current-price">${product.discount_price} ₽</span>` 
              : `<span class="current-price">${product.price} ₽</span>`}
          </div>
          <div class="product-meta">
            <div class="product-rating">
              <span class="stars">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 > 0 ? '☆' : ''}</span>
              <span class="rating-value">${product.rating}</span>
            </div>
            <div class="product-availability">
              <span class="${product.in_stock ? 'in-stock' : 'out-of-stock'}">${product.in_stock ? 'В наличии' : 'Нет в наличии'}</span>
            </div>
          </div>
          <div class="product-description">
            <p>${product.description}</p>
          </div>
          <div class="product-actions">
            <button class="btn add-to-cart-btn-large">В корзину</button>
            <button class="btn wishlist-btn-large">
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
    document.querySelector('.product-details-container').innerHTML = productHTML;
    
    // Инициализируем табы
    initProductTabs();
    
    // Инициализируем галерею
    initProductGallery();
    
    // Инициализируем кнопки
    initProductButtons(product);
  } catch (error) {
    console.error('Ошибка при загрузке информации о товаре:', error);
    document.querySelector('.product-details-container').innerHTML = 
      '<div class="error-message">Ошибка при загрузке информации о товаре</div>';
  }
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
      addToCart({
        id: product.id,
        title: product.title,
        price: product.discount_price || product.price,
        image: product.image_url,
        quantity: 1
      });
      
      showNotification(`"${product.title}" добавлен в корзину`);
    });
  }
  
  // Кнопка "В избранное"
  const wishlistBtn = document.querySelector('.wishlist-btn-large');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', function() {
      toggleWishlist(product.id, product.title);
    });
  }
}
