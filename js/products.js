
/**
 * Функционал для работы с товарами
 */

// Функция для загрузки популярных товаров на главной странице
async function loadFeaturedProducts() {
  const featuredProductsContainer = document.querySelector('.featured-products');
  if (!featuredProductsContainer) return;
  
  try {
    // Показываем состояние загрузки
    featuredProductsContainer.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p>Загружаем популярные товары...</p>
      </div>
    `;
    
    // Получаем товары из базы данных
    const products = await fetchProducts();
    
    // Если товаров нет, показываем сообщение
    if (!products || products.length === 0) {
      featuredProductsContainer.innerHTML = `
        <div class="no-products">
          <p>К сожалению, товаров пока нет</p>
        </div>
      `;
      return;
    }
    
    // Получаем популярные товары (возьмем первые 4 товара)
    const featuredProducts = products.slice(0, 4);
    
    // Формируем HTML для популярных товаров
    const productsHTML = featuredProducts.map(product => createProductCardHTML(product)).join('');
    
    // Обновляем контейнер
    featuredProductsContainer.innerHTML = productsHTML;
    
    // Инициализируем кнопки добавления в корзину
    initAddToCartButtons();
    
    // Инициализируем кнопки добавления в избранное
    if (typeof initWishlistButtons === 'function') {
      initWishlistButtons();
    }
  } catch (error) {
    console.error('Ошибка при загрузке популярных товаров:', error);
    
    // Показываем сообщение об ошибке
    featuredProductsContainer.innerHTML = `
      <div class="error-message">
        <p>Произошла ошибка при загрузке товаров. Пожалуйста, попробуйте позже.</p>
      </div>
    `;
  }
}

// Функция для загрузки товаров в каталоге
async function loadCatalogProducts(category = null) {
  const productsContainer = document.querySelector('.catalog-products');
  if (!productsContainer) return;
  
  const productCountElement = document.getElementById('product-count');
  const urlParams = new URLSearchParams(window.location.search);
  
  try {
    // Показываем состояние загрузки
    productsContainer.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p>Загружаем товары...</p>
      </div>
    `;
    
    // Получаем все товары из базы данных
    let products = await fetchProducts();
    
    // Фильтруем по категории, если она указана
    if (category) {
      products = products.filter(product => product.category === category);
    }
    
    // Применяем фильтры и сортировку из URL
    const filteredProducts = applyFiltersAndSort(products);
    
    // Если товаров нет, показываем сообщение
    if (!filteredProducts || filteredProducts.length === 0) {
      productsContainer.innerHTML = `
        <div class="no-products">
          <p>К сожалению, товары не найдены</p>
        </div>
      `;
      
      if (productCountElement) {
        productCountElement.textContent = '0 товаров';
      }
      
      return;
    }
    
    // Формируем HTML для товаров
    const productsHTML = filteredProducts.map(product => createProductCardHTML(product)).join('');
    
    // Обновляем контейнер
    productsContainer.innerHTML = productsHTML;
    
    // Обновляем счетчик товаров
    if (productCountElement) {
      productCountElement.textContent = `${filteredProducts.length} ${getPluralForm(filteredProducts.length, ['товар', 'товара', 'товаров'])}`;
    }
    
    // Инициализируем кнопки добавления в корзину
    initAddToCartButtons();
    
    // Инициализируем кнопки добавления в избранное
    if (typeof initWishlistButtons === 'function') {
      initWishlistButtons();
    }
  } catch (error) {
    console.error('Ошибка при загрузке товаров в каталоге:', error);
    
    // Показываем сообщение об ошибке
    productsContainer.innerHTML = `
      <div class="error-message">
        <p>Произошла ошибка при загрузке товаров. Пожалуйста, попробуйте позже.</p>
      </div>
    `;
    
    if (productCountElement) {
      productCountElement.textContent = '0 товаров';
    }
  }
}

// Функция для загрузки деталей товара на странице товара
async function loadProductDetails() {
  const productDetailsContainer = document.querySelector('.product-details');
  if (!productDetailsContainer) return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    // Если ID товара не указан, перенаправляем на каталог
    window.location.href = 'catalog.html';
    return;
  }
  
  try {
    // Показываем состояние загрузки
    productDetailsContainer.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p>Загружаем информацию о товаре...</p>
      </div>
    `;
    
    // Получаем все товары
    const products = await fetchProducts();
    
    // Находим товар по ID
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      // Если товар не найден, показываем сообщение
      productDetailsContainer.innerHTML = `
        <div class="error-message">
          <p>Товар не найден</p>
          <a href="catalog.html" class="btn primary-btn">Вернуться в каталог</a>
        </div>
      `;
      return;
    }
    
    // Обновляем заголовок страницы
    document.title = `${product.title} | The X Shop`;
    
    // Формируем HTML для деталей товара
    const productHTML = `
      <div class="product-details-content">
        <div class="product-images">
          <div class="product-main-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
          </div>
        </div>
        <div class="product-info">
          <h1 class="product-title">${product.title}</h1>
          <div class="product-price">${formatPrice(product.price)}</div>
          <div class="product-availability ${product.in_stock ? 'in-stock' : 'out-of-stock'}">
            ${product.in_stock ? 'В наличии' : 'Нет в наличии'}
          </div>
          <div class="product-description">
            <h2>Описание</h2>
            <p>${product.description}</p>
          </div>
          <div class="product-actions">
            <div class="quantity-control">
              <button class="quantity-btn decrease" data-id="${product.id}">-</button>
              <input type="number" id="product-quantity" value="1" min="1" max="99" class="quantity-input">
              <button class="quantity-btn increase" data-id="${product.id}">+</button>
            </div>
            <button class="btn primary-btn add-to-cart-btn" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-image="${product.image}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              Добавить в корзину
            </button>
            <button class="btn secondary-btn add-to-wishlist-btn" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-image="${product.image}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              В избранное
            </button>
          </div>
          <div class="product-meta">
            <div class="product-category">
              <span>Категория:</span>
              <a href="catalog.html?category=${product.category}">${product.category}</a>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Обновляем контейнер
    productDetailsContainer.innerHTML = productHTML;
    
    // Настраиваем обработчики событий
    // Изменение количества товара
    const quantityInput = document.getElementById('product-quantity');
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    const increaseBtn = document.querySelector('.quantity-btn.increase');
    
    if (quantityInput && decreaseBtn && increaseBtn) {
      decreaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
      });
      
      increaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
      });
      
      quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
          this.value = 1;
        }
      });
    }
    
    // Добавление в корзину
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', function() {
        const productData = {
          id: this.getAttribute('data-id'),
          title: this.getAttribute('data-title'),
          price: Number(this.getAttribute('data-price')),
          image: this.getAttribute('data-image'),
          quantity: parseInt(quantityInput.value)
        };
        
        if (typeof addToCart === 'function') {
          addToCart(productData);
        }
      });
    }
    
    // Добавление в избранное
    const addToWishlistBtn = document.querySelector('.add-to-wishlist-btn');
    if (addToWishlistBtn && typeof addToWishlist === 'function') {
      addToWishlistBtn.addEventListener('click', function() {
        const productData = {
          id: this.getAttribute('data-id'),
          title: this.getAttribute('data-title'),
          price: Number(this.getAttribute('data-price')),
          image: this.getAttribute('data-image')
        };
        
        addToWishlist(productData);
      });
    }
  } catch (error) {
    console.error('Ошибка при загрузке деталей товара:', error);
    
    // Показываем сообщение об ошибке
    productDetailsContainer.innerHTML = `
      <div class="error-message">
        <p>Произошла ошибка при загрузке товара. Пожалуйста, попробуйте позже.</p>
        <a href="catalog.html" class="btn primary-btn">Вернуться в каталог</a>
      </div>
    `;
  }
}

// Функция для получения товаров из базы данных
async function fetchProducts() {
  try {
    // Для демонстрационных целей используем моковые данные
    // В реальном проекте здесь будет запрос к API
    return [
      {
        id: '1',
        title: 'Смартфон Xiaomi Redmi Note 10S',
        description: 'Современный смартфон с отличной камерой и ёмкой батареей.',
        price: 18999,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Электроника',
        in_stock: true,
        popularity: 85,
        created_at: '2023-08-15'
      },
      {
        id: '2',
        title: 'Беспроводные наушники Redmi Buds 3',
        description: 'Компактные наушники с активным шумоподавлением и долгой автономной работой.',
        price: 3990,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Электроника',
        in_stock: true,
        popularity: 75,
        created_at: '2023-09-05'
      },
      {
        id: '3',
        title: 'Умная лампа Xiaomi Mi Smart Bulb',
        description: 'RGB-лампа с возможностью управления через приложение и голосовые команды.',
        price: 999,
        image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Дом и сад',
        in_stock: false,
        popularity: 60,
        created_at: '2023-10-10'
      },
      {
        id: '4',
        title: 'Робот-пылесос Xiaomi Mi Robot Vacuum-Mop',
        description: 'Умный пылесос с функцией влажной уборки и построением карты помещения.',
        price: 21990,
        image: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Дом и сад',
        in_stock: true,
        popularity: 90,
        created_at: '2023-07-25'
      },
      {
        id: '5',
        title: 'Фитнес-браслет Xiaomi Mi Band 6',
        description: 'Трекер активности с AMOLED-дисплеем и множеством функций для занятий спортом.',
        price: 3499,
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd6f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Аксессуары',
        in_stock: true,
        popularity: 95,
        created_at: '2023-11-15'
      },
      {
        id: '6',
        title: 'Умные весы Xiaomi Mi Body Composition Scale 2',
        description: 'Весы с определением различных параметров тела и синхронизацией с приложением.',
        price: 2990,
        image: 'https://images.unsplash.com/photo-1567243584011-eeea9ae233a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        category: 'Дом и сад',
        in_stock: true,
        popularity: 70,
        created_at: '2023-12-01'
      }
    ];
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    return [];
  }
}

// Функция для создания HTML карточки товара
function createProductCardHTML(product) {
  return `
    <div class="product-item">
      <a href="product.html?id=${product.id}" class="product-link">
        <div class="product-image">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          <div class="product-price">${formatPrice(product.price)}</div>
          <div class="product-availability ${product.in_stock ? 'in-stock' : 'out-of-stock'}">
            ${product.in_stock ? 'В наличии' : 'Нет в наличии'}
          </div>
        </div>
      </a>
      <div class="product-actions">
        <button class="btn primary-btn add-to-cart-btn" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-image="${product.image}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          В корзину
        </button>
        <button class="btn secondary-btn add-to-wishlist-btn" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-image="${product.image}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
        </button>
      </div>
    </div>
  `;
}

// Функция для инициализации кнопок добавления в корзину
function initAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productData = {
        id: this.getAttribute('data-id'),
        title: this.getAttribute('data-title'),
        price: Number(this.getAttribute('data-price')),
        image: this.getAttribute('data-image'),
        quantity: 1
      };
      
      if (typeof addToCart === 'function') {
        addToCart(productData);
      }
    });
  });
}

// Helper function to get plural form
function getPluralForm(number, forms) {
  let n = Math.abs(number) % 100;
  let n1 = n % 10;
  
  if (n > 10 && n < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  
  return forms[2];
}
