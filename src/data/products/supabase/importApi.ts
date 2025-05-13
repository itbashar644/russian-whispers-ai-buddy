
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { transformProductToSupabase } from "./productTransforms";

// Using the same interface structure as in migrationApi.ts
interface Category {
  name: string;
  imageUrl: string;
  id?: string;
}

// Функция для импорта всех категорий в Supabase
export const importCategoriesIntoSupabase = async (categories: Category[]): Promise<boolean> => {
  try {
    // Проверяем, есть ли уже категории в базе
    const { count } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });
    
    if (count && count > 0) {
      console.log("Категории уже существуют в базе данных, импорт не требуется");
      return true;
    }

    // Импортируем все категории
    const { error } = await supabase
      .from("categories")
      .insert(
        categories.map(cat => ({
          name: cat.name,
          image_url: cat.imageUrl // Using imageUrl from our interface to map to image_url in DB
        }))
      );

    if (error) {
      console.error("Ошибка при импорте категорий:", error);
      return false;
    }
    
    console.log("Категории успешно импортированы в базу данных");
    return true;
  } catch (err) {
    console.error("Ошибка при импорте категорий:", err);
    return false;
  }
};

// Функция для импорта всех товаров в Supabase
export const importProductsIntoSupabase = async (products: Product[]): Promise<boolean> => {
  try {
    // Проверяем, есть ли уже товары в базе
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });
    
    if (count && count > 0) {
      console.log("Товары уже существуют в базе данных, импорт не требуется");
      return true;
    }

    // Импортируем товары порциями, чтобы избежать проблем с размером запроса
    const batchSize = 50;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      // Преобразуем данные товаров в формат для Supabase
      const transformedBatch = batch.map(product => transformProductToSupabase(product));
      
      const { error } = await supabase
        .from("products")
        .insert(transformedBatch);

      if (error) {
        console.error("Ошибка при импорте товаров (партия", i/batchSize + 1, "):", error);
        return false;
      }
    }
    
    console.log("Товары успешно импортированы в базу данных");
    return true;
  } catch (err) {
    console.error("Ошибка при импорте товаров:", err);
    return false;
  }
};
