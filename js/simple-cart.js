
/**
 * Простая и надежная корзина - полная перезаписка
 */

class SimpleCart {
  constructor() {
    this.items = [];
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    console.log('Инициализация простой корзины...');
    
    // Загружаем товары из localStorage
    this.loadCart();
    
    // Обновляем счетчики
    this.updateCounters();
    
    // Инициализируем кнопки
    this.initButtons();
    
    this.initialized = true;
    console.log('Простая корзина инициализирована, товаров:', this.items.length);
  }
  
  loadCart() {
    try {
      const saved = localStorage.getItem('cart');
      this.items = saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
      this.items = [];
    }
  }
  
  saveCart() {
    try {
      localStorage.setItem('cart', JSON.stringify(this.items));
      this.updateCounters();
    } catch (error) {
      console.error('Ошибка сохранения корзины:', error);
    }
  }
  
  addItem(productData) {
    console.log('Добавляем товар в корзину:', productData);
    
    // Проверяем, есть ли уже такой товар
    const existingItem = this.items.find(item => item.id === productData.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: productData.id,
        title: productData.title,
        price: productData.price,
        image: productData.image,
        quantity: 1
      });
    }
    
    this.saveCart();
    this.showNotification(`"${productData.title}" добавлен в корзину`);
    console.log('Товар добавлен в корзину');
  }
  
  updateCounters() {
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const counters = document.querySelectorAll('.cart-counter');
    
    counters.forEach(counter => {
      counter.textContent = totalItems > 0 ? totalItems : '';
      counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
    
    console.log('Счетчики корзины обновлены:', totalItems);
  }
  
  initButtons() {
    // Удаляем старые обработчики и добавляем новые
    const buttons = document.querySelectorAll('.add-to-cart-btn, .price-cart-btn');
    
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
    
    console.log('Кнопки корзины инициализированы:', buttons.length);
  }
  
  handleButtonClick(event) {
    const button = event.target;
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
    
    // Получаем данные товара
    const titleElement = productCard.querySelector('h3 a') || productCard.querySelector('h3');
    const priceElement = productCard.querySelector('.current-price');
    const imageElement = productCard.querySelector('.product-image img');
    
    if (!titleElement || !priceElement) {
      console.log('Не найдены необходимые элементы товара');
      return;
    }
    
    const productData = {
      id: productId,
      title: titleElement.textContent.trim(),
      price: this.parsePrice(priceElement.textContent),
      image: imageElement ? imageElement.src : ''
    };
    
    this.addItem(productData);
  }
  
  parsePrice(priceText) {
    if (!priceText) return 0;
    const numeric = parseFloat(priceText.replace(/[^0-9.-]+/g, ''));
    return isNaN(numeric) ? 0 : numeric;
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

// Создаем глобальный экземпляр корзины
window.simpleCart = new SimpleCart();

// Инициализируем корзину при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.simpleCart.init();
  });
} else {
  window.simpleCart.init();
}

// Глобальные функции для совместимости
window.initCart = () => window.simpleCart.init();
window.initAddToCartButtons = () => window.simpleCart.initButtons();
window.updateCartCounter = () => window.simpleCart.updateCounters();
