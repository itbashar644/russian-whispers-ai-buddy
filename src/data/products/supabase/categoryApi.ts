
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
    console.log("Attempting to update category image for:", name, "with URL:", imageUrl);
    
    // Проверяем наличие текущей сессии пользователя
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      console.error("Ошибка при обновлении изображения: пользователь не авторизован");
      return false;
    }

    // Логируем информацию о текущем пользователе
    console.log("Current user:", sessionData.session.user.id, sessionData.session.user.email);
    
    const { error } = await supabase
      .from("categories")
      .update({ image_url: imageUrl })
      .eq("name", name);

    if (error) {
      console.error("Ошибка при обновлении изображения категории:", error);
      return false;
    }
    
    console.log("Category image updated successfully");
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

// Функция для получения продуктов по категории - переименована для избежания конфликта
export const getProductsByCategoryNameFromSupabase = async (category: string) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category);

    if (error) {
      console.error("Ошибка при получении продуктов по категории:", error);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Ошибка при получении продуктов по категории:", err);
    return [];
  }
};
