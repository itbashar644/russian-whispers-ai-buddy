
import { useState, useEffect, useMemo } from "react";
import { Product } from "@/types/product";
import { 
  transformProductsForColorDisplay,
  filterProducts, 
  sortProducts,
  extractAvailableColors,
  countStockStatus
} from "./helpers";

interface UseProductFilteringProps {
  allProducts: Product[];
  searchTerm: string;
  priceRange: { min: number; max: number };
  inStockOnly: boolean;
  sortBy: string;
  loading: boolean;
  showColorVariants: boolean;
  colorParam: string | null;
  categoryParam?: string | null;
}

export const useProductFiltering = ({
  allProducts,
  searchTerm,
  priceRange,
  inStockOnly,
  sortBy,
  loading,
  showColorVariants,
  colorParam,
  categoryParam
}: UseProductFilteringProps) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Get all available colors from products
  const availableColors = useMemo(() => {
    return extractAvailableColors(allProducts);
  }, [allProducts]);

  // Filter and sort products when parameters change
  useEffect(() => {
    if (loading) return;
    
    let result = [...allProducts];
    
    // Filter by category if category parameter is set
    if (categoryParam) {
      result = result.filter(product => product.category === categoryParam);
    }
    
    // Transform products for color display if needed
    if (showColorVariants) {
      result = transformProductsForColorDisplay(result);
    }
    
    // Apply filters
    result = filterProducts(result, {
      searchTerm,
      priceRange,
      inStockOnly,
      colorParam
    });
    
    // Apply sorting
    result = sortProducts(result, sortBy);
    
    setFilteredProducts(result);
  }, [allProducts, priceRange, searchTerm, inStockOnly, sortBy, loading, showColorVariants, colorParam, categoryParam]);

  // Calculate stock status counts
  const { inStockCount, outOfStockCount } = useMemo(() => {
    return countStockStatus(filteredProducts);
  }, [filteredProducts]);

  return {
    filteredProducts,
    availableColors,
    inStockCount,
    outOfStockCount
  };
};

// Re-export helpers
export * from "./helpers";
