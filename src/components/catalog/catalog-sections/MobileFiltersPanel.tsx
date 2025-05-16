
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";
import { Category } from "@/types/categories";
import CatalogFilters from "../CatalogFilters";
import DisplayOptions from "../filters/DisplayOptions";

interface MobileFiltersPanelProps {
  activeFiltersCount: number;
  isFiltersOpen: boolean;
  setIsFiltersOpen: (open: boolean) => void;
  showAsList: boolean;
  setShowAsList: (showAsList: boolean) => void;
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

const MobileFiltersPanel: React.FC<MobileFiltersPanelProps> = (props) => {
  return (
    <div className="flex justify-between items-center lg:hidden mb-2">
      <Sheet open={props.isFiltersOpen} onOpenChange={props.setIsFiltersOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="h-9">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Фильтры
            {props.activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {props.activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
          <div className="py-4">
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
              handleCategoryClick={(catId) => {
                props.handleCategoryClick(catId);
                props.setIsFiltersOpen(false);
              }}
              handleColorFilter={(color) => {
                props.handleColorFilter(color);
                props.setIsFiltersOpen(false);
              }}
              colorParam={props.colorParam}
              categoryParam={props.categoryParam}
              loading={props.loading}
            />
          </div>
        </SheetContent>
      </Sheet>
      
      <DisplayOptions 
        showAsList={props.showAsList} 
        setShowAsList={props.setShowAsList} 
      />
    </div>
  );
};

export default MobileFiltersPanel;
