
/**
 * Функционал поиска с подсказками
 */

// Простая функция дебаунса
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Подсветка совпадающей части запроса
function highlightQuery(text, query) {
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(safeQuery, 'ig');
  return text.replace(regex, match => `<mark>${match}</mark>`);
}

// Загрузка подсказок из Supabase
async function fetchSearchSuggestions(query) {
  if (!query) return [];
  try {
    const CONFIG = window.CONFIG || {
      supabaseUrl: 'https://lpwvhyawvxibtuxfhitx.supabase.co',
      supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI',
      get apiHeaders() {
        return {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json'
        };
      }
    };

    const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/products?select=id,title,image_url&title=ilike.%${encodeURIComponent(query)}%&limit=5`, {
      headers: CONFIG.apiHeaders
    });

    if (!response.ok) {
      console.error('Ошибка загрузки подсказок:', response.status);
      return [];
    }
    
    const data = await response.json();
    return data || [];
  } catch (err) {
    console.error('Ошибка при загрузке подсказок:', err);
    return [];
  }
}

// Инициализация поиска
function initSearch() {
  console.log('Инициализируем поиск...');
  
  const searchContainers = document.querySelectorAll(
    '.header-search, .catalog-search'
  );

  console.log('Найдено контейнеров поиска:', searchContainers.length);

  if (searchContainers.length > 0) {
    searchContainers.forEach((container, index) => {
      console.log(`Инициализируем контейнер поиска ${index + 1}`);
      
      const searchButton = container.querySelector('#search-button, .search-button');
      const searchInput = container.querySelector('#search-input, input[type="search"]');
      const suggestionsContainer = container.querySelector('#search-suggestions, .search-suggestions');

      console.log('Элементы поиска:', {
        button: !!searchButton,
        input: !!searchInput,
        suggestions: !!suggestionsContainer
      });

      // Восстанавливаем поисковый запрос из URL, если он есть
      const params = new URLSearchParams(window.location.search);
      const queryParam = params.get('search');
      if (queryParam && searchInput) {
        searchInput.value = queryParam;
        console.log('Восстановлен поисковый запрос:', queryParam);
      }

      if (!searchButton || !searchInput) {
        console.warn('Не найдены элементы поиска в контейнере', index + 1);
        return;
      }

      let activeIndex = -1;

      const goSearch = () => {
        const query = searchInput.value.trim();
        console.log('Выполняем поиск по запросу:', query);
        const url = new URL('catalog.html', window.location.origin);
        if (query) {
          url.searchParams.set('search', query);
        }
        window.location.href = url.toString();
      };

      // Удаляем старые обработчики
      const newSearchButton = searchButton.cloneNode(true);
      searchButton.parentNode.replaceChild(newSearchButton, searchButton);
      
      const newSearchInput = searchInput.cloneNode(true);
      searchInput.parentNode.replaceChild(newSearchInput, searchInput);

      // Добавляем новые обработчики
      newSearchButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Клик по кнопке поиска');
        goSearch();
      });

      newSearchInput.addEventListener('keydown', function (e) {
        const items = suggestionsContainer
          ? suggestionsContainer.querySelectorAll('.suggestion-item')
          : [];
        
        if (e.key === 'ArrowDown' && items.length > 0) {
          e.preventDefault();
          activeIndex = (activeIndex + 1) % items.length;
        } else if (e.key === 'ArrowUp' && items.length > 0) {
          e.preventDefault();
          activeIndex = (activeIndex - 1 + items.length) % items.length;
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (activeIndex >= 0 && items.length > 0) {
            const id = items[activeIndex].getAttribute('data-id');
            window.location.href = `product.html?id=${id}`;
            return;
          }
          goSearch();
        } else {
          return;
        }

        items.forEach((el, idx) => {
          if (idx === activeIndex) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        });
      });

      // Подсказки при вводе
      if (suggestionsContainer) {
        newSearchInput.addEventListener(
          'input',
          debounce(async function () {
            const query = newSearchInput.value.trim();
            activeIndex = -1;
            console.log('Ввод в поиске:', query);
            
            if (!query) {
              suggestionsContainer.style.display = 'none';
              suggestionsContainer.innerHTML = '';
              return;
            }

            const currentQuery = query;
            const suggestions = await fetchSearchSuggestions(currentQuery);
            
            // If user typed a new query while this one was loading, ignore results
            if (newSearchInput.value.trim() !== currentQuery) {
              return;
            }

            console.log('Получены подсказки:', suggestions.length);

            if (suggestions.length === 0) {
              suggestionsContainer.style.display = 'none';
              suggestionsContainer.innerHTML = '';
              return;
            }
            
            suggestionsContainer.innerHTML = suggestions
              .map(
                item => `
              <div class="suggestion-item" data-id="${item.id}">
                <img src="${item.image_url}" alt="${item.title}">
                <span>${highlightQuery(item.title, currentQuery)}</span>
              </div>`
              )
              .join('');
            suggestionsContainer.style.display = 'block';
          }, 300)
        );

        suggestionsContainer.addEventListener('click', function (e) {
          const item = e.target.closest('.suggestion-item');
          if (item) {
            const id = item.getAttribute('data-id');
            window.location.href = `product.html?id=${id}`;
          }
        });
      }
    });
  } else {
    // Fallback для мобильной кнопки поиска
    const searchIcon = document.querySelector('.search-button, .mobile-search-button');
    if (searchIcon) {
      console.log('Инициализируем fallback кнопку поиска');
      searchIcon.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'catalog.html?focus=search';
      });
    }
  }
}

// Делаем функцию глобально доступной
window.initSearch = initSearch;

// Автоинициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', initSearch);
