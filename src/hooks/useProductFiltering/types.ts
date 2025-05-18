
import { Product } from "@/types/product";

export interface UseProductFilteringProps {
  allProducts: Product[];
  searchTerm: string;
  priceRange: { min: number; max: number };
  inStockOnly: boolean;
  sortBy: string;
  loading: boolean;
  showColorVariants: boolean;
  colorParam: string | null;
}

export interface FilteringResult {
  filteredProducts: Product[];
  availableColors: string[];
  inStockCount: number;
  outOfStockCount: number;
}
