
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
    loadCategories(); // Сначала загружаем категории
    
    if (typeof loadFeaturedProducts === 'function') {
      loadFeaturedProducts(); // Затем популярные товары
    }
  }
  
  // Загрузка товаров в каталоге
  if (window.location.pathname === '/catalog.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // Загружаем категории для сайдбара каталога
    loadCategories();
    
    if (typeof loadCatalogProducts === 'function') {
      loadCatalogProducts(categoryParam);
    }
  }
  
  // Если мы на странице товара, загружаем данные о товаре
  if (window.location.pathname === '/product.html') {
    if (typeof loadProductDetails === 'function') {
      loadProductDetails();
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
  
  // Убедимся, что иконка профиля ведёт на страницу авторизации
  const profileLinks = document.querySelectorAll('a[href="login.html"]');
  profileLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Предотвращаем действие по умолчанию и явно перенаправляем на login.html
      e.preventDefault();
      window.location.href = 'login.html';
    });
  });
  
  // Инициализация чата, если он есть на странице
  if (typeof initChat === 'function') {
    initChat();
  }
});
