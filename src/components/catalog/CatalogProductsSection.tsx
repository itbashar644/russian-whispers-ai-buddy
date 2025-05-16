
import React from "react";
import { Product } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";
import { Category } from "@/data/products/categoryData";
import { Skeleton } from "@/components/ui/skeleton";
import SearchForm from "./SearchForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CatalogActiveFilters from "./CatalogActiveFilters";
import { useToast } from "@/hooks/use-toast";

interface CatalogProductsSectionProps {
  categoryParam: string | null;
  searchTerm: string;
  colorParam: string | null;
  availableCategories: Category[];
  loading: boolean;
  filteredProducts: Product[];
  inStockCount: number;
  activeFiltersCount: number;
  sortBy: string;
  handleSearchSubmit: (e: React.FormEvent) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSortBy: (value: string) => void;
  handleCategoryClick: (category: string | null) => void;
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
  inStockCount,
  activeFiltersCount,
  sortBy,
  handleSearchSubmit,
  handleSearchChange,
  setSortBy,
  handleCategoryClick,
  handleColorFilter,
  handleClearAllFilters,
}) => {
  const { toast } = useToast();

  // Get active category name
  const activeCategoryName = categoryParam 
    ? availableCategories.find((c) => c.id === categoryParam)?.name 
    : null;

  // Filtering and count summary
  const getCatalogTitle = () => {
    if (loading) return (
      <Skeleton className="h-8 w-60" />
    );

    if (activeCategoryName) {
      return (
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {activeCategoryName}
        </h1>
      );
    }

    return (
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        Каталог товаров
      </h1>
    );
  };

  // Filter and sorting controls
  const getFilterControls = () => (
    <div className="flex justify-between flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <SearchForm 
          searchTerm={searchTerm} 
          handleSearchChange={handleSearchChange} 
          handleSearchSubmit={handleSearchSubmit}
        />
      </div>
      
      <div className="w-auto md:w-[200px]">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Сортировать по" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in-stock">В наличии</SelectItem>
            <SelectItem value="price-asc">По возрастанию цены</SelectItem>
            <SelectItem value="price-desc">По убыванию цены</SelectItem>
            <SelectItem value="name-asc">По названию (А-Я)</SelectItem>
            <SelectItem value="name-desc">По названию (Я-А)</SelectItem>
            <SelectItem value="rating">По рейтингу</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="pt-4">
      {getCatalogTitle()}
      
      {!loading && (
        <div className="text-sm text-muted-foreground mb-2">
          Всего товаров: <strong>{filteredProducts.length}</strong>{" "}
          ({inStockCount} в наличии)
        </div>
      )}
      
      {activeFiltersCount > 0 && (
        <CatalogActiveFilters 
          categoryParam={categoryParam}
          colorParam={colorParam}
          activeFiltersCount={activeFiltersCount}
          availableCategories={availableCategories}
          handleCategoryClick={handleCategoryClick}
          handleColorFilter={handleColorFilter}
          handleClearAllFilters={handleClearAllFilters}
        />
      )}
      
      {getFilterControls()}
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">
            Товары не найдены
          </h3>
          <p className="text-muted-foreground">
            Попробуйте изменить параметры фильтрации
          </p>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearAllFilters}
              className="mt-4 underline text-primary"
            >
              Сбросить все фильтры
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CatalogProductsSection;
