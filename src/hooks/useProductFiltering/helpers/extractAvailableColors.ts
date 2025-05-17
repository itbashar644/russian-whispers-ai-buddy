
import { Product } from "@/types/product";

export const extractAvailableColors = (products: Product[]): string[] => {
  if (!products || products.length === 0) return [];
  
  const colorSet = new Set<string>();
  
  products.forEach(product => {
    if (product.colorVariants && product.colorVariants.length > 0) {
      product.colorVariants.forEach(variant => {
        colorSet.add(variant.color);
      });
    }
    
    // Also include colors from the colors array if available
    if (product.colors && product.colors.length > 0) {
      product.colors.forEach(color => {
        colorSet.add(color);
      });
    }
  });
  
  return Array.from(colorSet).sort();
};
