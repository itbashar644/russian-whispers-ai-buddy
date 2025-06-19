
import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';

const StaticProductRedirect = () => {
  const { filename } = useParams<{ filename: string }>();
  
  // Извлекаем ID из имени файла (product-{id}.html -> {id})
  const extractProductId = (filename: string): string | null => {
    const match = filename.match(/^product-(.+)\.html$/);
    return match ? match[1] : null;
  };

  const productId = filename ? extractProductId(filename) : null;

  if (!productId) {
    return <Navigate to="/catalog" replace />;
  }

  // Редиректим на правильный роут товара
  return <Navigate to={`/product/${productId}`} replace />;
};

export default StaticProductRedirect;
