import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductsByCategory, products, getAllCategories, getCategoryObjects } from "@/data/products";
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
import { Box } from "lucide-react";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 5000,
  });
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<Array<{ name: string; imageUrl: string }>>([]);

  // Обновляем категории при монтировании компонента и при каждом входе на страницу
  useEffect(() => {
    setAvailableCategories(getAllCategories());
    setCategoryObjects(getCategoryObjects());
    
    // Добавляем интервал для периодической проверки обновлений категорий
    const intervalId = setInterval(() => {
      setAvailableCategories(getAllCategories());
      setCategoryObjects(getCategoryObjects());
    }, 5000); // Проверка каждые 5 секунд
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Update searchTerm when searchParam changes
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParam]);

  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (categoryParam) {
      result = getProductsByCategory(categoryParam);
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (p) => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by price range
    result = result.filter(
      (p) => 
        (p.discountPrice || p.price) >= priceRange.min && 
        (p.discountPrice || p.price) <= priceRange.max
    );
    
    // Filter by stock
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    
    // Sort results
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => 
          (a.discountPrice || a.price) - (b.discountPrice || b.price)
        );
        break;
      case "price-desc":
        result.sort((a, b) => 
          (b.discountPrice || b.price) - (a.discountPrice || a.price)
        );
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
  }, [categoryParam, priceRange, searchTerm, inStockOnly, sortBy, products]);

  const getCategoryIcon = () => {
    return <Box className="h-4 w-4 mr-2" />;
  };

  const handleCategoryClick = (categoryId: string | null) => {
    if (categoryId) {
      searchParams.set("category", categoryId);
    } else {
      searchParams.delete("category");
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
                >
                  Все товары
                </Button>
                {availableCategories.map((category) => {
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
                })}
              </div>
            </div>

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
                />
                <label
                  htmlFor="in-stock"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Только в наличии
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
              </h1>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <Input
                    type="search"
                    placeholder="Поиск товаров..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="min-w-[200px]"
                  />
                  <Button type="submit">Найти</Button>
                </form>
                <Select 
                  value={sortBy}
                  onValueChange={setSortBy}
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

            <ProductGrid products={filteredProducts} />
            
            {filteredProducts.length === 0 && (
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
