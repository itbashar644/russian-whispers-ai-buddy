
import { fetchProductsFromSupabase } from "../supabase/productApi";
import { Product } from "@/types/product";

// Кэш продуктов
let productsCache: Product[] = [];
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

/**
 * Получает продукты из кэша
 */
export const getProductsCache = (): Product[] => {
  console.log("Getting products from cache:", productsCache.length, "products");
  return productsCache;
};

/**
 * Обновляет кэш продуктов, если прошло достаточно времени или принудительно
 */
export const refreshCacheIfNeeded = async (force = false): Promise<void> => {
  const now = Date.now();
  const shouldRefresh = force || (now - lastCacheUpdate) > CACHE_DURATION;
  
  if (!shouldRefresh && productsCache.length > 0) {
    return;
  }
  
  console.log(force ? "Refreshing products cache (forced)" : "Refreshing products cache");
  
  try {
    const products = await fetchProductsFromSupabase(false);
    productsCache = products;
    lastCacheUpdate = now;
    
    console.log("=== CACHE UPDATE DEBUG ===");
    console.log("Product cache updated from Supabase:", products.length, "products");
    
    // Логируем информацию о бестселлерах и новинках
    const bestsellers = products.filter(p => {
      console.log(`Cache: Product "${p.title}" isBestseller:`, p.isBestseller, "type:", typeof p.isBestseller, "archived:", p.archived);
      return p.isBestseller === true && !p.archived;
    });
    
    const newProducts = products.filter(p => {
      console.log(`Cache: Product "${p.title}" isNew:`, p.isNew, "type:", typeof p.isNew, "archived:", p.archived);
      return p.isNew === true && !p.archived;
    });
    
    const withAdditionalImages = products.filter(p => {
      const hasImages = p.additionalImages && p.additionalImages.length > 0;
      console.log(`Cache: Product "${p.title}" additionalImages:`, p.additionalImages, "count:", p.additionalImages?.length || 0, "hasImages:", hasImages);
      return hasImages;
    });
    
    console.log("Cache stats:", {
      total: products.length,
      bestsellers: bestsellers.length,
      newProducts: newProducts.length,
      withAdditionalImages: withAdditionalImages.length
    });
    
    console.log("Sample bestsellers:", bestsellers.slice(0, 3).map(p => ({ 
      title: p.title, 
      isBestseller: p.isBestseller,
      isBestsellerType: typeof p.isBestseller
    })));
    
    console.log("Sample new products:", newProducts.slice(0, 3).map(p => ({ 
      title: p.title, 
      isNew: p.isNew,
      isNewType: typeof p.isNew
    })));
    
    console.log("Sample products with additional images:", withAdditionalImages.slice(0, 3).map(p => ({ 
      title: p.title, 
      additionalImages: p.additionalImages?.length,
      firstAdditionalImage: p.additionalImages?.[0]
    })));
    
    console.log("=== END CACHE UPDATE DEBUG ===");
    
  } catch (error) {
    console.error("Ошибка обновления кэша продуктов:", error);
    throw error;
  }
};

/**
 * Очищает кэш продуктов
 */
export const invalidateCache = (): void => {
  console.log("Invalidating products cache");
  productsCache = [];
  lastCacheUpdate = 0;
};
