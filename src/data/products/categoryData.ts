
import { getFromStorage, saveToStorage } from "./utils";
import { products } from "./productData";
import { 
  fetchCategoriesFromSupabase, 
  addCategoryToSupabase, 
  removeCategoryFromSupabase, 
  updateProductsCategoryInSupabase,
  updateCategoryImageInSupabase,
  getProductsByCategoryFromSupabase,
  migrateDataToSupabaseIfNeeded
} from "./supabaseApi";

// Определяем интерфейс для категории
export interface Category {
  name: string;
  imageUrl: string;
}

// Хранение текущих категорий
let categories: Category[] = [];
let categoriesLoaded = false;

// Функция для получения всех уникальных категорий
export const getAllCategories = async (): Promise<string[]> => {
  // Убедимся, что категории загружены
  if (!categoriesLoaded) {
    await loadCategoriesFromSupabase();
  }
  
  // Возвращаем только имена категорий для совместимости с существующим кодом
  return categories.map(category => category.name);
};

// Функция для получения объектов категорий
export const getCategoryObjects = async (): Promise<Category[]> => {
  // Убедимся, что категории загружены
  if (!categoriesLoaded) {
    await loadCategoriesFromSupabase();
  }
  
  return [...categories];
};

// Функция для загрузки категорий из Supabase
async function loadCategoriesFromSupabase(): Promise<void> {
  try {
    // Проверяем, нужно ли импортировать данные
    await migrateDataToSupabaseIfNeeded();
    
    // Загружаем категории из Supabase
    const supabaseCategories = await fetchCategoriesFromSupabase();
    
    if (supabaseCategories.length > 0) {
      categories = supabaseCategories;
      categoriesLoaded = true;
    } else {
      console.error("Не удалось загрузить категории из базы данных");
      // Возвращаемся к данным из localStorage в качестве запасного варианта
      categories = getInitialCategories();
    }
  } catch (error) {
    console.error("Ошибка при загрузке категорий из базы данных:", error);
    // Возвращаемся к данным из localStorage в качестве запасного варианта
    categories = getInitialCategories();
  }
}

// Загружаем категории из localStorage или используем значения по умолчанию
// Теперь используется только как запасной вариант
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

// Функция для добавления новой категории
export const addCategory = async (categoryName: string, imageUrl: string = "/placeholder.svg"): Promise<void> => {
  // Загружаем свежие категории, если они еще не загружены
  if (!categoriesLoaded) {
    await loadCategoriesFromSupabase();
  }
  
  if (!categories.some(cat => cat.name === categoryName)) {
    // Добавляем категорию в Supabase
    const added = await addCategoryToSupabase(categoryName, imageUrl);
    
    if (added) {
      // Добавляем категорию в локальный кеш
      categories.push({ name: categoryName, imageUrl });
    }
  }
};

// Функция для обновления изображения категории
export const updateCategoryImage = async (categoryName: string, imageUrl: string): Promise<void> => {
  // Загружаем свежие категории, если они еще не загружены
  if (!categoriesLoaded) {
    await loadCategoriesFromSupabase();
  }
  
  const categoryIndex = categories.findIndex(cat => cat.name === categoryName);
  if (categoryIndex !== -1) {
    // Обновляем изображение в Supabase
    const updated = await updateCategoryImageInSupabase(categoryName, imageUrl);
    
    if (updated) {
      // Обновляем изображение в локальном кеше
      categories[categoryIndex].imageUrl = imageUrl;
    }
  }
};

// Функция для удаления категории
export const removeCategory = async (categoryName: string): Promise<boolean> => {
  // Загружаем свежие категории, если они еще не загружены
  if (!categoriesLoaded) {
    await loadCategoriesFromSupabase();
  }
  
  // Проверяем, используется ли категория в продуктах
  const productsInCategory = await getProductsByCategory(categoryName);
  
  if (productsInCategory.length === 0) {
    // Если категория не используется, удаляем ее
    const removed = await removeCategoryFromSupabase(categoryName);
    
    if (removed) {
      // Удаляем категорию из локального кеша
      categories = categories.filter(cat => cat.name !== categoryName);
      return true;
    }
  }
  
  return false; // Если категория используется или не удалось удалить
};

// Функция для обновления продуктов при удалении категории
export const updateProductsCategory = async (oldCategory: string, newCategory: string): Promise<void> => {
  // Обновляем категорию для всех продуктов в Supabase
  const updated = await updateProductsCategoryInSupabase(oldCategory, newCategory);
  
  if (updated) {
    // Удаляем старую категорию после обновления продуктов
    await removeCategory(oldCategory);
  }
};

// Функция для получения продуктов по категории
export const getProductsByCategory = async (category: string) => {
  return await getProductsByCategoryFromSupabase(category);
};

// Инициируем загрузку категорий при импорте модуля
loadCategoriesFromSupabase();
