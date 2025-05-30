
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
    const { supabase } = await import('./supabase.js');
    const { data, error } = await supabase
      .from('products')
      .select('id,title,image_url')
      .ilike('title', `%${query}%`)
      .limit(5);

    if (error) {
      console.error('Ошибка загрузки подсказок:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Ошибка при загрузке подсказок:', err);
    return [];
  }
}

// Инициализация поиска
function initSearch() {
  const searchContainers = document.querySelectorAll(
    '.header-search, .catalog-search'
  );

  if (searchContainers.length > 0) {
    searchContainers.forEach(container => {
      const searchButton = container.querySelector('#search-button');
      const searchInput = container.querySelector('#search-input');
      const suggestionsContainer = container.querySelector('#search-suggestions');

      // Восстанавливаем поисковый запрос из URL, если он есть
      const params = new URLSearchParams(window.location.search);
      const queryParam = params.get('search');
      if (queryParam) {
        searchInput.value = queryParam;
      }

      if (!searchButton || !searchInput) return;

      let activeIndex = -1;

    const goSearch = () => {
      const query = searchInput.value.trim();
      const url = new URL('catalog.html', window.location.origin);
      if (query) {
        url.searchParams.set('search', query);
      }
      window.location.href = url.toString();
    };

    searchButton.addEventListener('click', goSearch);

    searchInput.addEventListener('keydown', function (e) {
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
        if (activeIndex >= 0 && items.length > 0) {
          e.preventDefault();
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
    searchInput.addEventListener(
      'input',
      debounce(async function () {
        if (!suggestionsContainer) return;
        const query = searchInput.value.trim();
        activeIndex = -1;
        if (!query) {
          suggestionsContainer.style.display = 'none';
          suggestionsContainer.innerHTML = '';
          return;
        }

        const currentQuery = query;
        const suggestions = await fetchSearchSuggestions(currentQuery);
        // If user typed a new query while this one was loading, ignore results
        if (searchInput.value.trim() !== currentQuery) {
          return;
        }

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

    if (suggestionsContainer) {
      suggestionsContainer.addEventListener('click', function (e) {
        const item = e.target.closest('.suggestion-item');
        if (item) {
          const id = item.getAttribute('data-id');
          window.location.href = `product.html?id=${id}`;
        }
      });
    }
    }); // end forEach
  } else {
    const searchIcon = document.querySelector('.search-button');
    if (searchIcon) {
      searchIcon.addEventListener('click', function () {
        window.location.href = 'catalog.html?focus=search';
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', initSearch);
