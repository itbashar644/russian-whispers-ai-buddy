
import { getFromStorage, saveToStorage } from "./utils";
import { products } from "./productData";

// Определяем интерфейс для категории
export interface Category {
  name: string;
  imageUrl: string;
}

// Хранение текущих категорий
let categories: Category[] = getInitialCategories();

// Функция для получения всех уникальных категорий
export const getAllCategories = (): string[] => {
  // Возвращаем только имена категорий для совместимости с существующим кодом
  return categories.map(category => category.name);
};

// Функция для получения объектов категорий
export const getCategoryObjects = (): Category[] => {
  return [...categories];
};

// Загружаем категории из localStorage или используем значения по умолчанию
function getInitialCategories(): Category[] {
  const defaultCategories = [
    { name: "Сумки и рюкзаки", imageUrl: "/placeholder.svg" },
    { name: "Аксессуары", imageUrl: "/placeholder.svg" },
    { name: "Украшения", imageUrl: "/placeholder.svg" },
    { name: "Одежда", imageUrl: "/placeholder.svg" },
    { name: "Обувь", imageUrl: "/placeholder.svg" },
    { name: "Для дома", imageUrl: "/placeholder.svg" }
  ];
  
  // Получаем уникальные категории из продуктов
  const uniqueCategoryNames = Array.from(new Set(products.map(product => product.category)));
  
  // Если в localStorage есть сохраненные категории, используем их
  const storedCategories = getFromStorage<Category[]>('catalog_categories', null);
  
  if (storedCategories) {
    return storedCategories;
  } else if (uniqueCategoryNames.length > 0) {
    // Создаем категории из уникальных имен в продуктах
    return uniqueCategoryNames.map(name => ({ name, imageUrl: "/placeholder.svg" }));
  } else {
    return defaultCategories;
  }
}

// Функция для сохранения категорий в localStorage
const saveCategoriesToStorage = (): void => {
  saveToStorage('catalog_categories', categories);
};

// Функция для добавления новой категории
export const addCategory = (categoryName: string, imageUrl: string = "/placeholder.svg"): void => {
  if (!categories.some(cat => cat.name === categoryName)) {
    categories.push({ name: categoryName, imageUrl });
    saveCategoriesToStorage();
  }
};

// Функция для обновления изображения категории
export const updateCategoryImage = (categoryName: string, imageUrl: string): void => {
  const categoryIndex = categories.findIndex(cat => cat.name === categoryName);
  if (categoryIndex !== -1) {
    categories[categoryIndex].imageUrl = imageUrl;
    saveCategoriesToStorage();
  }
};

// Функция для удаления категории
export const removeCategory = (categoryName: string): boolean => {
  // Проверяем, используется ли категория в продуктах
  const productsInCategory = products.filter(p => p.category === categoryName);
  
  if (productsInCategory.length === 0) {
    // Если категория не используется, удаляем ее
    categories = categories.filter(cat => cat.name !== categoryName);
    saveCategoriesToStorage();
    return true;
  }
  
  return false; // Если категория используется, возвращаем false
};

// Функция для обновления продуктов при удалении категории
export const updateProductsCategory = (oldCategory: string, newCategory: string): void => {
  // Обновляем категорию для всех продуктов из старой категории
  products.forEach(product => {
    if (product.category === oldCategory) {
      product.category = newCategory;
    }
  });
  
  // Удаляем старую категорию
  removeCategory(oldCategory);
  
  // Сохраняем обновленные продукты в localStorage
  saveToStorage('catalog_products', products);
};

// Функция для получения продуктов по категории
export const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category === category);
};
