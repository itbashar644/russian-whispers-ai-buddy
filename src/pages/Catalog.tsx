
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  
  // Get price range from URL parameters or use defaults
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  
  // Parse specification filters from URL
  const [specFilters, setSpecFilters] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const newSpecFilters: Record<string, string> = {};
    
    // Look for params that start with "spec_"
    searchParams.forEach((value, key) => {
      if (key.startsWith("spec_") && value) {
        const specKey = key.replace("spec_", "");
        newSpecFilters[specKey] = value;
      }
    });
    
    setSpecFilters(newSpecFilters);
  }, [searchParams]);
  
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: minPriceParam ? parseInt(minPriceParam, 10) : 0,
    max: maxPriceParam ? parseInt(maxPriceParam, 10) : 500000000,
  });
  
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [sortBy, setSortBy] = useState("in-stock"); // Default sort by in-stock
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Загрузка данных каталога
  const { allProducts, availableCategories, categoryObjects, loading } = useCatalogData(categoryParam);
  
  // Фильтрация и сортировка продуктов
  const { filteredProducts, availableColors, availableSpecifications, inStockCount, outOfStockCount } = useProductFiltering({
    allProducts,
    searchTerm,
    priceRange,
    inStockOnly: false, // Always false now
    sortBy,
    loading,
    showColorVariants: true, // Always true now
    colorParam,
    specFilters
  });

  useEffect(() => {
    // Update searchTerm when searchParam changes
    if (searchParam) {
      setSearchTerm(searchParam);
    } else if (searchParam === null) {
      setSearchTerm("");
    }
  }, [searchParam]);
  
  // Update URL when price range changes (but only if user actually changed it)
  useEffect(() => {
    const minPriceChanged = priceRange.min > 0;
    const maxPriceChanged = priceRange.max !== 500000000;
    
    if (minPriceChanged) {
      searchParams.set("minPrice", priceRange.min.toString());
    } else {
      searchParams.delete("minPrice");
    }
    
    if (maxPriceChanged) {
      searchParams.set("maxPrice", priceRange.max.toString());
    } else {
      searchParams.delete("maxPrice");
    }
    
    // Only update URL if price actually changed to avoid unnecessary history entries
    if (minPriceChanged || maxPriceChanged) {
      setSearchParams(searchParams, { replace: true });
    }
  }, [priceRange, searchParams, setSearchParams]);

  // Подсчет количества активных фильтров
  useEffect(() => {
    let count = 0;
    
    if (categoryParam) count++;
    if (colorParam) count++;
    if (priceRange.min > 0 || priceRange.max < 500000000) count++;
    if (searchTerm) count++;
    
    // Count specification filters
    count += Object.values(specFilters).filter(Boolean).length;
    
    setActiveFiltersCount(count);
  }, [categoryParam, colorParam, priceRange, searchTerm, specFilters]);

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

  const handleSpecFilter = (key: string, value: string) => {
    if (value) {
      searchParams.set(`spec_${key}`, value);
    } else {
      searchParams.delete(`spec_${key}`);
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
    setPriceRange({ min: 0, max: 500000000 });
    setSearchTerm("");
    setSpecFilters({});
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
          priceRange={priceRange}
          loading={loading}
          showMobileFilters={showMobileFilters}
          activeFiltersCount={activeFiltersCount}
          availableColors={availableColors}
          availableSpecifications={availableSpecifications}
          specFilters={specFilters}
          handleCategoryClick={handleCategoryClick}
          handleColorFilter={handleColorFilter}
          handlePriceChange={handlePriceChange}
          handleSpecFilter={handleSpecFilter}
          handleClearAllFilters={handleClearAllFilters}
          findCategoryByName={findCategoryByName}
        />

        <CatalogProductsSection
          categoryParam={categoryParam}
          searchTerm={searchTerm}
          colorParam={colorParam}
          specFilters={specFilters}
          availableCategories={availableCategories}
          loading={loading}
          filteredProducts={filteredProducts}
          inStockCount={inStockCount}
          outOfStockCount={outOfStockCount}
          activeFiltersCount={activeFiltersCount}
          sortBy={sortBy}
          handleSearchSubmit={handleSearchSubmit}
          handleSearchChange={handleSearchChange}
          setSortBy={setSortBy}
          handleCategoryClick={handleCategoryClick}
          handleColorFilter={handleColorFilter}
          handleSpecFilter={handleSpecFilter}
          handleClearAllFilters={handleClearAllFilters}
        />
      </div>
    </CatalogLayout>
  );
};

export default Catalog;
