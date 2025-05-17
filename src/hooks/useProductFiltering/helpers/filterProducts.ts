
import { Product } from "@/types/product";

interface FilterOptions {
  searchTerm?: string;
  priceRange?: { min: number; max: number };
  inStockOnly?: boolean;
  colorParam?: string | null;
}

export const filterProducts = (products: Product[], options: FilterOptions): Product[] => {
  const { searchTerm, priceRange, inStockOnly, colorParam } = options;
  
  return products.filter(product => {
    // Filter by color if color parameter is set
    if (colorParam) {
      const hasColor = product.colorVariants?.some(v => 
        v.color.toLowerCase() === colorParam.toLowerCase()
      );
      if (!hasColor) return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
    
    // Filter by price range
    if (priceRange) {
      const price = product.discountPrice || product.price;
      if (price < priceRange.min || price > priceRange.max) return false;
    }
    
    // Filter by stock availability
    if (inStockOnly && !product.inStock) return false;
    
    // Product passed all filters
    return true;
  });
};
