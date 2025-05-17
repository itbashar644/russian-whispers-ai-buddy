
import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import DisplayOptions from "../filters/DisplayOptions";
import FiltersSidebar from "./filters/FiltersSidebar";
import { Category } from "@/types/categories";

interface MobileFiltersPanelProps {
  activeFiltersCount: number;
  isFiltersOpen: boolean;
  setIsFiltersOpen: (isOpen: boolean) => void;
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

const MobileFiltersPanel: React.FC<MobileFiltersPanelProps> = ({
  activeFiltersCount,
  isFiltersOpen,
  setIsFiltersOpen,
  showAsList,
  setShowAsList,
  ...filterProps
}) => {
  return (
    <div className="lg:hidden sticky top-16 z-30 bg-background border-b mb-4 -mx-4 px-4 py-3 flex items-center justify-between">
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setIsFiltersOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span>Фильтры</span>
        {activeFiltersCount > 0 && (
          <span className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs">
            {activeFiltersCount}
          </span>
        )}
      </Button>
      
      <DisplayOptions showAsList={showAsList} setShowAsList={setShowAsList} />
      
      <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Фильтры</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <FiltersSidebar {...filterProps} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileFiltersPanel;
