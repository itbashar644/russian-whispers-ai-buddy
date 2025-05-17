
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
    
  // Destructure props for clarity
  const {
    products,
    loading,
    categoryParam,
    colorParam,
    searchTerm,
    availableColors,
    availableCategories,
    inStockCount,
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
  } = props;
    
  return (
    <div className="flex flex-col space-y-6 w-full">
      <CatalogHeader 
        products={products}
        inStockCount={inStockCount}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
        loading={loading}
      />
      
      {/* Show active filters only when there are active filters */}
      {activeFiltersCount > 0 && (
        <CatalogActiveFilters 
          categoryParam={categoryParam}
          colorParam={colorParam}
          searchTerm={searchTerm}
          activeFiltersCount={activeFiltersCount}
          handleCategoryClick={handleCategoryClick}
          handleColorFilter={handleColorFilter}
          handleClearAllFilters={handleClearAllFilters}
        />
      )}
      
      {/* Filters and results panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop filters - hidden on mobile */}
        <DesktopFilters 
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
        
        {/* Mobile filters panel */}
        <MobileFiltersPanel 
          activeFiltersCount={activeFiltersCount}
          isFiltersOpen={isFiltersOpen}
          setIsFiltersOpen={setIsFiltersOpen}
          showAsList={showAsList}
          setShowAsList={setShowAsList}
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
        
        {/* Main content with products */}
        <div className="lg:col-span-3">
          <ProductsDisplay 
            products={products}
            loading={loading}
            handleClearAllFilters={handleClearAllFilters}
            showAsList={showAsList}
          />
        </div>
      </div>
    </div>
  );
};

export default CatalogProductsSection;
