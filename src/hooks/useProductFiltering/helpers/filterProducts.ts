
import { Product } from "@/types/product";

/**
 * Filters products based on search term, price range, color, etc.
 */
export const filterProducts = (
  products: Product[], 
  options: {
    searchTerm?: string;
    priceRange?: { min: number; max: number };
    inStockOnly?: boolean;
    colorParam?: string | null;
  }
): Product[] => {
  const { searchTerm, priceRange, inStockOnly, colorParam } = options;
  let result = [...products];
  
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
  if (priceRange) {
    result = result.filter(
      (p) => {
        const price = p.discountPrice || p.price;
        return price >= priceRange.min && price <= priceRange.max;
      }
    );
  }
  
  // Filter by stock availability
  if (inStockOnly) {
    result = result.filter((p) => p.inStock);
  }
  
  return result;
};

/**
 * Extracts all available colors from the products
 */
export const extractAvailableColors = (products: Product[]): string[] => {
  if (!products.length) return [];
  
  const colorSet = new Set<string>();
  
  products.forEach(product => {
    if (product.colorVariants && product.colorVariants.length > 0) {
      product.colorVariants.forEach(variant => {
        colorSet.add(variant.color);
      });
    } else if (product.colors && product.colors.length > 0) {
      product.colors.forEach(color => colorSet.add(color));
    }
  });
  
  return Array.from(colorSet).sort();
};

/**
 * Counts in-stock and out-of-stock products
 */
export const countStockStatus = (products: Product[]): { inStockCount: number; outOfStockCount: number } => {
  const inStockCount = products.filter(p => p.inStock).length;
  const outOfStockCount = products.filter(p => !p.inStock).length;
  
  return { inStockCount, outOfStockCount };
};
