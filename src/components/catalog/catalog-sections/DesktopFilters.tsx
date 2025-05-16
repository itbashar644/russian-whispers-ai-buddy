
import React from "react";
import { Category } from "@/types/categories";
import CatalogFilters from "../CatalogFilters";

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
    <div className="hidden lg:block">
      <div className="sticky top-20">
        <CatalogFilters
          availableColors={props.availableColors}
          categories={props.categories}
          priceRange={props.priceRange}
          maxPrice={props.maxPrice}
          sortBy={props.sortBy}
          inStockOnly={props.inStockOnly}
          handlePriceChange={props.handlePriceChange}
          handleSortChange={props.handleSortChange}
          handleInStockChange={props.handleInStockChange}
          handleCategoryClick={props.handleCategoryClick}
          handleColorFilter={props.handleColorFilter}
          colorParam={props.colorParam}
          categoryParam={props.categoryParam}
          loading={props.loading}
        />
      </div>
    </div>
  );
};

export default DesktopFilters;
