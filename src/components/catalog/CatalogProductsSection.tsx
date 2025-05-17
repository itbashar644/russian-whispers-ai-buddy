
import React, { useState } from "react";
import { Category } from "@/types/categories";
import { Product } from "@/types/product";
import ProductsDisplay from "./catalog-sections/ProductsDisplay";
import CatalogActiveFilters from "./CatalogActiveFiltersProps";
import CatalogHeader from "./catalog-sections/CatalogHeader";
import DesktopFilters from "./catalog-sections/DesktopFilters";
import MobileFiltersPanel from "./catalog-sections/MobileFiltersPanel";

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

const CatalogProductsSection: React.FC<CatalogProductsSectionProps> = (props) => {
  const [showAsList, setShowAsList] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Calculate active filters count
  const activeFiltersCount = 
    (props.categoryParam ? 1 : 0) +
    (props.colorParam ? 1 : 0) +
    (props.searchTerm ? 1 : 0);
    
  return (
    <div className="flex flex-col space-y-6 w-full">
      <CatalogHeader 
        products={props.products}
        inStockCount={props.inStockCount}
        searchTerm={props.searchTerm}
        handleSearchChange={props.handleSearchChange}
        handleSearchSubmit={props.handleSearchSubmit}
        loading={props.loading}
      />
      
      {/* Активные фильтры - показываем только если есть активные фильтры */}
      {activeFiltersCount > 0 && (
        <CatalogActiveFilters 
          categoryParam={props.categoryParam}
          colorParam={props.colorParam}
          searchTerm={props.searchTerm}
          activeFiltersCount={activeFiltersCount}
          handleCategoryClick={props.handleCategoryClick}
          handleColorFilter={props.handleColorFilter}
          handleClearAllFilters={props.handleClearAllFilters}
        />
      )}
      
      {/* Панель фильтров и результатов */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Фильтры для десктопа - скрываем на мобильных */}
        <DesktopFilters 
          availableColors={props.availableColors}
          categories={props.availableCategories}
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
        
        {/* Мобильная панель с кнопками фильтров и отображения */}
        <MobileFiltersPanel 
          activeFiltersCount={activeFiltersCount}
          isFiltersOpen={isFiltersOpen}
          setIsFiltersOpen={setIsFiltersOpen}
          showAsList={showAsList}
          setShowAsList={setShowAsList}
          availableColors={props.availableColors}
          categories={props.availableCategories}
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
        
        {/* Основной контент с товарами */}
        <div className="lg:col-span-3">
          <ProductsDisplay 
            products={props.products}
            loading={props.loading}
            handleClearAllFilters={props.handleClearAllFilters}
            showAsList={showAsList}
          />
        </div>
      </div>
    </div>
  );
};

export default CatalogProductsSection;
