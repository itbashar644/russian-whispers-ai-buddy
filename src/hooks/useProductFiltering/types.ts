
import { Product } from "@/types/product";

export interface UseProductFilteringProps {
  allProducts: Product[];
  searchTerm: string;
  priceRange: { min: number; max: number };
  sortBy: string;
  loading: boolean;
  colorParam: string | null;
  categoryParam: string | null;
  inStockOnly: boolean;
  showColorVariants: boolean;
}

export interface FilteringResult {
  filteredProducts: Product[];
  availableColors: string[];
  inStockCount: number;
  outOfStockCount: number;
}
