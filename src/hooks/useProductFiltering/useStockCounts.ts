
import { useMemo } from "react";
import { Product } from "@/types/product";

/**
 * Hook to calculate in-stock and out-of-stock counts
 */
export const useStockCounts = (products: Product[]) => {
  const inStockCount = useMemo(() => {
    return products.filter(p => {
      if (p.stockQuantity !== undefined) {
        return p.stockQuantity > 0;
      }
      return p.inStock;
    }).length;
  }, [products]);
  
  const outOfStockCount = useMemo(() => {
    return products.filter(p => {
      if (p.stockQuantity !== undefined) {
        return p.stockQuantity <= 0;
      }
      return !p.inStock;
    }).length;
  }, [products]);

  return { inStockCount, outOfStockCount };
};
