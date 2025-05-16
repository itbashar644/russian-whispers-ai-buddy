
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Category } from "@/data/products/categoryData";
import CategoryFilter from "./filters/CategoryFilter";
import PriceFilter from "./filters/PriceFilter";
import ColorFilter from "./filters/ColorFilter";
import InStockFilter from "./filters/InStockFilter";
import DisplayOptions from "./filters/DisplayOptions";
import { X } from "lucide-react";

interface CatalogFiltersProps {
  availableCategories: string[];
  categoryParam: string | null;
  colorParam: string | null;
  priceRange: { min: number; max: number };
  loading: boolean;
  showMobileFilters: boolean;
  activeFiltersCount: number;
  availableColors: string[];
  inStockOnly: boolean;
  inStockCount: number;
  showColorVariants: boolean;
  handleCategoryClick: (categoryId: string | null) => void;
  handleColorFilter: (color: string | null) => void;
  handlePriceChange: (type: "min" | "max", value: string) => void;
  handleClearAllFilters: () => void;
  findCategoryByName: (name: string) => Category;
  handleInStockFilter: (checked: boolean) => void;
  setShowColorVariants: (show: boolean) => void;
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
  inStockOnly,
  inStockCount,
  showColorVariants,
  handleCategoryClick,
  handleColorFilter,
  handlePriceChange,
  handleClearAllFilters,
  findCategoryByName,
  handleInStockFilter,
  setShowColorVariants
}) => {
  // Content of the filters
  const filtersContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Фильтры</h2>
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearAllFilters}
            className="h-8 text-xs"
          >
            Сбросить все
          </Button>
        )}
      </div>
      
      <CategoryFilter 
        availableCategories={availableCategories}
        categoryParam={categoryParam}
        loading={loading}
        handleCategoryClick={handleCategoryClick}
        findCategoryByName={findCategoryByName}
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
      />

      <InStockFilter 
        inStockOnly={inStockOnly}
        inStockCount={inStockCount}
        handleInStockFilter={handleInStockFilter}
        loading={loading}
      />

      <DisplayOptions 
        showColorVariants={showColorVariants}
        setShowColorVariants={setShowColorVariants}
        loading={loading}
      />
    </div>
  );

  // Responsive filter display
  return (
    <>
      {/* Mobile filters */}
      <Sheet open={showMobileFilters}>
        <SheetContent side="left" className="w-[80vw] sm:w-[350px]">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Фильтры</h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => showMobileFilters = false}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="overflow-auto flex-1">
              {filtersContent}
            </div>
            
            <div className="pt-6 border-t mt-6">
              <Button onClick={() => showMobileFilters = false} className="w-full">
                Применить фильтры
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Desktop filters */}
      <div className="hidden md:block sticky top-24">
        {filtersContent}
      </div>
    </>
  );
};

export default CatalogFilters;
