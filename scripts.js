import { parsePrice, formatPrice } from './js/utils/priceUtils.js';
import { createProductCard } from './js/utils/productCard.js';

// Вспомогательные функции для работы с localStorage
function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Ошибка при чтении из localStorage (${key}):`, error);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Ошибка при сохранении в localStorage (${key}):`, error);
    return false;
  }
}

function initCart() {
  // Получаем сохраненную корзину из localStorage или создаем пустую
  let cart = getFromStorage('cart', []);
  
  // Обновляем счетчик товаров в корзине
  updateCartCounter(cart);
}

function updateCartCounter(cart) {
  if (!cart) {
    cart = getFromStorage('cart', []);
  }
  const cartCounter = document.querySelector('.cart-counter');
  if (cartCounter) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCounter.textContent = totalItems > 0 ? totalItems : '';
    cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function initWishlist() {
  // Получаем сохраненное избранное из localStorage или создаем пустой массив
  let wishlist = getFromStorage('wishlist', []);
  
  // Поддержка старого формата хранения (массив объектов)
  if (wishlist.length > 0 && typeof wishlist[0] === 'object') {
    wishlist = wishlist.map(item => item.id);
    saveToStorage('wishlist', wishlist);
  }
  
  // Обновляем отображение кнопок избранного
  updateWishlistButtons(wishlist);
}

function updateWishlistButtons(wishlist) {
  if (!wishlist) {
    wishlist = getFromStorage('wishlist', []);
  }
  
  document.querySelectorAll('.wishlist-button').forEach(button => {
    const productCard = button.closest('.product-card');
    if (!productCard) return;
    
    const productLink = productCard.querySelector('.product-link');
    if (!productLink) return;
    
    // Получаем ID товара из URL или атрибута
    let productId;
    if (productLink.href && productLink.href.includes('id=')) {
      productId = productLink.href.split('id=')[1];
    } else if (productLink.dataset.id) {
      productId = productLink.dataset.id;
    }
    
    if (!productId) return;
    
    if (wishlist.includes(productId)) {
      button.classList.add('active');
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
    } else {
      button.classList.remove('active');
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
    }
  });
}

function initAddToCartButtons() {
  document.querySelectorAll('.add-to-cart-btn, .price-cart-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Кнопка добавления в корзину нажата');
      
      const productCard = this.closest('.product-card');
      if (!productCard) {
        console.log('Карточка товара не найдена');
        return;
      }
      
      const productLink = productCard.querySelector('.product-link');
      if (!productLink) {
        console.log('Ссылка на товар не найдена');
        return;
      }
      
      // Получаем ID товара из URL или атрибута
      let productId;
      if (productLink.href && productLink.href.includes('id=')) {
        productId = productLink.href.split('id=')[1];
      } else if (productLink.dataset.id) {
        productId = productLink.dataset.id;
      }
      
      if (!productId) {
        console.log('ID товара не найден');
        return;
      }
      
      const productTitle = productCard.querySelector('h3').textContent;
      const priceElement = productCard.querySelector('.current-price');
      if (!priceElement) {
        console.log('Элемент цены не найден');
        return;
      }
      
      const priceText = priceElement.textContent;
      const productPrice = parsePrice(priceText);
      const productImageElement = productCard.querySelector('.product-image img');
      const productImage = productImageElement ? productImageElement.src : '';
      
      console.log('Добавляем товар в корзину:', {
        id: productId,
        title: productTitle,
        price: productPrice,
        image: productImage
      });
      
      addToCart({
        id: productId,
        title: productTitle,
        price: productPrice,
        image: productImage,
        quantity: 1
      });
      
      // Показываем уведомление
      showNotification(`"${productTitle}" добавлен в корзину`);
    });
  });
}

function addToCart(product) {
  console.log('Функция addToCart вызвана с товаром:', product);
  
  let cart = getFromStorage('cart', []);
  console.log('Текущая корзина:', cart);
  
  // Проверяем, есть ли уже такой товар в корзине
  const existingProductIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingProductIndex !== -1) {
    // Если товар уже в корзине - увеличиваем количество
    cart[existingProductIndex].quantity += 1;
    console.log('Товар уже в корзине, увеличиваем количество');
  } else {
    // Иначе добавляем новый товар
    cart.push(product);
    console.log('Добавляем новый товар в корзину');
  }
  
  // Сохраняем корзину в localStorage
  const saved = saveToStorage('cart', cart);
  console.log('Корзина сохранена:', saved, cart);
  
  // Обновляем счетчик товаров
  updateCartCounter(cart);
}

function initWishlistButtons() {
  document.querySelectorAll('.wishlist-button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const productCard = this.closest('.product-card');
      if (!productCard) return;
      
      const productLink = productCard.querySelector('.product-link');
      if (!productLink) return;
      
      // Получаем ID товара из URL или атрибута
      let productId;
      if (productLink.href && productLink.href.includes('id=')) {
        productId = productLink.href.split('id=')[1];
      } else if (productLink.dataset.id) {
        productId = productLink.dataset.id;
      }
      
      if (!productId) return;
      
      const productTitle = productCard.querySelector('h3').textContent;
      
      toggleWishlist(productId, productTitle);
    });
  });
}

function toggleWishlist(productId, productTitle) {
  let wishlist = getFromStorage('wishlist', []);
  
  // Поддержка старого формата хранения (массив объектов)
  if (wishlist.length > 0 && typeof wishlist[0] === 'object') {
    wishlist = wishlist.map(item => item.id);
    saveToStorage('wishlist', wishlist);
  }
  
  // Проверяем, есть ли товар в избранном
  const index = wishlist.indexOf(productId);
  
  if (index !== -1) {
    // Если товар уже в избранном - удаляем
    wishlist.splice(index, 1);
    showNotification(`"${productTitle}" удален из избранного`);
  } else {
    // Иначе добавляем
    wishlist.push(productId);
    showNotification(`"${productTitle}" добавлен в избранное`);
  }
  
  // Сохраняем избранное в localStorage
  saveToStorage('wishlist', wishlist);
  
  // Обновляем отображение кнопок
  updateWishlistButtons(wishlist);
}

function initSearch() {
  const searchButton = document.querySelector('.search-button');
  
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      window.location.href = 'catalog.html?focus=search';
    });
  }
}

function showNotification(message) {
  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // Добавляем стили
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = 'white';
  notification.style.color = 'var(--text-color)';
  notification.style.padding = '10px 15px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
  notification.style.zIndex = '1000';
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(20px)';
  notification.style.transition = 'opacity 0.3s, transform 0.3s';
  
  // Добавляем на страницу
  document.body.appendChild(notification);
  
  // Анимация появления
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Удаление через 3 секунды
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

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
  // Эта функция будет реализована в других файлах
  console.log('loadCatalogProducts вызвана с категорией:', category);
}

function renderProductSection(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container || !products) return;
  
  container.innerHTML = '';
  
  products.forEach(product => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
  
  // Инициализируем кнопки после добавления карточек
  setTimeout(() => {
    initAddToCartButtons();
    initWishlistButtons();
    updateWishlistButtons();
  }, 100);
}

// Делаем функции глобально доступными
window.loadFeaturedProducts = loadFeaturedProducts;
window.loadCategories = loadCategories;
window.loadCatalogProducts = loadCatalogProducts;

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM загружен, инициализируем приложение...');
  
  // Функция для работы с корзиной
  initCart();
  
  // Функция для работы с избранным
  initWishlist();
  
  // Обработка кнопок добавления в корзину
  initAddToCartButtons();
  
  // Обработка кнопок добавления в избранное
  initWishlistButtons();
  
  // Инициализация поиска
  initSearch();
  
  // Загрузка товаров с Supabase, если мы находимся на главной странице
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    loadFeaturedProducts();
    loadCategories();
  }
  
  // Загрузка товаров в каталоге
  if (window.location.pathname === '/catalog.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    loadCatalogProducts(categoryParam);
  }
});
