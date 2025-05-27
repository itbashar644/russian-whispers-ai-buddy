
// Обработчик редиректов для статических страниц товаров
export async function initRedirectHandler() {
  // Проверяем, находимся ли мы в браузере
  if (typeof window === 'undefined') return;
  
  const currentPath = window.location.pathname;
  
  // Проверяем, является ли это путем к товару вида /product/<id> или /product/<id>/
  const productMatch = currentPath.match(/^\/product\/([^\/]+)\/?$/);
  
  if (productMatch) {
    const productId = productMatch[1];
    
    try {
      // Проверяем, существует ли статическая страница
      const staticPageUrl = `/product-${productId}.html`;
      const staticPageResponse = await fetch(staticPageUrl, { method: 'HEAD' });
      
      if (staticPageResponse.ok) {
        console.log(`Redirecting from ${currentPath} to ${staticPageUrl}`);
        window.location.replace(staticPageUrl);
        return;
      }
    } catch (error) {
      console.error('Error checking for static page:', error);
    }
    
    // Если статическая страница не найдена, продолжаем с обычной маршрутизацией
    console.log(`No static page found for ${productId}, using dynamic route`);
  }
}

// Функция для генерации URL статической страницы
export function getStaticPageUrl(productId: string): string | null {
  return `/product-${productId}.html`;
}
