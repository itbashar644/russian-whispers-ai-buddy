
import { Product } from "@/types/product";

/**
 * Импорт товара с Ozon по URL
 * 
 * @param url URL товара на Ozon
 */
export const importProductFromOzon = async (url: string): Promise<Partial<Product>> => {
  // В реальном проекте здесь должен быть запрос к API или серверная часть для парсинга
  // Поскольку Ozon не предоставляет публичное API для этих целей, здесь используется
  // имитация получения данных
  
  console.log("Импорт с Ozon:", url);
  
  // Имитация задержки запроса
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Извлекаем ID товара из URL (примерная логика)
  const productId = extractProductId(url, "ozon");
  
  // Демонстрационные данные
  return {
    title: `Товар с Ozon #${productId}`,
    description: "Импортированное описание товара с Ozon. В реальном приложении здесь будет настоящее описание, полученное через API или парсинг страницы.",
    price: Math.floor(Math.random() * 5000) + 1000,
    discountPrice: Math.floor(Math.random() * 5000),
    category: "Импортированные",
    imageUrl: "/placeholder.svg",
    articleNumber: `OZ-${productId}`,
    barcode: generateRandomBarcode(),
    material: "Импортировано с Ozon",
    countryOfOrigin: "Россия",
    isNew: Math.random() > 0.5,
    specifications: [
      { name: "Источник", value: "Ozon" },
      { name: "ID товара", value: productId },
    ]
  };
};

/**
 * Импорт товара с Wildberries по URL
 * 
 * @param url URL товара на Wildberries
 */
export const importProductFromWildberries = async (url: string): Promise<Partial<Product>> => {
  // В реальном проекте здесь должен быть запрос к API или серверная часть для парсинга
  // Wildberries имеет API, но оно требует авторизации и предназначено для поставщиков
  
  console.log("Импорт с Wildberries:", url);
  
  // Имитация задержки запроса
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Извлекаем ID товара из URL (примерная логика)
  const productId = extractProductId(url, "wildberries");
  
  // Демонстрационные данные
  return {
    title: `Товар с Wildberries #${productId}`,
    description: "Импортированное описание товара с Wildberries. В реальном приложении здесь будет настоящее описание, полученное через API или парсинг страницы.",
    price: Math.floor(Math.random() * 5000) + 1000,
    discountPrice: Math.floor(Math.random() * 5000),
    category: "Импортированные",
    imageUrl: "/placeholder.svg",
    articleNumber: `WB-${productId}`,
    barcode: generateRandomBarcode(),
    material: "Импортировано с Wildberries",
    countryOfOrigin: "Россия",
    colors: ["Черный", "Белый", "Красный"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Источник", value: "Wildberries" },
      { name: "ID товара", value: productId },
    ]
  };
};

/**
 * Извлечение ID товара из URL
 */
const extractProductId = (url: string, platform: "ozon" | "wildberries"): string => {
  try {
    if (platform === "ozon") {
      // Примерная логика извлечения ID из URL Ozon
      const match = url.match(/\/product\/([^/?]+)/);
      return match ? match[1] : `unknown-${Date.now()}`;
    } else {
      // Примерная логика извлечения ID из URL Wildberries
      const match = url.match(/\/catalog\/([^/?]+)/);
      return match ? match[1] : `unknown-${Date.now()}`;
    }
  } catch (error) {
    console.error(`Ошибка при извлечении ID товара с ${platform}:`, error);
    return `unknown-${Date.now()}`;
  }
};

/**
 * Генерация случайного штрих-кода для демонстрационных целей
 */
const generateRandomBarcode = (): string => {
  let barcode = "460";
  for (let i = 0; i < 10; i++) {
    barcode += Math.floor(Math.random() * 10);
  }
  return barcode;
};
