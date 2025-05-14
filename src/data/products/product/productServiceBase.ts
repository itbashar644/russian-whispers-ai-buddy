
import { Product } from "@/types/product";
import { 
  fetchProductsFromSupabase, 
  getProductByIdFromSupabase, 
  getProductsByCategoryFromSupabase, 
  addOrUpdateProductInSupabase, 
  archiveProductInSupabase, 
  restoreProductInSupabase, 
  removeProductFromSupabase 
} from "../supabaseApi";
import { refreshCacheIfNeeded, getProductsCache } from "../cache/productCache";
import { generateRandomRating } from "../utils";

// Экспортируем продукты через геттер для совместимости с существующим кодом
export const getProducts = async (includeArchived = false): Promise<Product[]> => {
  try {
    if (includeArchived) {
      // Если нужны архивированные продукты, загружаем их напрямую из базы
      return await fetchProductsFromSupabase(true);
    }
    
    // Всегда обновляем кэш при запросе продуктов
    await refreshCacheIfNeeded(true);
    
    return getProductsCache();
  } catch (error) {
    console.error("Ошибка при получении товаров:", error);
    // Возвращаем пустой массив вместо того чтобы выбрасывать исключение дальше
    return [];
  }
};

// Функция для добавления или обновления продукта
export const addOrUpdateProduct = async (product: Product): Promise<boolean> => {
  try {
    // Если рейтинг не указан, генерируем случайный в диапазоне от 4.7 до 4.9
    if (!product.rating) {
      product.rating = generateRandomRating();
    }
    
    // Update inStock status based on stock quantity
    if (product.stockQuantity !== undefined) {
      product.inStock = product.stockQuantity > 0;
    } else {
      // Если stockQuantity не указано, считаем товар как отсутствующий в наличии
      product.inStock = false;
    }
    
    // Update colorVariants stock status
    if (product.colorVariants && product.colorVariants.length > 0) {
      // If we have color variants, check if at least one has stock
      const hasColorStock = product.colorVariants.some(variant => 
        variant.stockQuantity !== undefined && variant.stockQuantity > 0
      );
      
      // If at least one color has stock, the product is in stock
      if (hasColorStock) {
        product.inStock = true;
      }
    }
    
    // Сохраняем продукт в Supabase
    const result = await addOrUpdateProductInSupabase(product);
    
    if (result.success) {
      // Принудительно обновляем кэш
      await refreshCacheIfNeeded(true);
    }
    
    return result.success;
  } catch (error) {
    console.error("Ошибка при добавлении/обновлении товара:", error);
    return false;
  }
};

// Функция для архивирования продукта
export const archiveProduct = async (productId: string): Promise<boolean> => {
  try {
    const success = await archiveProductInSupabase(productId);
    
    if (success) {
      // Принудительно обновляем кэш
      await refreshCacheIfNeeded(true);
    }
    
    return success;
  } catch (error) {
    console.error("Ошибка при архивировании товара:", error);
    return false;
  }
};

// Функция для восстановления продукта из архива
export const restoreProduct = async (productId: string): Promise<boolean> => {
  try {
    const success = await restoreProductInSupabase(productId);
    
    if (success) {
      // Принудительно обновляем кэш
      await refreshCacheIfNeeded(true);
    }
    
    return success;
  } catch (error) {
    console.error("Ошибка при восстановлении товара из архива:", error);
    return false;
  }
};

// Функция для удаления продукта
export const removeProduct = async (productId: string): Promise<boolean> => {
  try {
    const success = await removeProductFromSupabase(productId);
    
    if (success) {
      // Принудительно обновляем кэш
      await refreshCacheIfNeeded(true);
    }
    
    return success;
  } catch (error) {
    console.error("Ошибка при удалении товара:", error);
    return false;
  }
};

// Функция для получения продукта по ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    return await getProductByIdFromSupabase(id);
  } catch (error) {
    console.error("Ошибка при получении товара по ID:", error);
    return undefined;
  }
};

// Функция для получения продуктов по категории
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    if (!category) {
      // Возвращаем все активные продукты
      await refreshCacheIfNeeded(true);
      return getProductsCache();
    }
    
    return await getProductsByCategoryFromSupabase(category);
  } catch (error) {
    console.error("Ошибка при получении товаров по категории:", error);
    return [];
  }
};
