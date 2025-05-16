import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getAllProductsCached } from "@/data/products";
import { getAllCategories } from "@/data/products/categoryData";
import { useProductFiltering as useProductFilteringNew } from "@/hooks/useProductFiltering/index";

// Helper function to get max price
const getMaxPrice = (products: Product[]): number => {
  if (products.length === 0) return 50000;
  
  return Math.max(
    ...products.map(product => product.discountPrice || product.price)
  );
};

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const colorParam = searchParams.get("color");
  const searchTerm = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Параметры фильтрации
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState("default");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showColorVariants, setShowColorVariants] = useState(true);
  
  // Загрузка товаров и категорий
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProductsCached(),
          getAllCategories()
        ]);
        
        setProducts(productsData);
        // Make sure categoriesData is properly mapped to Category[] type
        const mappedCategories: Category[] = categoriesData.map((cat: string | Category) => {
          // If it's already a Category object, return it
          if (typeof cat === 'object' && cat !== null) {
            return cat as Category;
          }
          // Otherwise create a Category object from the string
          return {
            name: cat as string,
            imageUrl: '/placeholder.svg'
          };
        });
        
        setCategories(mappedCategories);
        
        // Установка максимальной цены на основе самого дорогого товара
        const calculatedMaxPrice = getMaxPrice(productsData);
        setMaxPrice(calculatedMaxPrice);
        setPriceRange(prev => ({ min: prev.min, max: calculatedMaxPrice }));
      } catch (error) {
        console.error("Error loading catalog data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Используем хук фильтрации для обработки всей логики фильтров
  const { filteredProducts, availableColors, inStockCount, outOfStockCount } = useProductFilteringNew({
    allProducts: products,
    searchTerm,
    priceRange,
    sortBy,
    loading,
    colorParam,
    inStockOnly,
    showColorVariants
  });
  
  // Обработчики изменения параметров фильтрации
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Не обновляем URL при каждом вводе символа
    const value = e.target.value;
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputElement = e.currentTarget.querySelector('input[type="search"]') as HTMLInputElement;
    if (inputElement) {
      const value = inputElement.value;
      updateSearchParams({ q: value || null });
    }
  };
  
  const handleCategoryClick = (category: string | null) => {
    updateSearchParams({ category });
  };
  
  const handleColorFilter = (color: string | null) => {
    updateSearchParams({ color });
  };
  
  const handlePriceChange = (value: { min: number; max: number }) => {
    setPriceRange(value);
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  
  const handleInStockChange = (checked: boolean) => {
    setInStockOnly(checked);
  };
  
  const handleClearAllFilters = () => {
    // Сбрасываем все параметры фильтров
    setSearchParams({});
    setPriceRange({ min: 0, max: maxPrice });
    setSortBy("default");
    setInStockOnly(false);
  };
  
  // Вспомогательная функция для обновления URL параметров
  const updateSearchParams = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    // Обновляем или удаляем параметры
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });
    
    setSearchParams(newSearchParams);
  };
  
  return (
    <CatalogLayout>
      <CatalogProductsSection 
        products={filteredProducts}
        loading={loading}
        categoryParam={categoryParam}
        colorParam={colorParam}
        searchTerm={searchTerm}
        availableColors={availableColors}
        availableCategories={categories}
        inStockCount={inStockCount}
        outOfStockCount={outOfStockCount}
        priceRange={priceRange}
        maxPrice={maxPrice}
        sortBy={sortBy}
        inStockOnly={inStockOnly}
        handlePriceChange={handlePriceChange}
        handleSortChange={handleSortChange}
        handleInStockChange={handleInStockChange}
        handleCategoryClick={handleCategoryClick}
        handleColorFilter={handleColorFilter}
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
        handleClearAllFilters={handleClearAllFilters}
      />
    </CatalogLayout>
  );
};

export default Catalog;
