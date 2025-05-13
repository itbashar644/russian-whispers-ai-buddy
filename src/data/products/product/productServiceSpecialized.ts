
import { Product, ColorVariant } from "@/types/product";
import { getProductById, getProductsByCategory } from "./productServiceBase";
import { refreshCacheIfNeeded, getProductsCache } from "../cache/productCache";
import { addOrUpdateProduct } from "./productServiceBase";

// Функция для уменьшения количества товара при заказе
export const decreaseProductStock = async (productId: string, quantity: number, colorSelected?: string): Promise<boolean> => {
  try {
    // Получаем текущий продукт из базы
    const product = await getProductById(productId);
    
    if (!product) {
      return false;
    }
    
    // Если указан цвет и у продукта есть варианты по цвету, уменьшаем запас для конкретного варианта
    if (colorSelected && product.colorVariants && product.colorVariants.length > 0) {
      const colorVariant = product.colorVariants.find(v => v.color === colorSelected);
      
      if (!colorVariant || colorVariant.stockQuantity === undefined || colorVariant.stockQuantity < quantity) {
        return false; // Недостаточно запасов для этого цвета
      }
      
      colorVariant.stockQuantity -= quantity;
      
      // Обновляем общий статус наличия продукта на основе его вариантов
      const hasRemainingStock = product.colorVariants.some(v => 
        v.stockQuantity !== undefined && v.stockQuantity > 0
      );
      
      product.inStock = hasRemainingStock;
      await addOrUpdateProduct(product);
      return true;
    }
    
    // Если цвет не указан или нет вариантов по цвету, уменьшаем основной запас
    if (product.stockQuantity === undefined || product.stockQuantity < quantity) {
      return false; // Недостаточно запасов
    }
    
    product.stockQuantity -= quantity;
    product.inStock = product.stockQuantity > 0;
    await addOrUpdateProduct(product);
    return true;
  } catch (error) {
    console.error("Ошибка при уменьшении запаса товара:", error);
    return false;
  }
};

// Функция для проверки наличия товара
export const checkProductStock = async (productId: string, requestedQuantity: number, colorSelected?: string): Promise<boolean> => {
  try {
    const product = await getProductById(productId);
    
    if (!product) {
      return false;
    }
    
    // Если указан цвет и у продукта есть варианты по цвету, проверяем запас для конкретного варианта
    if (colorSelected && product.colorVariants && product.colorVariants.length > 0) {
      const colorVariant = product.colorVariants.find(v => v.color === colorSelected);
      
      if (!colorVariant || colorVariant.stockQuantity === undefined) {
        return false;
      }
      
      return colorVariant.stockQuantity >= requestedQuantity;
    }
    
    // Если цвет не указан или нет вариантов по цвету, проверяем основной запас
    if (product.stockQuantity === undefined) {
      return false;
    }
    
    return product.stockQuantity >= requestedQuantity;
  } catch (error) {
    console.error("Ошибка при проверке наличия товара:", error);
    return false;
  }
};

// Функция для получения цены продукта с учетом вариантов по цвету
export const getProductPrice = (product: Product, colorSelected?: string): number => {
  if (colorSelected && product.colorVariants && product.colorVariants.length > 0) {
    const colorVariant = product.colorVariants.find(v => v.color === colorSelected);
    
    if (colorVariant) {
      return colorVariant.discountPrice || colorVariant.price;
    }
  }
  
  return product.discountPrice || product.price;
};

// Функция для получения связанных продуктов
export const getRelatedProducts = async (id: string, limit: number = 4): Promise<Product[]> => {
  try {
    const currentProduct = await getProductById(id);
    if (!currentProduct) return [];
    
    // Получаем все продукты из той же категории
    const sameCategory = await getProductsByCategory(currentProduct.category);
    
    // Фильтруем и возвращаем результат
    return sameCategory
      .filter(product => product.id !== id && !product.archived)
      .slice(0, limit);
  } catch (error) {
    console.error("Ошибка при получении связанных товаров:", error);
    return [];
  }
};

// Функция для получения бестселлеров
export const getBestsellers = async (limit: number = 4): Promise<Product[]> => {
  await refreshCacheIfNeeded(true);
  
  return getProductsCache()
    .filter(product => product.isBestseller && !product.archived)
    .slice(0, limit);
};

// Функция для получения новых продуктов
export const getNewProducts = async (limit: number = 4): Promise<Product[]> => {
  await refreshCacheIfNeeded(true);
  
  return getProductsCache()
    .filter(product => product.isNew && !product.archived)
    .slice(0, limit);
};

// Функция для получения архивированных продуктов
export const getArchivedProducts = async (): Promise<Product[]> => {
  try {
    // Загружаем архивированные продукты напрямую из базы
    const all = await getProductsByCategory('');
    return all.filter(p => p.archived);
  } catch (error) {
    console.error("Ошибка при получении архивированных товаров:", error);
    return [];
  }
};

// Функция для получения активных продуктов
export const getActiveProducts = async (): Promise<Product[]> => {
  await refreshCacheIfNeeded(true);
  return getProductsCache();
};

// Функция для получения варианта продукта по цвету
export const getProductVariantByColor = async (productId: string, color: string): Promise<ColorVariant | undefined> => {
  try {
    const product = await getProductById(productId);
    if (!product || !product.colorVariants) return undefined;
    
    return product.colorVariants.find(v => v.color === color);
  } catch (error) {
    console.error("Ошибка при получении варианта товара по цвету:", error);
    return undefined;
  }
};
