
import React from "react";
import { Category } from "@/types/categories";
import CategoryFilter from "../filters/CategoryFilter";
import PriceFilter from "../filters/PriceFilter";
import ColorFilter from "../filters/ColorFilter";
import InStockFilter from "../filters/InStockFilter";
import DisplayOptions from "../filters/DisplayOptions";

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
    <div className="hidden lg:block lg:col-span-1 space-y-6">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Фильтры</h2>
        
        <CategoryFilter 
          categories={props.categories}
          categoryParam={props.categoryParam}
          loading={props.loading}
          handleCategoryClick={props.handleCategoryClick}
        />
        
        <PriceFilter 
          priceRange={props.priceRange}
          handlePriceChange={props.handlePriceChange}
          loading={props.loading}
        />
        
        <ColorFilter 
          availableColors={props.availableColors}
          colorParam={props.colorParam}
          handleColorFilter={props.handleColorFilter}
          loading={props.loading}
        />

        <InStockFilter 
          inStockOnly={props.inStockOnly}
          handleInStockChange={props.handleInStockChange}
          loading={props.loading}
        />

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Отображение</h3>
          <DisplayOptions 
            showColorVariants={props.inStockOnly}
            setShowColorVariants={props.handleInStockChange}
            loading={props.loading}
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopFilters;
