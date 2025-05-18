
import { useMemo } from "react";
import { Product } from "@/types/product";

export const useProductStatistics = (filteredProducts: Product[]) => {
  // Count in-stock products
  const inStockCount = useMemo(() => {
    return filteredProducts.filter(p => p.inStock).length;
  }, [filteredProducts]);
  
  // Count out-of-stock products
  const outOfStockCount = useMemo(() => {
    return filteredProducts.filter(p => !p.inStock).length;
  }, [filteredProducts]);

  return { inStockCount, outOfStockCount };
};
