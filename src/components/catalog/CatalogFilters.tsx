
import React from "react";
import { Button } from "@/components/ui/button";
import { Category } from "@/data/products/categoryData";
import CategoryFilter from "./filters/CategoryFilter";
import ColorFilter from "./filters/ColorFilter";
import InStockFilter from "./filters/InStockFilter";
import PriceFilter from "./filters/PriceFilter";
import DisplayOptions from "./filters/DisplayOptions";

interface CatalogFiltersProps {
  availableCategories: string[];
  categoryParam: string | null;
  colorParam: string | null;
  inStockOnly: boolean;
  priceRange: { min: number; max: number };
  showColorVariants: boolean;
  loading: boolean;
  showMobileFilters: boolean;
  activeFiltersCount: number;
  availableColors: string[];
  inStockCount: number;
  handleCategoryClick: (categoryId: string | null) => void;
  handleColorFilter: (color: string | null) => void;
  handleInStockFilter: (checked: boolean) => void;
  handlePriceChange: (type: "min" | "max", value: string) => void;
  handleClearAllFilters: () => void;
  findCategoryByName: (name: string) => Category;
  setShowColorVariants: (show: boolean) => void;
}

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  availableCategories,
  categoryParam,
  colorParam,
  inStockOnly,
  priceRange,
  showColorVariants,
  loading,
  showMobileFilters,
  activeFiltersCount,
  availableColors,
  inStockCount,
  handleCategoryClick,
  handleColorFilter,
  handleInStockFilter,
  handlePriceChange,
  handleClearAllFilters,
  findCategoryByName,
  setShowColorVariants
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
      
      {/* Filters for availability */}
      <InStockFilter 
        inStockOnly={inStockOnly}
        inStockCount={inStockCount}
        handleInStockFilter={handleInStockFilter}
        loading={loading}
      />

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

      <DisplayOptions 
        showColorVariants={showColorVariants}
        setShowColorVariants={setShowColorVariants}
        loading={loading}
      />
    </div>
  );
};

export default CatalogFilters;
