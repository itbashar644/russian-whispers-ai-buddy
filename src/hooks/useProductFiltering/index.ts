
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { UseProductFilteringProps, FilteringResult } from "./types";
import { transformProductsForColorDisplay, sortProducts } from "./helpers";
import { useAvailableColors } from "./useAvailableColors";
import { useStockCounts } from "./useStockCounts";

export const useProductFiltering = ({
  allProducts,
  searchTerm,
  priceRange,
  sortBy,
  loading,
  colorParam
}: UseProductFilteringProps): FilteringResult => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Get all available colors from products
  const availableColors = useAvailableColors(allProducts);

  // Filter and sort products when parameters change
  useEffect(() => {
    if (loading) return;
    
    let result = [...allProducts];
    
    // Always transform products for color display
    result = transformProductsForColorDisplay(result);
    
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
        const price = p.discountPrice || p.price;
        return price >= priceRange.min && price <= priceRange.max;
      }
    );
    
    // Sort products
    result = sortProducts(result, sortBy);
    
    setFilteredProducts(result);
  }, [allProducts, priceRange, searchTerm, sortBy, loading, colorParam]);

  // Calculate counts for stock status using stockQuantity for accuracy
  const { inStockCount, outOfStockCount } = useStockCounts(filteredProducts);

  return {
    filteredProducts,
    availableColors,
    inStockCount,
    outOfStockCount
  };
};

// Re-export types
export * from "./types";
