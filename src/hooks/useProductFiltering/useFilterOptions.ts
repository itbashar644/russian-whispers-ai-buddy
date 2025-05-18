
import { useMemo } from "react";
import { Product } from "@/types/product";

export const useFilterOptions = (allProducts: Product[]) => {
  // Get all available colors from products
  const availableColors = useMemo(() => {
    if (!allProducts || !allProducts.length) return [];
    
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

  return { availableColors };
};
