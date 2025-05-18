
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

  // Add debug logging to see what's happening with products
  useEffect(() => {
    if (!loading && allProducts.length > 0) {
      console.log(`Products count from API: ${allProducts.length}`);
      
      // Log categories and product counts
      const categories = [...new Set(allProducts.map(p => p.category))];
      console.log(`Categories found: ${categories.join(', ')}`);
      
      // Check each category's product count
      categories.forEach(category => {
        const count = allProducts.filter(p => p.category === category).length;
        console.log(`Category ${category}: ${count} products`);
      });
    }
  }, [allProducts, loading]);

  // Filter and sort products when parameters change
  useEffect(() => {
    if (loading) return;
    
    console.log("Starting product filtering with parameters:", {
      productCount: allProducts.length,
      searchTerm,
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      inStockOnly,
      sortBy,
      colorParam
    });
    
    let result = [...allProducts];
    
    // Debug the original products
    const categories = [...new Set(result.map(p => p.category))];
    console.log(`Original categories: ${categories.join(', ')}`);
    categories.forEach(category => {
      const count = result.filter(p => p.category === category).length;
      console.log(`Category ${category}: ${count} products before filtering`);
    });
    
    // Always transform products for displaying color variants
    result = transformProductsForColorDisplay(result);
    console.log(`Products after transformation: ${result.length}`);
    
    // Filter by color if color parameter is set
    if (colorParam) {
      console.log(`Filtering by color: ${colorParam}`);
      result = result.filter(product => {
        if (product.colorVariants && product.colorVariants.length > 0) {
          return product.colorVariants.some(v => v.color.toLowerCase() === colorParam.toLowerCase());
        }
        return false;
      });
      console.log(`Products after color filtering: ${result.length}`);
    }
    
    // Filter by search term
    if (searchTerm) {
      console.log(`Filtering by search term: ${searchTerm}`);
      result = result.filter(
        (p) => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(`Products after search filtering: ${result.length}`);
    }
    
    // Filter by price range
    result = result.filter(
      (p) => {
        const price = p.discountPrice !== undefined ? p.discountPrice : p.price;
        return price >= priceRange.min && price <= priceRange.max;
      }
    );
    console.log(`Products after price filtering: ${result.length}`);
    
    // Filter by stock status if needed
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
      console.log(`Products after in-stock filtering: ${result.length}`);
    }
    
    // Sort products
    result = sortProducts(result, sortBy);
    
    // Debug the final result by category
    const finalCategories = [...new Set(result.map(p => p.category))];
    console.log(`Final categories: ${finalCategories.join(', ')}`);
    finalCategories.forEach(category => {
      const count = result.filter(p => p.category === category).length;
      console.log(`Category ${category}: ${count} products after all filtering`);
    });
    
    setFilteredProducts(result);
  }, [allProducts, priceRange, searchTerm, inStockOnly, sortBy, loading, showColorVariants, colorParam]);

  // Calculate counts for stock status
  const inStockCount = useMemo(() => {
    return filteredProducts.filter(p => p.inStock).length;
  }, [filteredProducts]);
  
  const outOfStockCount = useMemo(() => {
    return filteredProducts.filter(p => !p.inStock).length;
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
