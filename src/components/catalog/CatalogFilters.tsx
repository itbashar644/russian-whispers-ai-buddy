
import React from "react";
import { Button } from "@/components/ui/button";
import { Category } from "@/data/products/categoryData";
import CategoryFilter from "./filters/CategoryFilter";
import ColorFilter from "./filters/ColorFilter";
import PriceFilter from "./filters/PriceFilter";

interface CatalogFiltersProps {
  availableCategories: string[];
  categoryParam: string | null;
  colorParam: string | null;
  priceRange: { min: number; max: number };
  loading: boolean;
  showMobileFilters: boolean;
  activeFiltersCount: number;
  availableColors: string[];
  handleCategoryClick: (categoryId: string | null) => void;
  handleColorFilter: (color: string | null) => void;
  handlePriceChange: (type: "min" | "max", value: string) => void;
  handleClearAllFilters: () => void;
  findCategoryByName: (name: string) => Category;
}

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  availableCategories,
  categoryParam,
  colorParam,
  priceRange,
  loading,
  showMobileFilters,
  activeFiltersCount,
  availableColors,
  handleCategoryClick,
  handleColorFilter,
  handlePriceChange,
  handleClearAllFilters,
  findCategoryByName,
}) => {
  return (
    <div className={`space-y-6 ${showMobileFilters ? 'block' : 'hidden'} md:block`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Фильтры</h2>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAllFilters}>
            Сбросить все
          </Button>
        )}
      </div>
      
      <div>
        <h3 className="font-semibold mb-4">Категории</h3>
        <CategoryFilter 
          availableCategories={availableCategories}
          categoryParam={categoryParam}
          loading={loading}
          handleCategoryClick={handleCategoryClick}
          findCategoryByName={findCategoryByName}
        />
      </div>

      {/* Color filter */}
      <ColorFilter 
        availableColors={availableColors}
        colorParam={colorParam}
        handleColorFilter={handleColorFilter}
      />

      <PriceFilter 
        priceRange={priceRange}
        handlePriceChange={handlePriceChange}
        loading={loading}
      />
    </div>
  );
};

export default CatalogFilters;
