
import { Product, ColorVariant } from "@/types/product";
import { generateRandomRating, getFromStorage, saveToStorage } from "./utils";
import {
  fetchProductsFromSupabase,
  getProductByIdFromSupabase,
  getProductsByCategoryFromSupabase,
  addOrUpdateProductInSupabase,
  archiveProductInSupabase,
  restoreProductInSupabase,
  removeProductFromSupabase,
  migrateDataToSupabaseIfNeeded
} from "./supabaseApi";

// Временный кэш продуктов для улучшения производительности
let productsCache: Product[] = [];
let productsCacheLoaded = false;
let lastCacheUpdateTime = 0;
const CACHE_TTL = 60000; // 1 минута в миллисекундах

// Функция для проверки и обновления кэша
const refreshCacheIfNeeded = async (forceRefresh = false): Promise<void> => {
  const now = Date.now();
  
  // Обновляем кэш, если он устарел или требуется принудительное обновление
  if (forceRefresh || !productsCacheLoaded || now - lastCacheUpdateTime > CACHE_TTL) {
    try {
      // Проверяем, нужно ли импортировать данные из localStorage
      await migrateDataToSupabaseIfNeeded();
      
      // Загружаем все активные продукты
      productsCache = await fetchProductsFromSupabase(false);
      productsCacheLoaded = true;
      lastCacheUpdateTime = now;
    } catch (error) {
      console.error("Ошибка при обновлении кэша продуктов:", error);
      // Используем localStorage в качестве запасного варианта
      if (!productsCacheLoaded) {
        productsCache = getInitialProducts();
      }
    }
  }
};

// Функция для получения исходных продуктов из localStorage
const getInitialProducts = (): Product[] => {
  return getFromStorage<Product[]>('catalog_products', [...defaultProducts]);
};

// Экспортируем продукты через геттер для совместимости с существующим кодом
export const getProducts = async (includeArchived = false): Promise<Product[]> => {
  if (includeArchived) {
    // Если нужны архивированные продукты, загружаем их напрямую из базы
    return await fetchProductsFromSupabase(true);
  }
  
  // Обновляем кэш, если нужно
  await refreshCacheIfNeeded();
  
  return [...productsCache];
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
    // Обновляем локальный кэш
    const index = productsCache.findIndex(p => p.id === productId);
    if (index >= 0) {
      productsCache[index].archived = true;
    }
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
    // Обновляем локальный кэш
    productsCache = productsCache.filter(p => p.id !== productId);
  }
};

// Функция для уменьшения количества товара при заказе
export const decreaseProductStock = async (productId: string, quantity: number, colorSelected?: string): Promise<boolean> => {
  try {
    // Получаем текущий продукт из базы
    const product = await getProductByIdFromSupabase(productId);
    
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
    const product = await getProductByIdFromSupabase(productId);
    
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
    await refreshCacheIfNeeded();
    return [...productsCache];
  }
  
  try {
    return await getProductsByCategoryFromSupabase(category);
  } catch (error) {
    console.error("Ошибка при получении товаров по категории:", error);
    return [];
  }
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
  await refreshCacheIfNeeded();
  
  return productsCache
    .filter(product => product.isBestseller && !product.archived)
    .slice(0, limit);
};

// Функция для получения новых продуктов
export const getNewProducts = async (limit: number = 4): Promise<Product[]> => {
  await refreshCacheIfNeeded();
  
  return productsCache
    .filter(product => product.isNew && !product.archived)
    .slice(0, limit);
};

// Функция для получения архивированных продуктов
export const getArchivedProducts = async (): Promise<Product[]> => {
  try {
    // Загружаем архивированные продукты напрямую из базы
    const all = await fetchProductsFromSupabase(true);
    return all.filter(p => p.archived);
  } catch (error) {
    console.error("Ошибка при получении архивированных товаров:", error);
    return [];
  }
};

// Функция для получения активных продуктов
export const getActiveProducts = async (): Promise<Product[]> => {
  await refreshCacheIfNeeded();
  return [...productsCache];
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

// Default products to populate the catalog initially
const defaultProducts: Product[] = [
  {
    id: "1",
    title: "Кожаная сумка через плечо",
    description: "Стильная кожаная сумка через плечо ручной работы из натуральной кожи.",
    price: 5990,
    category: "Сумки и рюкзаки",
    imageUrl: "/placeholder.svg",
    additionalImages: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.8,
    inStock: true,
    countryOfOrigin: "Россия",
    colors: ["Черный", "Коричневый", "Бежевый"],
    material: "Натуральная кожа",
    isBestseller: true,
    stockQuantity: 15,
    colorVariants: [
      {
        color: "Черный",
        price: 5990,
        stockQuantity: 5,
        articleNumber: "KB-1001-BLK"
      },
      {
        color: "Коричневый",
        price: 5990,
        stockQuantity: 5,
        articleNumber: "KB-1001-BRN"
      },
      {
        color: "Бежевый",
        price: 6490,
        stockQuantity: 5,
        articleNumber: "KB-1001-BGE"
      }
    ]
  },
  {
    id: "2",
    title: "Керамическая ваза ручной работы",
    description: "Уникальная керамическая ваза ручной работы с авторским дизайном.",
    price: 3500,
    discountPrice: 2990,
    category: "Для дома",
    imageUrl: "/placeholder.svg",
    rating: 4.9,
    inStock: true,
    countryOfOrigin: "Россия",
    isNew: true,
    stockQuantity: 8,
  },
  {
    id: "3",
    title: "Серебряное кольцо с малахитом",
    description: "Элегантное серебряное кольцо с натуральным малахитом российского производства.",
    price: 4500,
    category: "Украшения",
    imageUrl: "/placeholder.svg",
    rating: 4.7,
    inStock: true,
    countryOfOrigin: "Россия",
    material: "Серебро 925 пробы, малахит",
    isBestseller: true,
    stockQuantity: 20,
  }
];

// Инициализируем кэш продуктов при импорте модуля
refreshCacheIfNeeded();

// Добавляем временную псевдо-переменную products для совместимости с существующим кодом
// todo: удалить эту переменную после обновления всех импортов
export let products: Product[] = [];
(async () => {
  products = await getProducts();
})();
