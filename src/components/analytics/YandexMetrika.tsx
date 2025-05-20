
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/utils/metrika';

/**
 * Компонент для отслеживания переходов между страницами с помощью Яндекс.Метрики
 */
const YandexMetrika = () => {
  const location = useLocation();
  const prevPath = useRef<string>(location.pathname);

  useEffect(() => {
    // При изменении пути отслеживаем просмотр страницы
    if (prevPath.current !== location.pathname) {
      trackPageView(location.pathname + location.search, {
        title: document.title
      });
      prevPath.current = location.pathname;
      
      // Для отладки
      console.log('Tracked page view:', location.pathname + location.search);
    }
  }, [location.pathname, location.search]);

  // Также отслеживаем просмотр страницы при первичной загрузке
  useEffect(() => {
    trackPageView(location.pathname + location.search, {
      title: document.title
    });
    // Для отладки
    console.log('Initial page view tracked:', location.pathname + location.search);
  }, []);

  return null; // Компонент не рендерит никакого UI
};

export default YandexMetrika;
