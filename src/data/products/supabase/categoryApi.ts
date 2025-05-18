
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/data/products";

// Функция для получения всех категорий из Supabase
export const fetchCategoriesFromSupabase = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*");

    if (error) {
      console.error("Ошибка при загрузке категорий:", error);
      return [];
    }

    return data.map(category => ({
      name: category.name,
      imageUrl: category.image_url
    }));
  } catch (err) {
    console.error("Ошибка при загрузке категорий:", err);
    return [];
  }
};

// Функция для добавления новой категории
export const addCategoryToSupabase = async (name: string, imageUrl: string = "/placeholder.svg"): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("categories")
      .insert({
        name,
        image_url: imageUrl
      });

    if (error) {
      console.error("Ошибка при добавлении категории:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при добавлении категории:", err);
    return false;
  }
};

// Функция для обновления изображения категории
export const updateCategoryImageInSupabase = async (name: string, imageUrl: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("categories")
      .update({ image_url: imageUrl })
      .eq("name", name);

    if (error) {
      console.error("Ошибка при обновлении изображения категории:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при обновлении изображения категории:", err);
    return false;
  }
};

// Функция для удаления категории
export const removeCategoryFromSupabase = async (name: string): Promise<boolean> => {
  try {
    // Проверяем, есть ли товары в этой категории
    const { data: products, error: countError } = await supabase
      .from("products")
      .select("id")
      .eq("category", name);

    if (countError) {
      console.error("Ошибка при проверке товаров в категории:", countError);
      return false;
    }

    if (products && products.length > 0) {
      console.error("Невозможно удалить категорию, так как в ней есть товары");
      return false;
    }

    // Удаляем категорию
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("name", name);

    if (error) {
      console.error("Ошибка при удалении категории:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при удалении категории:", err);
    return false;
  }
};

// Функция для обновления категории товаров при удалении категории
export const updateProductsCategoryInSupabase = async (oldCategory: string, newCategory: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .update({ category: newCategory })
      .eq("category", oldCategory);

    if (error) {
      console.error("Ошибка при обновлении категории товаров:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Ошибка при обновлении категории товаров:", err);
    return false;
  }
};

// Функция для удаления категории "Другое"
export const removeOtherCategory = async (): Promise<boolean> => {
  try {
    // Проверяем, существует ли категория "Другое"
    const { data: categoryData } = await supabase
      .from("categories")
      .select("name")
      .eq("name", "Другое")
      .single();
    
    if (!categoryData) {
      console.log("Категория 'Другое' не найдена");
      return false;
    }
    
    // Проверяем, есть ли товары в этой категории
    const { data: products } = await supabase
      .from("products")
      .select("id")
      .eq("category", "Другое");
    
    // Если есть товары, то перемещаем их в категорию "Разное" или создаем ее
    if (products && products.length > 0) {
      // Проверяем, существует ли категория "Разное"
      const { data: miscCategory } = await supabase
        .from("categories")
        .select("name")
        .eq("name", "Разное")
        .single();
      
      if (!miscCategory) {
        // Если нет, то создаем ее
        await supabase
          .from("categories")
          .insert({ name: "Разное", image_url: "/placeholder.svg" });
      }
      
      // Перемещаем товары из "Другое" в "Разное"
      await updateProductsCategoryInSupabase("Другое", "Разное");
    }
    
    // Удаляем категорию "Другое"
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("name", "Другое");
    
    if (error) {
      console.error("Ошибка при удалении категории 'Другое':", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при удалении категории 'Другое':", err);
    return false;
  }
};
