
/**
 * Основной скрипт приложения
 */

document.addEventListener('DOMContentLoaded', function() {
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
    loadCategories(); // Сначала загружаем категории
    loadFeaturedProducts(); // Затем популярные товары
  }
  
  // Загрузка товаров в каталоге
  if (window.location.pathname === '/catalog.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    loadCatalogProducts(categoryParam);
        // Загружаем список категорий для сайдбара каталога
    loadCategories();
  }
  
  // Если мы на странице товара, загружаем данные о товаре
  if (window.location.pathname === '/product.html') {
    loadProductDetails();
  }
  
  // Находим форму обратной связи
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', submitContactForm);
  }
  
  // Если мы на странице корзины, рендерим корзину
  if (window.location.pathname.endsWith('cart.html')) {
    renderCart();
  }
});
