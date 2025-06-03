
// Функциональность поиска

let searchTimeout;

// Инициализация поиска
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const searchSuggestions = document.getElementById('search-suggestions');

  if (!searchInput) return;

  // Обработчик ввода в поиск
  searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    
    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
      if (searchSuggestions) {
        searchSuggestions.innerHTML = '';
        searchSuggestions.style.display = 'none';
      }
      return;
    }
    
    searchTimeout = setTimeout(() => {
      performSearch(query);
    }, 300);
  });

  // Обработчик кнопки поиска
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
      }
    });
  }

  // Обработчик Enter
  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const query = this.value.trim();
      if (query) {
        window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
      }
    }
  });
}

// Выполнение поиска
async function performSearch(query) {
  const searchSuggestions = document.getElementById('search-suggestions');
  if (!searchSuggestions) return;

  try {
    const response = await fetch(`https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?title=ilike.*${query}*&select=id,title&limit=5`, {
      headers: window.CONFIG.apiHeaders
    });
    
    if (!response.ok) throw new Error('Ошибка поиска');
    
    const products = await response.json();
    
    if (products.length > 0) {
      searchSuggestions.innerHTML = products.map(product => 
        `<div class="search-suggestion" onclick="goToProduct('${product.id}')">${product.title}</div>`
      ).join('');
      searchSuggestions.style.display = 'block';
    } else {
      searchSuggestions.innerHTML = '<div class="search-suggestion">Ничего не найдено</div>';
      searchSuggestions.style.display = 'block';
    }
  } catch (error) {
    console.error('Ошибка поиска:', error);
    searchSuggestions.style.display = 'none';
  }
}

function goToProduct(productId) {
  window.location.href = `product.html?id=${productId}`;
}

// Скрытие подсказок при клике вне поиска
document.addEventListener('click', function(event) {
  const searchSuggestions = document.getElementById('search-suggestions');
  const searchInput = document.getElementById('search-input');
  
  if (searchSuggestions && searchInput) {
    if (!searchInput.contains(event.target) && !searchSuggestions.contains(event.target)) {
      searchSuggestions.style.display = 'none';
    }
  }
});

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', initSearch);

window.initSearch = initSearch;
window.performSearch = performSearch;
window.goToProduct = goToProduct;
