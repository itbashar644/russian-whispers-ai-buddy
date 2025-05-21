
import React, { useState } from "react";
import { Product } from "@/types/product";
import { useMediaQuery } from "@/hooks/use-mobile";
import ProductGrid from "../products/ProductGrid";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Table } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CatalogProductsSectionProps {
  products: Product[];
  loading: boolean;
  totalProducts?: number;
  onSort?: (sort: string) => void;
  onLayoutChange?: (layout: "grid" | "table") => void;
  onToggleFilters?: () => void;
  isFiltersVisible?: boolean;
  filteredProducts?: Product[];
  inStockCount?: number;
  outOfStockCount?: number;
  activeFiltersCount?: number;
  handleSearchSubmit?: (e: React.FormEvent) => void;
  handleSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCategoryClick?: (categoryId: string | null) => void;
  handleColorFilter?: (color: string | null) => void;
  handleClearAllFilters?: () => void;
  categoryParam?: string;
  searchTerm?: string;
  colorParam?: string;
  availableCategories?: string[];
  sortBy?: string;
  setSortBy?: (value: string) => void;
}

const CatalogProductsSection: React.FC<CatalogProductsSectionProps> = ({
  products,
  loading,
  totalProducts,
  onSort,
  onLayoutChange,
  onToggleFilters,
  isFiltersVisible,
  filteredProducts,
  sortBy: externalSortBy,
  setSortBy: externalSetSortBy,
}) => {
  const [sortOption, setSortOption] = useState(externalSortBy || "popularity");
  const [layout, setLayout] = useState<"grid" | "table">("grid");
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Use provided filteredProducts if available, otherwise use products
  const displayProducts = filteredProducts || products;

  const handleSortChange = (value: string) => {
    setSortOption(value);
    if (externalSetSortBy) {
      externalSetSortBy(value);
    }
    if (onSort) {
      onSort(value);
    }
  };

  const handleLayoutChange = (newLayout: "grid" | "table") => {
    setLayout(newLayout);
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFilters}
              className="md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              {isFiltersVisible ? "Скрыть фильтры" : "Показать фильтры"}
            </Button>
          )}

          <span className="text-sm hidden sm:block text-muted-foreground">
            {totalProducts ? `Найдено: ${totalProducts}` : ""}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="h-8 text-xs w-[180px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">По популярности</SelectItem>
              <SelectItem value="price_asc">Цена по возрастанию</SelectItem>
              <SelectItem value="price_desc">Цена по убыванию</SelectItem>
              <SelectItem value="newest">Сначала новые</SelectItem>
              <SelectItem value="discount">По размеру скидки</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={layout === "grid" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => handleLayoutChange("grid")}
            aria-label="Отображение сеткой"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </Button>
          <Button
            variant={layout === "table" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => handleLayoutChange("table")}
            aria-label="Отображение таблицей"
          >
            <Table className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {layout === "grid" ? (
        <ProductGrid products={displayProducts} loading={loading} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Товар</th>
                <th className="px-4 py-2 text-left">Цена</th>
                <th className="px-4 py-2 text-left">Наличие</th>
                <th className="px-4 py-2 text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              {displayProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="font-medium">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {product.discountPrice ? (
                      <div className="flex flex-col">
                        <span className="font-bold">{product.discountPrice} ₽</span>
                        <span className="text-xs text-muted-foreground line-through">
                          {product.price} ₽
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold">{product.price} ₽</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        product.inStock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.inStock ? "В наличии" : "Нет в наличии"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/product/${product.id}`;
                        }}
                      >
                        Подробнее
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CatalogProductsSection;
