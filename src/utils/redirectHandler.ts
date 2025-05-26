
// Обработка редиректов со старых URL на новые
export const handleProductRedirect = (productId: string): void => {
  // Загружаем маппинг ID -> slug
  fetch('/product-mapping.json')
    .then(response => response.json())
    .then(mapping => {
      const slug = mapping[productId];
      if (slug) {
        // Редирект 301 на новый URL
        window.location.replace(`/product/${slug}`);
      } else {
        console.warn(`Slug не найден для товара ${productId}`);
        // Fallback на каталог
        window.location.replace('/catalog');
      }
    })
    .catch(error => {
      console.error('Ошибка загрузки маппинга:', error);
      // Fallback на каталог
      window.location.replace('/catalog');
    });
};

// Проверка и обработка старых hash-маршрутов
export const checkAndRedirectOldRoutes = (): void => {
  const hash = window.location.hash;
  
  // Проверяем старые маршруты вида /#/product/id
  const productMatch = hash.match(/^#\/product\/([a-f0-9-]+)$/);
  
  if (productMatch) {
    const productId = productMatch[1];
    console.log(`Обнаружен старый URL товара: ${productId}`);
    handleProductRedirect(productId);
    return;
  }
  
  // Другие старые маршруты можно добавить здесь
  const catalogMatch = hash.match(/^#\/catalog/);
  if (catalogMatch) {
    window.location.replace('/catalog');
    return;
  }
  
  const cartMatch = hash.match(/^#\/cart/);
  if (cartMatch) {
    window.location.replace('/cart');
    return;
  }
};

// Инициализация обработчика при загрузке страницы
export const initRedirectHandler = (): void => {
  // Проверяем при загрузке страницы
  checkAndRedirectOldRoutes();
  
  // Слушаем изменения hash
  window.addEventListener('hashchange', checkAndRedirectOldRoutes);
};
