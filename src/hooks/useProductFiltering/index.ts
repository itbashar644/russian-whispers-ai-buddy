
import { useState, useEffect, useMemo } from "react";
import { Product } from "@/types/product";
import { UseProductFilteringProps, FilteringResult } from "./types";
import { transformProductsForColorDisplay, sortProducts } from "./helpers";
import { useFilterOptions } from "./useFilterOptions";
import { useProductStatistics } from "./useProductStatistics";

export const useProductFiltering = ({
  allProducts,
  searchTerm,
  priceRange,
  inStockOnly,
  sortBy,
  loading,
  showColorVariants,
  colorParam
}: UseProductFilteringProps): FilteringResult => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Extract smaller hooks for better organization
  const { availableColors } = useFilterOptions(allProducts);
  const { inStockCount, outOfStockCount } = useProductStatistics(filteredProducts);

  // Filter and sort products when parameters change
  useEffect(() => {
    if (loading) return;
    
    let result = [...allProducts];
    
    // Transform products for color display if needed
    if (showColorVariants) {
      result = transformProductsForColorDisplay(result);
    }
    
    // Filter by color if color parameter is set
    if (colorParam) {
      result = result.filter(product => {
        if (product.colorVariants && product.colorVariants.length > 0) {
          return product.colorVariants.some(v => v.color.toLowerCase() === colorParam.toLowerCase());
        }
        return false;
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (p) => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by price range
    result = result.filter(
      (p) => {
        const price = p.discountPrice !== undefined ? p.discountPrice : p.price;
        return price >= priceRange.min && price <= priceRange.max;
      }
    );
    
    // Filter by stock status if required
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    
    // Sort products
    result = sortProducts(result, sortBy);
    
    setFilteredProducts(result);
  }, [allProducts, priceRange, searchTerm, inStockOnly, sortBy, loading, showColorVariants, colorParam]);

  return {
    filteredProducts,
    availableColors,
    inStockCount,
    outOfStockCount
  };
};

// Re-export types
export * from "./types";
