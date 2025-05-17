
import { Product } from "@/types/product";

export const countStockStatus = (products: Product[]) => {
  const inStockCount = products.filter(p => p.inStock).length;
  const outOfStockCount = products.filter(p => !p.inStock).length;
  
  return { inStockCount, outOfStockCount };
};
