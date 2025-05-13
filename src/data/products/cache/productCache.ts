
import { Product } from "@/types/product";
import { fetchProductsFromSupabase } from "../supabaseApi";

// Временный кэш продуктов для улучшения производительности
let productsCache: Product[] = [];
let productsCacheLoaded = false;
let lastCacheUpdateTime = 0;
const CACHE_TTL = 30000; // 30 секунд в миллисекундах

// Функция для проверки и обновления кэша
export const refreshCacheIfNeeded = async (forceRefresh = false): Promise<void> => {
  const now = Date.now();
  
  // Обновляем кэш, если он устарел или требуется принудительное обновление
  if (forceRefresh || !productsCacheLoaded || now - lastCacheUpdateTime > CACHE_TTL) {
    try {
      // Загружаем все активные продукты
      productsCache = await fetchProductsFromSupabase(false);
      productsCacheLoaded = true;
      lastCacheUpdateTime = now;
      console.log("Кэш продуктов обновлен из Supabase:", productsCache.length, "товаров");
    } catch (error) {
      console.error("Ошибка при обновлении кэша продуктов:", error);
      productsCache = [];
    }
  }
};

// Получение кэша продуктов
export const getProductsCache = (): Product[] => {
  return [...productsCache];
};

// Инициализируем кэш продуктов при импорте модуля
refreshCacheIfNeeded(true);

// Экспортируем продукты через переменную для совместимости с существующим кодом
export let products: Product[] = [];
(async () => {
  await refreshCacheIfNeeded(true);
  products = getProductsCache();
})();
