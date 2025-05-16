
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/categories";
import CategoryFilter from "./filters/CategoryFilter";
import PriceFilter from "./filters/PriceFilter";
import ColorFilter from "./filters/ColorFilter";
import InStockFilter from "./filters/InStockFilter";
import { X } from "lucide-react";

interface CatalogFiltersProps {
  categories: Category[];
  categoryParam: string | null;
  colorParam: string | null;
  priceRange: { min: number; max: number };
  maxPrice: number;
  sortBy: string;
  inStockOnly: boolean;
  loading: boolean;
  availableColors: string[];
  handleCategoryClick: (categoryId: string | null) => void;
  handleColorFilter: (color: string | null) => void;
  handlePriceChange: (value: { min: number; max: number }) => void;
  handleSortChange: (value: string) => void;
  handleInStockChange: (checked: boolean) => void;
}

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  categories,
  categoryParam,
  colorParam,
  priceRange,
  maxPrice,
  sortBy,
  inStockOnly,
  loading,
  availableColors,
  handleCategoryClick,
  handleColorFilter,
  handlePriceChange,
  handleSortChange,
  handleInStockChange
}) => {
  const activeFiltersCount = 
    (categoryParam ? 1 : 0) +
    (colorParam ? 1 : 0) +
    (priceRange.min > 0 || priceRange.max < maxPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (sortBy !== "default" ? 1 : 0);

  // Content of the filters
  const filtersContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Фильтры</h2>
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              handleCategoryClick(null);
              handleColorFilter(null);
              handlePriceChange({ min: 0, max: maxPrice });
              handleInStockChange(false);
              handleSortChange("default");
            }}
            className="h-8 text-xs"
          >
            Сбросить все
          </Button>
        )}
      </div>
      
      <CategoryFilter 
        categories={categories}
        categoryParam={categoryParam}
        loading={loading}
        handleCategoryClick={handleCategoryClick}
      />
      
      <PriceFilter 
        priceRange={priceRange}
        handlePriceChange={handlePriceChange}
        loading={loading}
      />
      
      <ColorFilter 
        availableColors={availableColors}
        colorParam={colorParam}
        handleColorFilter={handleColorFilter}
        loading={loading}
      />

      <InStockFilter 
        inStockOnly={inStockOnly}
        handleInStockChange={handleInStockChange}
        loading={loading}
      />
    </div>
  );

  // Simplified filter display
  return (
    <div className="space-y-6 pb-4">
      {filtersContent}
    </div>
  );
};

export default CatalogFilters;
