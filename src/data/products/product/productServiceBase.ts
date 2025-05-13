
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
  if (includeArchived) {
    // Если нужны архивированные продукты, загружаем их напрямую из базы
    return await fetchProductsFromSupabase(true);
  }
  
  // Всегда обновляем кэш при запросе продуктов
  await refreshCacheIfNeeded(true);
  
  return getProductsCache();
};

// Функция для добавления или обновления продукта
export const addOrUpdateProduct = async (product: Product): Promise<void> => {
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
  const success = await addOrUpdateProductInSupabase(product);
  
  if (success) {
    // Принудительно обновляем кэш
    await refreshCacheIfNeeded(true);
  }
};

// Функция для архивирования продукта
export const archiveProduct = async (productId: string): Promise<void> => {
  const success = await archiveProductInSupabase(productId);
  
  if (success) {
    // Принудительно обновляем кэш
    await refreshCacheIfNeeded(true);
  }
};

// Функция для восстановления продукта из архива
export const restoreProduct = async (productId: string): Promise<void> => {
  const success = await restoreProductInSupabase(productId);
  
  if (success) {
    // Принудительно обновляем кэш
    await refreshCacheIfNeeded(true);
  }
};

// Функция для удаления продукта
export const removeProduct = async (productId: string): Promise<void> => {
  const success = await removeProductFromSupabase(productId);
  
  if (success) {
    // Принудительно обновляем кэш
    await refreshCacheIfNeeded(true);
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
  if (!category) {
    // Возвращаем все активные продукты
    await refreshCacheIfNeeded(true);
    return getProductsCache();
  }
  
  try {
    return await getProductsByCategoryFromSupabase(category);
  } catch (error) {
    console.error("Ошибка при получении товаров по категории:", error);
    return [];
  }
};
