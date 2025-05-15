
import { Product, ColorVariant } from "@/types/product";
import { getProductById, getProductsByCategory, addOrUpdateProduct } from "./productServiceBase";
import { refreshCacheIfNeeded, getProductsCache } from "../cache/productCache";

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

// Функция для получения связанных цветовых вариантов продукта
export const getRelatedColorProducts = async (productId: string): Promise<Product[]> => {
  try {
    const product = await getProductById(productId);
    if (!product) return [];
    
    // Если у продукта нет связанных цветовых вариантов, возвращаем пустой массив
    if (!product.relatedColorProducts || product.relatedColorProducts.length === 0) {
      return [];
    }
    
    // Получаем все связанные продукты
    const relatedProducts = await Promise.all(
      product.relatedColorProducts.map(id => getProductById(id))
    );
    
    // Фильтруем undefined и архивированные продукты
    return relatedProducts.filter(p => p && !p.archived) as Product[];
  } catch (error) {
    console.error("Ошибка при получении связанных цветовых вариантов:", error);
    return [];
  }
};

// Функция для связывания продуктов по цвету
export const linkProductsByColor = async (productIds: string[]): Promise<boolean> => {
  try {
    if (!productIds || productIds.length <= 1) {
      return false;
    }
    
    // Получаем все продукты, которые нужно связать
    const products = await Promise.all(productIds.map(id => getProductById(id)));
    const validProducts = products.filter(p => p) as Product[];
    
    if (validProducts.length !== productIds.length) {
      console.error("Не все продукты найдены для связывания");
      return false;
    }
    
    // Обновляем каждый продукт, добавляя ссылки на связанные продукты
    for (const product of validProducts) {
      // Исключаем текущий продукт из списка связанных
      product.relatedColorProducts = productIds.filter(id => id !== product.id);
      product.isColorVariant = true;
      
      // Устанавливаем parentProductId как ID первого продукта в списке, если это не сам продукт
      if (product.id !== productIds[0]) {
        product.parentProductId = productIds[0];
      }
      
      await addOrUpdateProduct(product);
    }
    
    // Обновляем кэш
    await refreshCacheIfNeeded(true);
    
    return true;
  } catch (error) {
    console.error("Ошибка при связывании продуктов по цвету:", error);
    return false;
  }
};

// Функция для отвязывания продукта от цветовых вариантов
export const unlinkProductFromColorVariants = async (productId: string): Promise<boolean> => {
  try {
    const product = await getProductById(productId);
    if (!product) return false;
    
    // Если у продукта нет связанных цветовых вариантов, нет необходимости в отвязке
    if (!product.relatedColorProducts || product.relatedColorProducts.length === 0) {
      return true;
    }
    
    // Получаем все связанные продукты
    const relatedProducts = await Promise.all(
      product.relatedColorProducts.map(id => getProductById(id))
    );
    
    // Удаляем ссылку на текущий продукт из связанных продуктов
    for (const relatedProduct of relatedProducts) {
      if (!relatedProduct) continue;
      
      relatedProduct.relatedColorProducts = relatedProduct.relatedColorProducts?.filter(id => id !== productId) || [];
      
      // Если после удаления не осталось связанных продуктов, сбрасываем флаги
      if (relatedProduct.relatedColorProducts.length === 0) {
        relatedProduct.isColorVariant = false;
        relatedProduct.parentProductId = undefined;
      }
      
      await addOrUpdateProduct(relatedProduct);
    }
    
    // Удаляем ссылки из текущего продукта
    product.relatedColorProducts = [];
    product.isColorVariant = false;
    product.parentProductId = undefined;
    
    await addOrUpdateProduct(product);
    
    // Обновляем кэш
    await refreshCacheIfNeeded(true);
    
    return true;
  } catch (error) {
    console.error("Ошибка при отвязке продукта от цветовых вариантов:", error);
    return false;
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
