
import { Product } from "@/types/product";

export interface UseProductFilteringProps {
  allProducts: Product[];
  searchTerm: string;
  priceRange: { min: number; max: number };
  sortBy: string;
  loading: boolean;
  colorParam: string | null;
  inStockOnly: boolean; // Changed from optional to required
  showColorVariants: boolean; // Changed from optional to required
}

export interface FilteringResult {
  filteredProducts: Product[];
  availableColors: string[];
  inStockCount: number;
  outOfStockCount: number;
}
