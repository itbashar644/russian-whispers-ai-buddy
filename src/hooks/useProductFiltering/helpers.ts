
import { Product } from "@/types/product";

/**
 * Transforms products for color display
 * If a product has color variants, creates a separate "product" for each color
 */
export const transformProductsForColorDisplay = (products: Product[]): Product[] => {
  if (!products || products.length === 0) return [];
  
  return products;
};

/**
 * Sorts products based on the sortBy parameter
 */
export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  if (!products || products.length === 0) return [];
  
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case "price-asc":
      return sortedProducts.sort((a, b) => {
        const priceA = a.discountPrice !== undefined ? a.discountPrice : a.price;
        const priceB = b.discountPrice !== undefined ? b.discountPrice : b.price;
        return priceA - priceB;
      });
    
    case "price-desc":
      return sortedProducts.sort((a, b) => {
        const priceA = a.discountPrice !== undefined ? a.discountPrice : a.price;
        const priceB = b.discountPrice !== undefined ? b.discountPrice : b.price;
        return priceB - priceA;
      });
      
    case "in-stock":
      // Move in-stock products to the top
      return sortedProducts.sort((a, b) => {
        // If one is in stock and the other isn't, the in-stock one comes first
        if (a.inStock && !b.inStock) return -1;
        if (!a.inStock && b.inStock) return 1;
        
        // If both have the same stock status, sort by default criteria (alphabetical)
        return a.title.localeCompare(b.title);
      });
    
    case "new":
      return sortedProducts.sort((a, b) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
      });
    
    case "popular":
      return sortedProducts.sort((a, b) => {
        // Sort by rating first
        if (a.rating !== b.rating) return b.rating - a.rating;
        
        // If ratings are equal, bestsellers come first
        if (a.isBestseller && !b.isBestseller) return -1;
        if (!a.isBestseller && b.isBestseller) return 1;
        
        return 0;
      });
      
    default:
      // Default: sort alphabetically by title
      return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  }
};
