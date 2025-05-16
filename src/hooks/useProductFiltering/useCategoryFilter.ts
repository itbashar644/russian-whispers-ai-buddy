
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';

/**
 * Hook for filtering products by category
 * 
 * @param products Array of all products
 * @param categoryParam Category parameter from URL query
 * @returns Array of products filtered by category
 */
export const useCategoryFilter = (
  products: Product[], 
  categoryParam: string | null
): Product[] => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  
  useEffect(() => {
    if (!categoryParam) {
      setFilteredProducts(products);
      return;
    }
    
    // Filter products by category
    const filtered = products.filter(product => 
      product.category === categoryParam
    );
    
    setFilteredProducts(filtered);
  }, [products, categoryParam]);
  
  return filteredProducts;
};
