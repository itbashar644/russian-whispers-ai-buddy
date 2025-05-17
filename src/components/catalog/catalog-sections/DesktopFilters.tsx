
import React from "react";
import { Category } from "@/types/categories";
import FiltersSidebar from "./filters/FiltersSidebar";

interface DesktopFiltersProps {
  availableColors: string[];
  categories: Category[];
  priceRange: { min: number; max: number };
  maxPrice: number;
  sortBy: string;
  inStockOnly: boolean;
  handlePriceChange: (value: { min: number; max: number }) => void;
  handleSortChange: (value: string) => void;
  handleInStockChange: (value: boolean) => void;
  handleCategoryClick: (category: string | null) => void;
  handleColorFilter: (color: string | null) => void;
  colorParam: string | null;
  categoryParam: string | null;
  loading: boolean;
}

const DesktopFilters: React.FC<DesktopFiltersProps> = (props) => {
  return (
    <aside className="hidden lg:block">
      <FiltersSidebar {...props} />
    </aside>
  );
};

export default DesktopFilters;
