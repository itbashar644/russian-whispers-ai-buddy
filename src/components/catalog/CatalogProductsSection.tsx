
import React from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/products/ProductGrid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CatalogActiveFilters from "./CatalogActiveFilters";
import { SearchForm } from "./SearchForm";

interface CatalogProductsSectionProps {
  categoryParam: string | null;
  searchTerm: string;
  colorParam: string | null;
  availableCategories: string[];
  loading: boolean;
  filteredProducts: Product[];
  inStockCount: number;
  outOfStockCount: number;
  inStockOnly: boolean;
  activeFiltersCount: number;
  sortBy: string;
  showColorVariants: boolean;
  handleSearchSubmit: (e: React.FormEvent) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSortBy: (value: string) => void;
  handleCategoryClick: (categoryId: string | null) => void;
  handleColorFilter: (color: string | null) => void;
  handleInStockFilter: (checked: boolean) => void;
  handleClearAllFilters: () => void;
}

const CatalogProductsSection: React.FC<CatalogProductsSectionProps> = ({
  categoryParam,
  searchTerm,
  colorParam,
  availableCategories,
  loading,
  filteredProducts,
  inStockCount,
  outOfStockCount,
  inStockOnly,
  activeFiltersCount,
  sortBy,
  showColorVariants,
  handleSearchSubmit,
  handleSearchChange,
  setSortBy,
  handleCategoryClick,
  handleColorFilter,
  handleInStockFilter,
  handleClearAllFilters
}) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          {categoryParam 
            ? availableCategories.includes(categoryParam) ? categoryParam : "Каталог"
            : searchTerm ? `Поиск: ${searchTerm}` : "Каталог товаров"}
          {colorParam && ` / Цвет: ${colorParam}`}
        </h1>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <SearchForm
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            handleSearchSubmit={handleSearchSubmit}
            loading={loading}
          />
          <Select 
            value={sortBy}
            onValueChange={setSortBy}
            disabled={loading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Сортировать по" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-stock">Сначала в наличии</SelectItem>
              <SelectItem value="price-asc">Цена (по возрастанию)</SelectItem>
              <SelectItem value="price-desc">Цена (по убыванию)</SelectItem>
              <SelectItem value="name-asc">Название (А-Я)</SelectItem>
              <SelectItem value="name-desc">Название (Я-А)</SelectItem>
              <SelectItem value="rating">По рейтингу</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active filters display */}
      <CatalogActiveFilters
        categoryParam={categoryParam}
        colorParam={colorParam}
        inStockOnly={inStockOnly}
        searchTerm={searchTerm}
        activeFiltersCount={activeFiltersCount}
        handleCategoryClick={handleCategoryClick}
        handleColorFilter={handleColorFilter}
        handleInStockFilter={handleInStockFilter}
        handleClearAllFilters={handleClearAllFilters}
      />

      {/* Products count */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-sm">
          <span className="font-medium">Всего товаров:</span> {filteredProducts.length}
        </div>
        {/* Removed "В наличии" count display */}
        {outOfStockCount > 0 && !inStockOnly && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Нет в наличии:</span> {outOfStockCount}
          </div>
        )}
      </div>

      {loading ? (
        // Заглушки при загрузке
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className="h-[300px] bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        // Отображение товаров
        <ProductGrid 
          products={filteredProducts} 
          showAsColorVariants={showColorVariants}
        />
      )}
      
      {!loading && filteredProducts.length === 0 && (
        <div className="py-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Товары не найдены</h2>
          <p className="text-muted-foreground">
            Попробуйте изменить параметры фильтрации или поисковый запрос
          </p>
        </div>
      )}
    </div>
  );
};

export default CatalogProductsSection;
