
import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';

const StaticProductRedirect = () => {
  const { filename } = useParams<{ filename: string }>();
  
  // Извлекаем ID из имени файла (product-{uuid}.html -> {uuid})
  const extractProductId = (filename: string): string | null => {
    // Убираем расширение .html и префикс product-
    const match = filename.match(/^product-(.+)\.html$/);
    if (match) {
      const id = match[1];
      // Проверяем, что это валидный UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(id)) {
        return id;
      }
    }
    return null;
  };

  const productId = filename ? extractProductId(filename) : null;

  console.log('Filename:', filename);
  console.log('Extracted product ID:', productId);

  if (!productId) {
    return <Navigate to="/catalog" replace />;
  }

  // Редиректим на правильный роут товара
  return <Navigate to={`/product/${productId}`} replace />;
};

export default StaticProductRedirect;
