
import { useState, useEffect, useMemo } from 'react';
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
  // Use useMemo instead of useState + useEffect for more efficient filtering
  return useMemo(() => {
    if (!categoryParam) {
      return products;
    }
    
    // Filter products by category
    return products.filter(product => 
      product.category === categoryParam
    );
  }, [products, categoryParam]);
};
