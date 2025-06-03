
/**
 * Компонент карточки товара
 */

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const priceDisplay = product.discount_price
    ? `<span class="old-price">${formatPrice(product.price)}</span><span class="current-price with-background">${formatPrice(product.discount_price)}</span>`
    : `<span class="current-price with-background">${formatPrice(product.price)}</span>`;

  const displayTitle = product.title.length > 50
    ? `${product.title.slice(0, 50)}…`
    : product.title;

  // Marketplace links
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
        <a href="product.html?id=${product.id}" class="product-link" data-id="${product.id}">${displayTitle}</a>
      </h3>
      ${marketplaceLinks}
      <div class="product-price">
        <button class="price-cart-btn" data-id="${product.id}" 
                data-title="${product.title}" 
                data-price="${product.discount_price || product.price}"
                data-original-price="${product.price}"
                data-discount-price="${product.discount_price || ''}"
                data-image="${product.image_url}"
                aria-label="Добавить в корзину">
          ${priceDisplay}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </button>
      </div>
      <button class="add-to-cart-btn" data-id="${product.id}"
              data-title="${product.title}" 
              data-price="${product.discount_price || product.price}"
              data-original-price="${product.price}"
              data-discount-price="${product.discount_price || ''}"
              data-image="${product.image_url}">В корзину</button>
    </div>
  `;
  
  return card;
}

window.createProductCard = createProductCard;
