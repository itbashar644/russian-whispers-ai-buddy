import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductsByCategory, getAllCategories, getCategoryObjects, getActiveProducts } from "@/data/products";
import { Product } from "@/types/product";
import { Category } from "@/data/products/categoryData";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import CatalogFilters from "@/components/catalog/CatalogFilters";
import CatalogProductsSection from "@/components/catalog/CatalogProductsSection";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const colorParam = searchParams.get("color");
  const inStockParam = searchParams.get("in_stock");
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 5000,
  });
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [inStockOnly, setInStockOnly] = useState(inStockParam === "true");
  const [sortBy, setSortBy] = useState("in-stock"); // Default sort by in-stock
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showColorVariants, setShowColorVariants] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Get all available colors from products
  const availableColors = useMemo(() => {
    if (!allProducts.length) return [];
    
    const colorSet = new Set<string>();
    
    allProducts.forEach(product => {
      if (product.colorVariants && product.colorVariants.length > 0) {
        product.colorVariants.forEach(variant => {
          colorSet.add(variant.color);
        });
      }
    });
    
    return Array.from(colorSet).sort();
  }, [allProducts]);

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Загружаем категории и продукты
        const [categoriesData, categoryObjsData, productsData] = await Promise.all([
          getAllCategories(),
          getCategoryObjects(),
          categoryParam ? getProductsByCategory(categoryParam) : getActiveProducts()
        ]);
        
        setAvailableCategories(categoriesData);
        setCategoryObjects(categoryObjsData);
        setAllProducts(productsData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [categoryParam]);

  useEffect(() => {
    // Update searchTerm when searchParam changes
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    // Update inStockOnly based on URL parameter
    setInStockOnly(inStockParam === "true");
  }, [searchParam, inStockParam]);

  // Фильтруем и сортируем продукты при изменении параметров
  useEffect(() => {
    if (loading) return;
    
    let result = [...allProducts];
    
    // Transform products for color display if needed
    if (showColorVariants) {
      result = transformProductsForColorDisplay(result);
    }
    
    // Filter by color if color parameter is set
    if (colorParam) {
      result = result.filter(product => {
        if (product.colorVariants && product.colorVariants.length > 0) {
          return product.colorVariants.some(v => v.color.toLowerCase() === colorParam.toLowerCase());
        }
        return false;
      });
    }
    
    // Фильтрация по поисковому запросу
    if (searchTerm) {
      result = result.filter(
        (p) => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Фильтрация по диапазону цен
    result = result.filter(
      (p) => {
        const price = p.discountPrice || p.price;
        return price >= priceRange.min && price <= priceRange.max;
      }
    );
    
    // Фильтрация по наличию
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    
    // Always sort by in-stock first
    result = sortProducts(result, sortBy);
    
    setFilteredProducts(result);
  }, [allProducts, priceRange, searchTerm, inStockOnly, sortBy, loading, showColorVariants, colorParam]);

  // Transform products for color display
  const transformProductsForColorDisplay = (products: Product[]): Product[] => {
    const expandedProducts: Product[] = [];
    
    products.forEach(product => {
      // If product has color variants, create virtual products for each variant
      if (product.colorVariants && product.colorVariants.length > 0) {
        product.colorVariants.forEach(variant => {
          const variantProduct: Product = {
            ...product,
            id: `${product.id}-${variant.color}`.replace(/\s+/g, '-').toLowerCase(),
            price: variant.price,
            discountPrice: variant.discountPrice,
            imageUrl: variant.imageUrl || product.imageUrl,
            articleNumber: variant.articleNumber || product.articleNumber,
            barcode: variant.barcode || product.barcode,
            stockQuantity: variant.stockQuantity,
            inStock: variant.stockQuantity !== undefined ? variant.stockQuantity > 0 : product.inStock,
            ozonUrl: variant.ozonUrl || product.ozonUrl,
            wildberriesUrl: variant.wildberriesUrl || product.wildberriesUrl,
            avitoUrl: variant.avitoUrl || product.avitoUrl,
            colorVariants: [variant],
            isColorVariant: true
          };
          expandedProducts.push(variantProduct);
        });
      } else {
        // Product has no color variants, add as is
        expandedProducts.push(product);
      }
    });
    
    return expandedProducts;
  };

  // Sort products based on selected sortBy option
  const sortProducts = (products: Product[], sortByOption: string): Product[] => {
    // Create a copy to avoid mutating the original array
    const sortedProducts = [...products];
    
    // Always sort by in-stock first, regardless of other sortings
    sortedProducts.sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
    
    // Then apply additional sorting on top of the in-stock priority
    switch (sortByOption) {
      case "price-asc":
        sortedProducts.sort((a, b) => {
          // First by stock
          if (a.inStock !== b.inStock) {
            return a.inStock ? -1 : 1;
          }
          // Then by price
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => {
          // First by stock
          if (a.inStock !== b.inStock) {
            return a.inStock ? -1 : 1;
          }
          // Then by price descending
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceB - priceA;
        });
        break;
      case "name-asc":
        sortedProducts.sort((a, b) => {
          // First by stock
          if (a.inStock !== b.inStock) {
            return a.inStock ? -1 : 1;
          }
          // Then by name ascending
          return a.title.localeCompare(b.title);
        });
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => {
          // First by stock
          if (a.inStock !== b.inStock) {
            return a.inStock ? -1 : 1;
          }
          // Then by name descending
          return b.title.localeCompare(a.title);
        });
        break;
      case "rating":
        sortedProducts.sort((a, b) => {
          // First by stock
          if (a.inStock !== b.inStock) {
            return a.inStock ? -1 : 1;
          }
          // Then by rating
          return b.rating - a.rating;
        });
        break;
      case "in-stock":
      default:
        // Just maintain the stock sort that was already applied
        break;
    }
    
    return sortedProducts;
  };

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

  // Вспомогательные функции для интерфейса
  const inStockCount = useMemo(() => {
    return filteredProducts.filter(p => p.inStock).length;
  }, [filteredProducts]);
  
  const outOfStockCount = useMemo(() => {
    return filteredProducts.filter(p => !p.inStock).length;
  }, [filteredProducts]);

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
