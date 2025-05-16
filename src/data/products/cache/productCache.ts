
import { Product } from "@/types/product";
import { fetchProductsFromSupabase } from "../supabaseApi";

// Временный кэш продуктов для улучшения производительности
let productsCache: Product[] = [];
let productsCacheLoaded = false;
let lastCacheUpdateTime = 0;
const CACHE_TTL = 15000; // 15 секунд в миллисекундах - уменьшил для более частого обновления

// Функция для проверки и обновления кэша
export const refreshCacheIfNeeded = async (forceRefresh = false): Promise<void> => {
  const now = Date.now();
  
  // Обновляем кэш, если он устарел или требуется принудительное обновление
  if (forceRefresh || !productsCacheLoaded || now - lastCacheUpdateTime > CACHE_TTL) {
    try {
      console.log("Refreshing products cache", forceRefresh ? "(forced)" : "");
      // Загружаем все активные продукты
      productsCache = await fetchProductsFromSupabase(false);
      productsCacheLoaded = true;
      lastCacheUpdateTime = now;
      console.log("Кэш продуктов обновлен из Supabase:", productsCache.length, "товаров");
    } catch (error) {
      console.error("Ошибка при обновлении кэша продуктов:", error);
      // Не сбрасываем кэш в случае ошибки, чтобы не потерять данные
      if (!productsCacheLoaded) {
        productsCache = [];
      }
      throw error; // Propagate the error to let callers know something went wrong
    }
  }
};

// Получение кэша продуктов
export const getProductsCache = (): Product[] => {
  return [...productsCache];
};

// Инициализируем кэш продуктов при импорте модуля
refreshCacheIfNeeded(true).catch(err => {
  console.error("Failed to initialize product cache:", err);
});

// Экспортируем продукты через переменную для совместимости с существующим кодом
export let products: Product[] = [];
(async () => {
  try {
    await refreshCacheIfNeeded(true);
    products = getProductsCache();
  } catch (error) {
    console.error("Error initializing products variable:", error);
  }
})();
