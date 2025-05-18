
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
    
    // Debug the original data
    console.log("Filtering products, original count:", result.length);
    const categoryCountBefore = {};
    [...new Set(result.map(p => p.category))].forEach(category => {
      categoryCountBefore[category] = result.filter(p => p.category === category).length;
    });
    console.log("Categories before filtering:", categoryCountBefore);
    
    // Always transform products for color display
    result = transformProductsForColorDisplay(result);
    console.log("Products after transformation:", result.length);
    
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
    
    // Filter by stock status if needed
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    
    // Sort products
    result = sortProducts(result, sortBy);
    
    // Debug the final result
    const categoryCountAfter = {};
    [...new Set(result.map(p => p.category))].forEach(category => {
      categoryCountAfter[category] = result.filter(p => p.category === category).length;
    });
    console.log("Categories after filtering:", categoryCountAfter);
    
    setFilteredProducts(result);
  }, [allProducts, priceRange, searchTerm, inStockOnly, sortBy, loading, showColorVariants, colorParam]);

  // Calculate counts for stock status
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
