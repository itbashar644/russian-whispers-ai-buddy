
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { getFromStorage } from "../utils";
import { importCategoriesIntoSupabase, importProductsIntoSupabase } from "./importApi";

// Define the Category interface locally since it's not exported from types/product.ts
interface Category {
  name: string;
  imageUrl: string; // Changed from image_url to imageUrl to match categoryData.ts
  id?: string;
}

// Функция для миграции данных из localStorage при первом запуске
export const migrateDataToSupabaseIfNeeded = async (): Promise<boolean> => {
  try {
    // Проверяем, нужно ли делать импорт (если данных нет в базе)
    const { count: categoriesCount } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });
    
    const { count: productsCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });
    
    // Если данные уже есть в базе, то миграция не требуется
    if ((categoriesCount && categoriesCount > 0) || (productsCount && productsCount > 0)) {
      console.log("Данные уже есть в базе данных, миграция не требуется");
      return true;
    }

    // Получаем данные из localStorage
    const localCategories = getFromStorage<Category[]>('catalog_categories', []);
    const localProducts = getFromStorage<Product[]>('catalog_products', []);

    if (!localCategories.length && !localProducts.length) {
      console.log("Нет данных для миграции в localStorage");
      return false;
    }

    // Импортируем категории
    const categoriesImportResult = await importCategoriesIntoSupabase(localCategories);
    if (!categoriesImportResult) {
      console.error("Не удалось импортировать категории");
      return false;
    }

    // Импортируем товары
    const productsImportResult = await importProductsIntoSupabase(localProducts);
    if (!productsImportResult) {
      console.error("Не удалось импортировать товары");
      return false;
    }

    console.log("Миграция данных в Supabase успешно завершена");
    return true;
  } catch (err) {
    console.error("Ошибка при миграции данных в Supabase:", err);
    return false;
  }
};
