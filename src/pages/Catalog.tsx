import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductsByCategory, getAllCategories, getCategoryObjects, getActiveProducts } from "@/data/products";
import ProductGrid from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Palette } from "lucide-react";
import { Product } from "@/types/product";
import { Category } from "@/data/products/categoryData";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const colorParam = searchParams.get("color");
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 5000,
  });
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showColorVariants, setShowColorVariants] = useState<boolean>(false);

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
  }, [searchParam]);

  // Фильтруем и сортируем продукты при изменении параметров
  useEffect(() => {
    if (loading) return;
    
    let result = [...allProducts];
    
    // Transform products for color display if needed
    if (showColorVariants) {
      const expandedProducts: Product[] = [];
      
      result.forEach(product => {
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
      
      result = expandedProducts;
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
    
    // Сортировка результатов
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        result.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceB - priceA;
        });
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default sorting
        break;
    }
    
    setFilteredProducts(result);
  }, [allProducts, priceRange, searchTerm, inStockOnly, sortBy, loading, showColorVariants, colorParam]);

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

  // Находим объект категории по имени
  const findCategoryByName = (name: string) => {
    return categoryObjects.find(cat => cat.name === name) || { name, imageUrl: "/placeholder.svg" };
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="container px-4 py-8 md:px-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar filters */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Категории</h3>
              <div className="space-y-2">
                <Button
                  variant={!categoryParam ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleCategoryClick(null)}
                  disabled={loading}
                >
                  Все товары
                </Button>
                {loading ? (
                  // Заглушки при загрузке
                  Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                  ))
                ) : (
                  // Список категорий
                  availableCategories.map((category) => {
                    const categoryObj = findCategoryByName(category);
                    return (
                      <Button
                        key={category}
                        variant={categoryParam === category ? "default" : "outline"}
                        className="w-full justify-start flex items-center"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <span className="w-4 h-4 mr-2 overflow-hidden flex-shrink-0">
                          <img 
                            src={categoryObj.imageUrl} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                            alt=""
                          />
                        </span>
                        <span>{category}</span>
                      </Button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Color filter */}
            {availableColors.length > 0 && (
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Цвета</h3>
                  {colorParam && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleColorFilter(null)}
                      className="h-6 text-xs"
                    >
                      Сбросить
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map(color => (
                    <Button
                      key={color}
                      variant={colorParam === color ? "default" : "outline"}
                      size="sm"
                      className="px-2 py-1 h-auto text-xs"
                      onClick={() => handleColorFilter(color)}
                    >
                      <span className="w-3 h-3 mr-1.5 rounded-full" style={{ 
                        backgroundColor: color.toLowerCase() !== 'белый' ? color.toLowerCase() : '#ffffff',
                        border: color.toLowerCase() === 'белый' ? '1px solid #ccc' : 'none' 
                      }}></span>
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Цена</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="min-price">От</Label>
                  <Input
                    id="min-price"
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                    min={0}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="max-price">До</Label>
                  <Input
                    id="max-price"
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                    min={0}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Наличие</h3>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="in-stock" 
                  checked={inStockOnly} 
                  onCheckedChange={() => setInStockOnly(!inStockOnly)} 
                  disabled={loading}
                />
                <label
                  htmlFor="in-stock"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Только в наличии
                </label>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Отображение</h3>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-colors" 
                  checked={showColorVariants} 
                  onCheckedChange={() => setShowColorVariants(!showColorVariants)} 
                  disabled={loading}
                />
                <label
                  htmlFor="show-colors"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  <Palette className="h-4 w-4 mr-1.5" />
                  Показывать цвета отдельно
                </label>
              </div>
            </div>
          </div>

          {/* Products section */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold">
                {categoryParam 
                  ? availableCategories.includes(categoryParam) ? categoryParam : "Каталог"
                  : searchTerm ? `Поиск: ${searchTerm}` : "Каталог товаров"}
                {colorParam && ` / Цвет: ${colorParam}`}
              </h1>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <Input
                    type="search"
                    placeholder="Поиск товаров..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="min-w-[200px]"
                    disabled={loading}
                  />
                  <Button type="submit" disabled={loading}>Найти</Button>
                </form>
                <Select 
                  value={sortBy}
                  onValueChange={setSortBy}
                  disabled={loading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Сортировать по" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">По умолчанию</SelectItem>
                    <SelectItem value="price-asc">Цена (по возрастанию)</SelectItem>
                    <SelectItem value="price-desc">Цена (по убыванию)</SelectItem>
                    <SelectItem value="name-asc">Название (А-Я)</SelectItem>
                    <SelectItem value="name-desc">Название (Я-А)</SelectItem>
                    <SelectItem value="rating">По рейтингу</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
