
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
  // Всегда обновляем категории из Supabase
  await loadCategoriesFromSupabase();
  
  // Возвращаем только имена категорий для совместимости с существующим кодом
  return categories.map(category => category.name);
};

// Функция для получения объектов категорий
export const getCategoryObjects = async (): Promise<Category[]> => {
  // Всегда обновляем категории из Supabase
  await loadCategoriesFromSupabase();
  
  return [...categories];
};

// Функция для загрузки категорий из Supabase
async function loadCategoriesFromSupabase(): Promise<void> {
  try {
    // Загружаем категории из Supabase без учета локального кэша
    const supabaseCategories = await fetchCategoriesFromSupabase();
    
    categories = supabaseCategories;
    categoriesLoaded = true;
    
    console.log("Категории загружены из Supabase:", categories);
  } catch (error) {
    console.error("Ошибка при загрузке категорий из базы данных:", error);
    categories = [];
  }
}

// Функция для добавления новой категории
export const addCategory = async (categoryName: string, imageUrl: string = "/placeholder.svg"): Promise<void> => {
  // Добавляем категорию в Supabase
  const added = await addCategoryToSupabase(categoryName, imageUrl);
  
  if (added) {
    // Перезагружаем категории из базы
    await loadCategoriesFromSupabase();
  }
};

// Функция для обновления изображения категории
export const updateCategoryImage = async (categoryName: string, imageUrl: string): Promise<void> => {
  // Обновляем изображение в Supabase
  const updated = await updateCategoryImageInSupabase(categoryName, imageUrl);
  
  if (updated) {
    // Перезагружаем категории из базы
    await loadCategoriesFromSupabase();
  }
};

// Функция для удаления категории
export const removeCategory = async (categoryName: string): Promise<boolean> => {
  // Проверяем, используется ли категория в продуктах
  const productsInCategory = await getProductsByCategory(categoryName);
  
  if (productsInCategory.length === 0) {
    // Если категория не используется, удаляем ее
    const removed = await removeCategoryFromSupabase(categoryName);
    
    if (removed) {
      // Перезагружаем категории из базы
      await loadCategoriesFromSupabase();
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

// Загружаем категории при импорте модуля
loadCategoriesFromSupabase();
