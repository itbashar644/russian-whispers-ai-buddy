
import { Product } from "@/types/product";

export interface UseProductFilteringProps {
  allProducts: Product[];
  searchTerm: string;
  priceRange: { min: number; max: number };
  sortBy: string;
  loading: boolean;
  colorParam: string | null;
  inStockOnly?: boolean; // Опциональный параметр для фильтрации по наличию
  showColorVariants?: boolean; // Опциональный параметр для отображения цветовых вариантов
}

export interface FilteringResult {
  filteredProducts: Product[];
  availableColors: string[];
  inStockCount: number;
  outOfStockCount: number;
}
