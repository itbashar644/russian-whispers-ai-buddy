
import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface CatalogActiveFiltersProps {
  categoryParam: string | null;
  colorParam: string | null;
  inStockOnly: boolean;
  searchTerm: string;
  activeFiltersCount: number;
  handleCategoryClick: (categoryId: string | null) => void;
  handleColorFilter: (color: string | null) => void;
  handleInStockFilter: (checked: boolean) => void;
  handleClearAllFilters: () => void;
}

const CatalogActiveFilters: React.FC<CatalogActiveFiltersProps> = ({
  categoryParam,
  colorParam,
  inStockOnly,
  searchTerm,
  activeFiltersCount,
  handleCategoryClick,
  handleColorFilter,
  handleInStockFilter,
  handleClearAllFilters
}) => {
  if (activeFiltersCount === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categoryParam && (
        <Badge 
          variant="secondary" 
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => handleCategoryClick(null)}
        >
          Категория: {categoryParam} <X className="h-3 w-3" />
        </Badge>
      )}
      
      {colorParam && (
        <Badge 
          variant="secondary" 
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => handleColorFilter(null)}
        >
          Цвет: {colorParam} <X className="h-3 w-3" />
        </Badge>
      )}
      
      {inStockOnly && (
        <Badge 
          variant="secondary" 
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => handleInStockFilter(false)}
        >
          Только в наличии <X className="h-3 w-3" />
        </Badge>
      )}
      
      {searchTerm && (
        <Badge 
          variant="secondary" 
          className="flex items-center gap-1 cursor-pointer"
        >
          Поиск: {searchTerm} <X className="h-3 w-3" />
        </Badge>
      )}
      
      {activeFiltersCount > 1 && (
        <Badge 
          variant="outline" 
          className="flex items-center gap-1 cursor-pointer"
          onClick={handleClearAllFilters}
        >
          Сбросить все <X className="h-3 w-3" />
        </Badge>
      )}
    </div>
  );
};

export default CatalogActiveFilters;
