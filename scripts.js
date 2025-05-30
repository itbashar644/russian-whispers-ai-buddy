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
   const counters = document.querySelectorAll('.cart-counter');
  if (!counters.length) return;
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  counters.forEach(counter => {
    counter.textContent = totalItems > 0 ? totalItems : '';
    counter.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

function addToCart(product) {
  console.log('Добавляем товар в корзину:', product);
  
  let cart = getFromStorage('cart', []);
  
  const existingProductIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity += 1;
    console.log('Товар уже в корзине, увеличиваем количество');
  } else {
    cart.push(product);
    console.log('Добавляем новый товар в корзину');
  }
  
  const saved = saveToStorage('cart', cart);
  console.log('Корзина сохранена:', saved, cart);
  
  updateCartCounter(cart);
  
  return true;
}

function handleAddToCart(event) {
  event.preventDefault();
  event.stopPropagation();
  
  console.log('Кнопка добавления в корзину нажата');
  
  const productCard = event.target.closest('.product-card');
  if (!productCard) {
    console.log('Карточка товара не найдена');
    return;
  }
  
  const productLink = productCard.querySelector('.product-link');
  if (!productLink) {
    console.log('Ссылка на товар не найдена');
    return;
  }
  
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
  
  const product = {
    id: productId,
    title: productTitle,
    price: productPrice,
    image: productImage,
    quantity: 1
  };
  
  console.log('Данные товара для корзины:', product);
  
  const success = addToCart(product);
  
  if (success) {
    showNotification(`"${productTitle}" добавлен в корзину`);
  } else {
    showNotification('Ошибка при добавлении товара в корзину', 'error');
  }
}

function initAddToCartButtons() {
  // Удаляем старые обработчики
  document.querySelectorAll('.add-to-cart-btn, .price-cart-btn').forEach(button => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
  });
  
  // Добавляем новые обработчики
  document.querySelectorAll('.add-to-cart-btn, .price-cart-btn').forEach(button => {
    button.addEventListener('click', handleAddToCart);
  });
  
  console.log('Обработчики кнопок корзины инициализированы для', document.querySelectorAll('.add-to-cart-btn, .price-cart-btn').length, 'кнопок');
}

function showNotification(message, type = 'success') {
  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // Добавляем стили
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = type === 'error' ? '#dc3545' : '#28a745';
  notification.style.color = 'white';
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
  
  // Важно: инициализируем обработчики после добавления карточек
  setTimeout(() => {
    initAddToCartButtons();
    // Инициализируем кнопки избранного из внешнего файла
    if (typeof initWishlistButtons === 'function') {
      initWishlistButtons();
    }
    if (typeof updateWishlistButtons === 'function') {
      updateWishlistButtons();
    }
    console.log('Обработчики событий инициализированы для секции:', containerId);
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
  
  // Обработка кнопок добавления в корзину
  initAddToCartButtons();
  
  // Инициализация поиска
  initSearch();
  
  // Инициализация чата
  if (typeof initChat === 'function') {
    console.log('Инициализируем чат из scripts.js');
    initChat();
  }
  
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
