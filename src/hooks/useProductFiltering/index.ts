
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
  colorParam,
  specFilters = {}
}: UseProductFilteringProps): FilteringResult => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Extract smaller hooks for better organization
  const { availableColors } = useFilterOptions(allProducts);
  const { inStockCount, outOfStockCount } = useProductStatistics(filteredProducts);

  // Get all available specifications from products
  const availableSpecifications = useMemo(() => {
    if (!allProducts || !allProducts.length) return {};
    
    const specs: Record<string, Set<string>> = {};
    
    allProducts.forEach(product => {
      if (product.specifications) {
        Object.entries(product.specifications).forEach(([key, value]) => {
          if (!specs[key]) {
            specs[key] = new Set<string>();
          }
          if (value) { // Only add the value if it's not null or empty
            specs[key].add(value);
          }
        });
      }
    });
    
    // Convert sets to arrays
    const result: Record<string, string[]> = {};
    Object.entries(specs).forEach(([key, valueSet]) => {
      result[key] = Array.from(valueSet).filter(Boolean).sort();
    });
    
    return result;
  }, [allProducts]);

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
    
    // Filter by specifications
    if (specFilters && Object.keys(specFilters).length > 0) {
      result = result.filter(product => {
        // If product has no specifications, it doesn't match
        if (!product.specifications) return false;
        
        // Check if product matches all specification filters
        return Object.entries(specFilters).every(([specKey, specValue]) => {
          // Skip empty filter values
          if (!specValue) return true;
          
          return product.specifications?.[specKey]?.toLowerCase() === specValue.toLowerCase();
        });
      });
    }
    
    // Filter by stock status if required
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    
    // Sort products
    result = sortProducts(result, sortBy);
    
    setFilteredProducts(result);
  }, [allProducts, priceRange, searchTerm, inStockOnly, sortBy, loading, showColorVariants, colorParam, specFilters]);

  return {
    filteredProducts,
    availableColors,
    inStockCount,
    outOfStockCount,
    availableSpecifications
  };
};

// Re-export types
export * from "./types";
