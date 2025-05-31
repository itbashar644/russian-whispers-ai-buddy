
/**
 * Простое и надежное избранное - полная перезаписка
 */

class SimpleWishlist {
  constructor() {
    this.items = [];
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    console.log('Инициализация простого избранного...');
    
    // Загружаем избранное из localStorage
    this.loadWishlist();
    
    // Инициализируем кнопки
    this.initButtons();
    
    this.initialized = true;
    console.log('Простое избранное инициализировано, товаров:', this.items.length);
  }
  
  loadWishlist() {
    try {
      const saved = localStorage.getItem('wishlist');
      let items = saved ? JSON.parse(saved) : [];
      
      // Поддержка старого формата (массив объектов)
      if (items.length > 0 && typeof items[0] === 'object') {
        items = items.map(item => item.id);
      }
      
      this.items = items;
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
      this.items = [];
    }
  }
  
  saveWishlist() {
    try {
      localStorage.setItem('wishlist', JSON.stringify(this.items));
      this.updateButtons();
    } catch (error) {
      console.error('Ошибка сохранения избранного:', error);
    }
  }
  
  toggle(productId, productTitle) {
    console.log('Переключаем избранное для товара:', productId);
    
    const index = this.items.indexOf(productId);
    
    if (index >= 0) {
      // Удаляем из избранного
      this.items.splice(index, 1);
      this.saveWishlist();
      this.showNotification(`"${productTitle}" удален из избранного`);
    } else {
      // Добавляем в избранное
      this.items.push(productId);
      this.saveWishlist();
      this.showNotification(`"${productTitle}" добавлен в избранное`);
    }
  }
  
  updateButtons() {
    const buttons = document.querySelectorAll('.wishlist-button, .wishlist-btn-large');
    
    buttons.forEach(button => {
      const productCard = button.closest('.product-card');
      if (!productCard) return;
      
      const productLink = productCard.querySelector('.product-link');
      if (!productLink) return;
      
      // Получаем ID товара
      let productId;
      if (productLink.href && productLink.href.includes('id=')) {
        productId = productLink.href.split('id=')[1];
      } else if (productLink.dataset.id) {
        productId = productLink.dataset.id;
      }
      
      if (!productId) return;
      
      // Обновляем состояние кнопки
      if (this.items.includes(productId)) {
        button.classList.add('active');
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
      } else {
        button.classList.remove('active');
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
      }
    });
    
    console.log('Кнопки избранного обновлены');
  }
  
  initButtons() {
    // Удаляем старые обработчики и добавляем новые
    const buttons = document.querySelectorAll('.wishlist-button, .wishlist-btn-large');
    
    buttons.forEach(button => {
      // Удаляем старые обработчики
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Добавляем новый обработчик
      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleButtonClick(e);
      });
    });
    
    // Обновляем состояние кнопок
    this.updateButtons();
    
    console.log('Кнопки избранного инициализированы:', buttons.length);
  }
  
  handleButtonClick(event) {
    const button = event.target.closest('.wishlist-button, .wishlist-btn-large');
    const productCard = button.closest('.product-card');
    
    if (!productCard) {
      console.log('Карточка товара не найдена');
      return;
    }
    
    const productLink = productCard.querySelector('.product-link');
    if (!productLink) {
      console.log('Ссылка на товар не найдена');
      return;
    }
    
    // Получаем ID товара
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
    
    // Получаем название товара
    const titleElement = productCard.querySelector('h3 a') || productCard.querySelector('h3');
    const productTitle = titleElement ? titleElement.textContent.trim() : 'Товар';
    
    this.toggle(productId, productTitle);
  }
  
  showNotification(message) {
    // Простое уведомление
    if (typeof showNotification === 'function') {
      showNotification(message);
    } else {
      console.log(message);
    }
  }
}

// Создаем глобальный экземпляр избранного
window.simpleWishlist = new SimpleWishlist();

// Инициализируем избранное при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.simpleWishlist.init();
  });
} else {
  window.simpleWishlist.init();
}

// Глобальные функции для совместимости
window.initWishlist = () => window.simpleWishlist.init();
window.initWishlistButtons = () => window.simpleWishlist.initButtons();
window.updateWishlistButtons = () => window.simpleWishlist.updateButtons();
