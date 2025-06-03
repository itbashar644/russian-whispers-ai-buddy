
/**
 * Загрузчик данных
 */

async function loadHomePageProducts() {
  try {
    console.log('Загружаем товары для главной страницы...');
    
    await loadHomePageCategories();
    
    const response = await fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?select=*&archived=eq.false&in_stock=eq.true&order=created_at.desc', {
      headers: CONFIG.apiHeaders
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить товары');
    }
    
    const allProducts = await response.json();
    console.log('Товары загружены:', allProducts.length);
    
    if (!allProducts || allProducts.length === 0) {
      console.log('Товары не найдены');
      return;
    }
    
    const bestsellers = allProducts.filter(product => product.is_bestseller).slice(0, 8);
    const newProducts = allProducts.filter(product => product.is_new).slice(0, 8);
    const popularProducts = allProducts.slice(0, 8);
    
    renderProductSection('bestsellersGrid', bestsellers);
    renderProductSection('newProductsGrid', newProducts);
    renderProductSection('productsGrid', popularProducts);
    
    setTimeout(() => {
      initializeButtons();
    }, 100);
    
  } catch (error) {
    console.error('Ошибка при загрузке товаров для главной:', error);
  }
}

async function loadHomePageCategories() {
  try {
    const categoriesContainer = document.getElementById('categoriesGrid');
    if (!categoriesContainer) return;
    
    categoriesContainer.innerHTML = '<div class="loading">Загружаем категории...</div>';
    
    const response = await fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/categories?select=*&order=name.asc', {
      headers: CONFIG.apiHeaders
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить категории');
    }
    
    const categories = await response.json();
    console.log('Категории загружены:', categories.length);
    
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
    const categoriesContainer = document.getElementById('categoriesGrid');
    if (categoriesContainer) {
      categoriesContainer.innerHTML = '<div class="error-message">Ошибка при загрузке категорий</div>';
    }
  }
}

function renderProductSection(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  if (!products || products.length === 0) {
    container.innerHTML = '<div class="empty-message">Товары не найдены</div>';
    return;
  }
  
  container.innerHTML = '';
  
  products.forEach(product => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
}

window.loadHomePageProducts = loadHomePageProducts;
window.renderProductSection = renderProductSection;
