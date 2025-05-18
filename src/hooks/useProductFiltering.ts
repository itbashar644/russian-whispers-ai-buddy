
import { useState, useEffect, useMemo } from "react";
import { Product } from "@/types/product";

interface UseProductFilteringProps {
  allProducts: Product[];
  searchTerm: string;
  priceRange: { min: number; max: number };
  inStockOnly: boolean;
  sortBy: string;
  loading: boolean;
  showColorVariants: boolean;
  colorParam: string | null;
}

export const useProductFiltering = ({
  allProducts,
  searchTerm,
  priceRange,
  inStockOnly,
  sortBy,
  loading,
  showColorVariants,
  colorParam
}: UseProductFilteringProps) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

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

  // Add debug logging to see what's happening with products
  useEffect(() => {
    if (!loading) {
      console.log("Total products from API:", allProducts.length);
      console.log("Categories found:", [...new Set(allProducts.map(p => p.category))]);
      
      if (allProducts.some(p => p.category === "Планшеты")) {
        console.log("Tablets found in initial data:", allProducts.filter(p => p.category === "Планшеты").length);
      } else {
        console.log("No tablets found in initial data!");
      }
    }
  }, [allProducts, loading]);

  // Фильтруем и сортируем продукты при изменении параметров
  useEffect(() => {
    if (loading) return;
    
    // Начинаем с оригинального списка продуктов
    let result = [...allProducts];
    
    // Debug original products count by category
    const categoryCount = {};
    [...new Set(result.map(p => p.category))].forEach(category => {
      categoryCount[category] = result.filter(p => p.category === category).length;
    });
    console.log("Original products count by category:", categoryCount);
    
    // Transform products for color display if needed
    if (showColorVariants) {
      result = transformProductsForColorDisplay(result);
    }
    
    // Debug the result after transformation
    console.log("Products after transformation:", result.length);
    console.log("Categories after transformation:", [...new Set(result.map(p => p.category))]);
    
    // Filter by color if color parameter is set
    if (colorParam) {
      result = result.filter(product => {
        // If product has color variants, check if any match the color param
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
    
    // Final check for tablets
    const finalCategoryCount = {};
    [...new Set(result.map(p => p.category))].forEach(category => {
      finalCategoryCount[category] = result.filter(p => p.category === category).length;
    });
    console.log("Final products count by category:", finalCategoryCount);
    
    setFilteredProducts(result);
  }, [allProducts, priceRange, searchTerm, inStockOnly, sortBy, loading, showColorVariants, colorParam]);

  // Transform products for color display
  const transformProductsForColorDisplay = (products: Product[]): Product[] => {
    const expandedProducts: Product[] = [];
    
    products.forEach(product => {
      // ИСПРАВЛЕНО: Всегда сначала добавляем базовый продукт, чтобы гарантировать, что все продукты появятся
      expandedProducts.push({ ...product });
      
      // Затем добавляем варианты цветов в виде отдельных продуктов
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

  // Вспомогательные функции для интерфейса
  const inStockCount = useMemo(() => {
    return filteredProducts.filter(p => p.inStock).length;
  }, [filteredProducts]);
  
  const outOfStockCount = useMemo(() => {
    return filteredProducts.filter(p => !p.inStock).length;
  }, [filteredProducts]);

  return {
    filteredProducts,
    availableColors,
    inStockCount,
    outOfStockCount
  };
};
