
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/products/ProductGrid";
import CatalogFilters from "./CatalogFilters";
import CatalogActiveFilters from "./CatalogActiveFiltersProps";
import { SearchForm } from "./SearchForm"; 
import { Category } from "@/types/categories";
import { Product } from "@/types/product";
import { Check, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface CatalogProductsSectionProps {
  products: Product[];
  loading: boolean;
  categoryParam: string | null;
  colorParam: string | null;
  searchTerm: string;
  availableColors: string[];
  availableCategories: Category[];
  inStockCount: number;
  outOfStockCount: number;
  priceRange: { min: number; max: number };
  maxPrice: number;
  sortBy: string;
  inStockOnly: boolean;
  handlePriceChange: (value: { min: number; max: number }) => void;
  handleSortChange: (value: string) => void;
  handleInStockChange: (value: boolean) => void;
  handleCategoryClick: (category: string | null) => void;
  handleColorFilter: (color: string | null) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  handleClearAllFilters: () => void;
}

const CatalogProductsSection: React.FC<CatalogProductsSectionProps> = ({
  products,
  loading,
  categoryParam,
  colorParam,
  searchTerm,
  availableColors,
  availableCategories,
  inStockCount,
  outOfStockCount,
  priceRange,
  maxPrice,
  sortBy,
  inStockOnly,
  handlePriceChange,
  handleSortChange,
  handleInStockChange,
  handleCategoryClick,
  handleColorFilter,
  handleSearchChange,
  handleSearchSubmit,
  handleClearAllFilters
}) => {
  const [showAsList, setShowAsList] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Рассчитываем количество активных фильтров
  const activeFiltersCount = 
    (categoryParam ? 1 : 0) +
    (colorParam ? 1 : 0) +
    (searchTerm ? 1 : 0);
    
  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Наши товары</h2>
          <p className="text-muted-foreground">
            Всего товаров: {products.length}
            {inStockCount > 0 && products.length > 0 && (
              <span>, В наличии: {inStockCount}</span>
            )}
          </p>
        </div>
        
        <SearchForm
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleSearchSubmit={handleSearchSubmit}
          loading={loading}
        />
      </div>
      
      {/* Активные фильтры - показываем только если есть активные фильтры */}
      <CatalogActiveFilters 
        categoryParam={categoryParam}
        colorParam={colorParam}
        searchTerm={searchTerm}
        activeFiltersCount={activeFiltersCount}
        handleCategoryClick={handleCategoryClick}
        handleColorFilter={handleColorFilter}
        handleClearAllFilters={handleClearAllFilters}
      />
      
      {/* Панель фильтров и результатов */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Фильтры для десктопа - скрываем на мобильных */}
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <CatalogFilters
              availableColors={availableColors}
              categories={availableCategories}
              priceRange={priceRange}
              maxPrice={maxPrice}
              sortBy={sortBy}
              inStockOnly={inStockOnly}
              handlePriceChange={handlePriceChange}
              handleSortChange={handleSortChange}
              handleInStockChange={handleInStockChange}
              handleCategoryClick={handleCategoryClick}
              handleColorFilter={handleColorFilter}
              colorParam={colorParam}
              categoryParam={categoryParam}
              loading={loading}
            />
          </div>
        </div>
        
        {/* Мобильная панель с кнопками фильтров и отображения */}
        <div className="flex justify-between items-center lg:hidden mb-2">
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-9">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Фильтры
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
              <div className="py-4">
                <CatalogFilters
                  availableColors={availableColors}
                  categories={availableCategories}
                  priceRange={priceRange}
                  maxPrice={maxPrice}
                  sortBy={sortBy}
                  inStockOnly={inStockOnly}
                  handlePriceChange={handlePriceChange}
                  handleSortChange={handleSortChange}
                  handleInStockChange={handleInStockChange}
                  handleCategoryClick={(catId) => {
                    handleCategoryClick(catId);
                    setIsFiltersOpen(false);
                  }}
                  handleColorFilter={(color) => {
                    handleColorFilter(color);
                    setIsFiltersOpen(false);
                  }}
                  colorParam={colorParam}
                  categoryParam={categoryParam}
                  loading={loading}
                />
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 h-9 ${!showAsList ? 'bg-muted' : ''}`}
              onClick={() => setShowAsList(false)}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 h-9 ${showAsList ? 'bg-muted' : ''}`}
              onClick={() => setShowAsList(true)}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Основной контент с товарами */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="relative border rounded-md overflow-hidden aspect-[3/4]"
                >
                  <div className="w-full h-full bg-gray-100 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Товары не найдены</h3>
              <p className="text-muted-foreground mt-2">
                Попробуйте изменить параметры фильтрации или поискать что-то другое
              </p>
              <Button onClick={handleClearAllFilters} className="mt-4">
                Сбросить все фильтры
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogProductsSection;
