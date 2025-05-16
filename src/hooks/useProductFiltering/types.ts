
import { Product } from "@/types/product";

export interface UseProductFilteringProps {
  allProducts: Product[];
  searchTerm: string;
  priceRange: { min: number; max: number };
  sortBy: string;
  loading: boolean;
  colorParam: string | null;
  inStockOnly?: boolean; // Add missing prop as optional
  showColorVariants?: boolean; // Add missing prop as optional
}

export interface FilteringResult {
  filteredProducts: Product[];
  availableColors: string[];
  inStockCount: number;
  outOfStockCount: number;
}
