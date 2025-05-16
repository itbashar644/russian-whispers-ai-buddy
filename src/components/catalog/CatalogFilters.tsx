
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PackageCheck, Palette, X } from "lucide-react";
import { Category } from "@/data/products/categoryData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <PackageCheck className="h-4 w-4" />
          Наличие
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="in-stock" 
                checked={inStockOnly} 
                onCheckedChange={(checked) => handleInStockFilter(checked === true)}
                disabled={loading}
              />
              <label
                htmlFor="in-stock"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Только в наличии
              </label>
            </div>
            
            <Badge variant="outline">{inStockCount}</Badge>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Категории</h3>
        <div className="space-y-2">
          <Button
            variant={!categoryParam ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => handleCategoryClick(null)}
            disabled={loading}
          >
            Все товары
          </Button>
          {loading ? (
            // Заглушки при загрузке
            Array.from({length: 5}).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
            ))
          ) : (
            // Список категорий
            availableCategories.map((category) => {
              const categoryObj = findCategoryByName(category);
              return (
                <Button
                  key={category}
                  variant={categoryParam === category ? "default" : "outline"}
                  className="w-full justify-start flex items-center"
                  onClick={() => handleCategoryClick(category)}
                >
                  <span className="w-4 h-4 mr-2 overflow-hidden flex-shrink-0">
                    <img 
                      src={categoryObj.imageUrl} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                      alt=""
                    />
                  </span>
                  <span>{category}</span>
                </Button>
              );
            })
          )}
        </div>
      </div>

      {/* Color filter */}
      {availableColors.length > 0 && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Цвета</h3>
            {colorParam && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleColorFilter(null)}
                className="h-6 text-xs"
              >
                Сбросить
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableColors.map(color => (
              <TooltipProvider key={color}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={colorParam === color ? "default" : "outline"}
                      size="sm"
                      className="px-2 py-1 h-auto text-xs"
                      onClick={() => handleColorFilter(color)}
                    >
                      <span className="w-3 h-3 mr-1.5 rounded-full" style={{ 
                        backgroundColor: color.toLowerCase() !== 'белый' ? color.toLowerCase() : '#ffffff',
                        border: color.toLowerCase() === 'белый' ? '1px solid #ccc' : 'none' 
                      }}></span>
                      {color}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    товаров
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}

      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Цена</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="min-price">От</Label>
            <Input
              id="min-price"
              type="number"
              value={priceRange.min}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              min={0}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="max-price">До</Label>
            <Input
              id="max-price"
              type="number"
              value={priceRange.max}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              min={0}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Отображение</h3>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="show-colors" 
            checked={showColorVariants} 
            onCheckedChange={() => setShowColorVariants(!showColorVariants)} 
            disabled={loading}
          />
          <label
            htmlFor="show-colors"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
          >
            <Palette className="h-4 w-4 mr-1.5" />
            Показывать цвета отдельно
          </label>
        </div>
      </div>
    </div>
  );
};

export default CatalogFilters;
