
import React from "react";
import { Category } from "@/types/categories";
import CategoryFilter from "../../filters/CategoryFilter";
import ColorFilter from "../../filters/ColorFilter";
import InStockFilter from "../../filters/InStockFilter";
import PriceFilter from "../../filters/PriceFilter";

interface FiltersSidebarProps {
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

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  availableColors,
  categories,
  priceRange,
  maxPrice,
  sortBy,
  inStockOnly,
  handlePriceChange,
  handleSortChange,
  handleInStockChange,
  handleCategoryClick,
  handleColorFilter,
  colorParam,
  categoryParam,
  loading
}) => {
  return (
    <div className="space-y-6">
      <CategoryFilter 
        categories={categories}
        categoryParam={categoryParam}
        loading={loading}
        handleCategoryClick={handleCategoryClick}
      />
      
      <PriceFilter 
        priceRange={priceRange}
        maxPrice={maxPrice}
        sortBy={sortBy}
        handlePriceChange={handlePriceChange}
        handleSortChange={handleSortChange}
      />
      
      <InStockFilter 
        inStockOnly={inStockOnly}
        handleInStockChange={handleInStockChange}
      />
      
      {availableColors.length > 0 && (
        <ColorFilter 
          colors={availableColors}
          selectedColor={colorParam}
          handleColorSelect={handleColorFilter}
        />
      )}
    </div>
  );
};

export default FiltersSidebar;
