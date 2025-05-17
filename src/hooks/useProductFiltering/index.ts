
import { useState, useEffect, useMemo } from "react";
import { Product } from "@/types/product";
import { UseProductFilteringProps, FilteringResult } from "./types";
import { transformProductsForColorDisplay, sortProducts } from "./helpers";

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

  // Get all available colors from products
  const availableColors = useMemo(() => {
    if (!allProducts.length) return [];
    
    const colorSet = new Set<string>();
    
    allProducts.forEach(product => {
      if (product.colorVariants && product.colorVariants.length > 0) {
        product.colorVariants.forEach(variant => {
          colorSet.add(variant.color);
        });
      }
    });
    
    return Array.from(colorSet).sort();
  }, [allProducts]);

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
  const inStockCount = useMemo(() => {
    return filteredProducts.filter(p => {
      if (p.stockQuantity !== undefined) {
        return p.stockQuantity > 0;
      }
      return p.inStock;
    }).length;
  }, [filteredProducts]);
  
  const outOfStockCount = useMemo(() => {
    return filteredProducts.filter(p => {
      if (p.stockQuantity !== undefined) {
        return p.stockQuantity <= 0;
      }
      return !p.inStock;
    }).length;
  }, [filteredProducts]);

  return {
    filteredProducts,
    availableColors,
    inStockCount,
    outOfStockCount
  };
};

// Re-export types
export * from "./types";
