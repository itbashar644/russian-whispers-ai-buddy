
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Category } from "@/data/products/categoryData";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import CatalogFilters from "@/components/catalog/CatalogFilters";
import CatalogProductsSection from "@/components/catalog/CatalogProductsSection";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCatalogData } from "@/hooks/useCatalogData";
import { useProductFiltering } from "@/hooks/useProductFiltering";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const colorParam = searchParams.get("color");
  const inStockParam = searchParams.get("in_stock");
  
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 5000,
  });
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [inStockOnly, setInStockOnly] = useState(inStockParam === "true");
  const [sortBy, setSortBy] = useState("in-stock"); // Default sort by in-stock
  const [showColorVariants, setShowColorVariants] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Загрузка данных каталога
  const { allProducts, availableCategories, categoryObjects, loading } = useCatalogData(categoryParam);
  
  // Фильтрация и сортировка продуктов
  const { filteredProducts, availableColors, inStockCount, outOfStockCount } = useProductFiltering({
    allProducts,
    searchTerm,
    priceRange,
    inStockOnly,
    sortBy,
    loading,
    showColorVariants,
    colorParam
  });

  useEffect(() => {
    // Update searchTerm when searchParam changes
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    // Update inStockOnly based on URL parameter
    setInStockOnly(inStockParam === "true");
  }, [searchParam, inStockParam]);

  // Подсчет количества активных фильтров
  useEffect(() => {
    let count = 0;
    
    if (categoryParam) count++;
    if (colorParam) count++;
    if (inStockOnly) count++;
    if (priceRange.min > 0 || priceRange.max < 5000) count++;
    if (searchTerm) count++;
    
    setActiveFiltersCount(count);
  }, [categoryParam, colorParam, inStockOnly, priceRange, searchTerm]);

  const handleCategoryClick = (categoryId: string | null) => {
    if (categoryId) {
      searchParams.set("category", categoryId);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  const handleColorFilter = (color: string | null) => {
    if (color) {
      searchParams.set("color", color);
    } else {
      searchParams.delete("color");
    }
    setSearchParams(searchParams);
  };

  const handleInStockFilter = (checked: boolean) => {
    setInStockOnly(checked);
    if (checked) {
      searchParams.set("in_stock", "true");
    } else {
      searchParams.delete("in_stock");
    }
    setSearchParams(searchParams);
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setPriceRange((prev) => ({ ...prev, [type]: numValue }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchParams.set("search", searchTerm);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };
  
  const handleClearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceRange({ min: 0, max: 5000 });
    setSearchTerm("");
    setInStockOnly(false);
  };

  // Находим объект категории по имени
  const findCategoryByName = (name: string) => {
    return categoryObjects.find(cat => cat.name === name) || { name, imageUrl: "/placeholder.svg" };
  };

  return (
    <CatalogLayout>
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        {/* Mobile filters toggle */}
        <div className="md:hidden mb-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter className="h-4 w-4" />
            Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </div>

        <CatalogFilters 
          availableCategories={availableCategories}
          categoryParam={categoryParam}
          colorParam={colorParam}
          inStockOnly={inStockOnly}
          priceRange={priceRange}
          showColorVariants={showColorVariants}
          loading={loading}
          showMobileFilters={showMobileFilters}
          activeFiltersCount={activeFiltersCount}
          availableColors={availableColors}
          inStockCount={inStockCount}
          handleCategoryClick={handleCategoryClick}
          handleColorFilter={handleColorFilter}
          handleInStockFilter={handleInStockFilter}
          handlePriceChange={handlePriceChange}
          handleClearAllFilters={handleClearAllFilters}
          findCategoryByName={findCategoryByName}
          setShowColorVariants={setShowColorVariants}
        />

        <CatalogProductsSection
          categoryParam={categoryParam}
          searchTerm={searchTerm}
          colorParam={colorParam}
          availableCategories={availableCategories}
          loading={loading}
          filteredProducts={filteredProducts}
          inStockCount={inStockCount}
          outOfStockCount={outOfStockCount}
          inStockOnly={inStockOnly}
          activeFiltersCount={activeFiltersCount}
          sortBy={sortBy}
          showColorVariants={showColorVariants}
          handleSearchSubmit={handleSearchSubmit}
          handleSearchChange={handleSearchChange}
          setSortBy={setSortBy}
          handleCategoryClick={handleCategoryClick}
          handleColorFilter={handleColorFilter}
          handleInStockFilter={handleInStockFilter}
          handleClearAllFilters={handleClearAllFilters}
        />
      </div>
    </CatalogLayout>
  );
};

export default Catalog;
