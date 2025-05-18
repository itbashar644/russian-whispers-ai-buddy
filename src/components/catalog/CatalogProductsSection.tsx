
import React from "react";
import { Product } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";
import CatalogActiveFilters from "./CatalogActiveFilters";
import CatalogHeader from "./CatalogHeader";
import ProductsCounter from "./ProductsCounter";
import ProductsLoading from "./ProductsLoading";
import EmptyProductsMessage from "./EmptyProductsMessage";

interface CatalogProductsSectionProps {
  categoryParam: string | null;
  searchTerm: string;
  colorParam: string | null;
  availableCategories: string[];
  loading: boolean;
  filteredProducts: Product[];
  inStockCount: number;
  outOfStockCount: number;
  activeFiltersCount: number;
  sortBy: string;
  handleSearchSubmit: (e: React.FormEvent) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSortBy: (value: string) => void;
  handleCategoryClick: (categoryId: string | null) => void;
  handleColorFilter: (color: string | null) => void;
  handleClearAllFilters: () => void;
}

const CatalogProductsSection: React.FC<CatalogProductsSectionProps> = ({
  categoryParam,
  searchTerm,
  colorParam,
  availableCategories,
  loading,
  filteredProducts,
  outOfStockCount,
  activeFiltersCount,
  sortBy,
  handleSearchSubmit,
  handleSearchChange,
  setSortBy,
  handleCategoryClick,
  handleColorFilter,
  handleClearAllFilters
}) => {
  return (
    <div>
      <CatalogHeader 
        categoryParam={categoryParam}
        searchTerm={searchTerm}
        colorParam={colorParam}
        availableCategories={availableCategories}
        loading={loading}
        sortBy={sortBy}
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
        setSortBy={setSortBy}
      />
      
      <CatalogActiveFilters
        categoryParam={categoryParam}
        colorParam={colorParam}
        searchTerm={searchTerm}
        activeFiltersCount={activeFiltersCount}
        handleCategoryClick={handleCategoryClick}
        handleColorFilter={handleColorFilter}
        handleClearAllFilters={handleClearAllFilters}
      />

      <ProductsCounter 
        totalCount={filteredProducts.length}
        outOfStockCount={outOfStockCount}
      />

      {loading ? (
        <ProductsLoading />
      ) : filteredProducts.length > 0 ? (
        <ProductGrid 
          products={filteredProducts} 
          showAsColorVariants={true}
        />
      ) : (
        <EmptyProductsMessage />
      )}
    </div>
  );
};

export default CatalogProductsSection;
