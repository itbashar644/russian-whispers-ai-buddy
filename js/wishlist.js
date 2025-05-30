
/**
 * Функционал для работы с избранным
 */

// Ensure price helpers exist when running without utils.js
if (typeof parsePrice !== 'function') {
  function parsePrice(price) {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    const numeric = parseFloat(String(price).replace(/[^0-9.-]+/g, ''));
    return isNaN(numeric) ? 0 : numeric;
  }
}
if (typeof formatPrice !== 'function') {
  function formatPrice(price) {
    const value = parsePrice(price);
    return value.toLocaleString('ru-RU') + ' ₽';
  }
}

// Функция для инициализации избранного
function initWishlist() {
  console.log('Инициализируем избранное...');
  updateWishlistButtons();
}

// Функция для обновления состояния кнопок избранного
function updateWishlistButtons() {
  try {
    console.log('Обновляем кнопки избранного...');
    // Получаем текущий список избранных товаров из localStorage
    let wishlist = getFromStorage('wishlist', []);
    
    // Поддержка старого формата хранения (массив объектов)
    if (wishlist.length > 0 && typeof wishlist[0] === 'object') {
      wishlist = wishlist.map(item => item.id);
      saveToStorage('wishlist', wishlist);
    }
    
    // Обновляем состояние всех кнопок избранного на странице
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
    
    console.log('Кнопки избранного обновлены, товаров в избранном:', wishlist.length);
  } catch (error) {
    console.error('Ошибка при обновлении кнопок избранного:', error);
  }
}

// Функция для добавления/удаления товара в избранное
function toggleWishlist(productId, productTitle) {
  try {
    console.log('Переключаем избранное для товара:', productId, productTitle);
    
    // Получаем текущий список избранных товаров из localStorage
    let wishlist = getFromStorage('wishlist', []);
    
    // Поддержка старого формата хранения (массив объектов)
    if (wishlist.length > 0 && typeof wishlist[0] === 'object') {
      wishlist = wishlist.map(item => item.id);
      saveToStorage('wishlist', wishlist);
    }
    
    // Проверяем, есть ли уже этот товар в избранном
    const existingIndex = wishlist.indexOf(productId);
    
    if (existingIndex >= 0) {
      // Если товар уже в избранном, удаляем его
      wishlist.splice(existingIndex, 1);
      
      // Сохраняем обновленный список
      saveToStorage('wishlist', wishlist);
      
      // Обновляем статус кнопок избранного
      updateWishlistButtons();
      
      if (typeof showNotification === 'function') {
        showNotification(`"${productTitle}" удален из избранного`);
      }
    } else {
      // Если товара нет в избранном, добавляем его
      wishlist.push(productId);
      
      // Сохраняем обновленный список
      saveToStorage('wishlist', wishlist);
      
      // Обновляем статус кнопок избранного
      updateWishlistButtons();
      
      if (typeof showNotification === 'function') {
        showNotification(`"${productTitle}" добавлен в избранное`);
      }
    }
    
    // Обновляем страницу избранного, если мы на ней находимся
    if (window.location.pathname.endsWith('wishlist.html') && typeof renderWishlist === 'function') {
      renderWishlist();
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при работе с избранным:', error);
    return false;
  }
}

// Функция для рендеринга страницы избранного
function renderWishlist() {
  console.log('Рендерим страницу избранного...');
  
  const wishlistContainer = document.getElementById('wishlist-container');
  if (!wishlistContainer) {
    console.log('Контейнер избранного не найден');
    return;
  }
  
  try {
    // Получаем текущий список избранных товаров из localStorage
    let wishlist = getFromStorage('wishlist', []);

    // Поддержка старого формата хранения (массив объектов)
    if (wishlist.length > 0 && typeof wishlist[0] === 'object') {
      wishlist = wishlist.map(item => item.id);
      saveToStorage('wishlist', wishlist);
    }
    
    console.log('Загружаем избранные товары, ID:', wishlist);
    
    if (wishlist.length === 0) {
      // Если список пуст, показываем соответствующее сообщение
      wishlistContainer.innerHTML = `
        <div class="empty-message">
          <p>У вас нет избранных товаров</p>
          <div class="section-actions" style="margin-top: 2rem;">
            <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
          </div>
        </div>
      `;
      return;
    }
    
    // Показываем состояние загрузки
    wishlistContainer.innerHTML = '<div class="loading">Загрузка товаров...</div>';
    
    // Формируем строку с ID товаров для запроса
    const ids = wishlist.map(id => `"${id}"`).join(',');
    
    console.log('Запрашиваем товары из Supabase с ID:', ids);
    
    // Загружаем информацию о товарах из Supabase
    fetch(`https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?id=in.(${ids})&select=*`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI'
      }
    })
      .then(response => {
        console.log('Ответ от Supabase:', response.status);
        if (!response.ok) {
          throw new Error('Ошибка при загрузке избранных товаров');
        }
        return response.json();
      })
      .then(products => {
        console.log('Получены товары:', products.length);
        
        if (products.length === 0) {
          wishlistContainer.innerHTML = `
            <div class="empty-message">
              <p>Товары из вашего списка избранного не найдены</p>
              <div class="section-actions" style="margin-top: 2rem;">
                <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
              </div>
            </div>
          `;
          return;
        }
        
        let productsHTML = '<div class="products-grid">';
        
        products.forEach(product => {
          const priceDisplay = product.discount_price
            ? `<span class="old-price">${formatPrice(product.price)}</span><span class="current-price with-background">${formatPrice(product.discount_price)}</span>`
            : `<span class="current-price with-background">${formatPrice(product.price)}</span>`;
          
          // Создаем ссылки на маркетплейсы если они есть
          let marketplaceLinks = '';
          if (product.ozon_url || product.wildberries_url || product.avito_url) {
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

            marketplaceLinks = `
              <div class="marketplace-links">
                <span class="marketplace-title">Доступен на:</span>
                <div class="marketplace-icons">
                  ${marketplaceIconsHtml}
                </div>
              </div>
            `;
          }
          
          productsHTML += `
            <div class="product-card">
              <div class="product-image">
                <a href="product.html?id=${product.id}" class="product-link" data-id="${product.id}">
                  <img src="${product.image_url}" alt="${product.title}" loading="lazy">
                </a>
                <button class="wishlist-button active" aria-label="Удалить из избранного" data-id="${product.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                </button>
              </div>
              <div class="product-info">
                <h3>
                  <a href="product.html?id=${product.id}" class="product-link" data-id="${product.id}">${product.title}</a>
                </h3>
                <div class="product-price">
                  <button class="price-cart-btn" data-id="${product.id}" aria-label="Добавить в корзину">
                    ${priceDisplay}
                  </button>
                </div>
                ${marketplaceLinks}
                <button class="add-to-cart-btn" data-id="${product.id}">В корзину</button>
              </div>
            </div>
          `;
        });
        
        productsHTML += '</div>';
        wishlistContainer.innerHTML = productsHTML;
        
        // Инициализируем обработчики для кнопок после рендеринга
        console.log('Инициализируем обработчики после рендеринга избранного');
        setTimeout(() => {
          if (typeof initAddToCartButtons === 'function') {
            initAddToCartButtons();
          }
          initWishlistButtons();
        }, 100);
        
      })
      .catch(error => {
        console.error('Ошибка при загрузке избранных товаров:', error);
        wishlistContainer.innerHTML = `
          <div class="error-message">
            <p>Ошибка при загрузке избранных товаров: ${error.message}</p>
            <div class="section-actions" style="margin-top: 2rem;">
              <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
            </div>
          </div>
        `;
      });
  } catch (error) {
    console.error('Ошибка при рендеринге избранного:', error);
    wishlistContainer.innerHTML = `
      <div class="error-message">
        <p>Ошибка при загрузке избранных товаров</p>
        <div class="section-actions" style="margin-top: 2rem;">
          <a href="catalog.html" class="btn btn-primary">Перейти в каталог</a>
        </div>
      </div>
    `;
  }
}

// Инициализация кнопок избранного на странице
function initWishlistButtons() {
  console.log('Инициализируем кнопки избранного...');
  
  document.querySelectorAll('.wishlist-button, .wishlist-btn-large').forEach(button => {
    // Удаляем старые обработчики событий
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const productCard = this.closest('.product-card');
      if (!productCard) return;
      
      const productLink = productCard.querySelector('.product-link');
      if (!productLink) return;
      
      let productId;
      if (productLink.href && productLink.href.includes('id=')) {
        productId = productLink.href.split('id=')[1];
      } else if (productLink.dataset.id) {
        productId = productLink.dataset.id;
      }
      
      if (!productId) return;
      
      const productTitle = productCard.querySelector('h3 a').textContent;
      
      toggleWishlist(productId, productTitle);
    });
  });
  
  // Обновляем состояние кнопок
  updateWishlistButtons();
  
  console.log('Кнопки избранного инициализированы для', document.querySelectorAll('.wishlist-button, .wishlist-btn-large').length, 'кнопок');
}

// Инициализируем избранное при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM загружен, инициализируем избранное...');
  initWishlist();
  
  // Если мы на странице избранного, рендерим ее
  if (window.location.pathname.endsWith('wishlist.html')) {
    console.log('Мы на странице избранного, рендерим...');
    renderWishlist();
  }
});
