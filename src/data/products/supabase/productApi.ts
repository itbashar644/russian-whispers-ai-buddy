
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { transformProductToSupabase, transformSupabaseToProduct } from "./productTransforms";

// Функция для получения всех продуктов из Supabase
export const fetchProductsFromSupabase = async (includeArchived: boolean = false): Promise<Product[]> => {
  try {
    let query = supabase
      .from("products")
      .select("*");
    
    if (!includeArchived) {
      query = query.eq("archived", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Ошибка при загрузке товаров:", error);
      throw new Error(`Ошибка при загрузке товаров: ${error.message}`);
    }

    if (!data || !Array.isArray(data)) {
      console.warn("Данные товаров не получены или не являются массивом");
      return [];
    }

    // Преобразуем данные из Supabase в тип Product
    return data.map(product => transformSupabaseToProduct(product));
  } catch (err) {
    console.error("Ошибка при загрузке товаров:", err);
    throw err; // Пробрасываем ошибку дальше для обработки на уровне UI
  }
};

// Функция для создания или обновления товара
export const addOrUpdateProductInSupabase = async (product: Product): Promise<{ success: boolean, data?: any, error?: string }> => {
  try {
    // Преобразуем данные товара в формат для Supabase
    const productData = transformProductToSupabase(product);
    console.log("Transformed product data for Supabase:", productData);

    // Проверяем, является ли ID временным (числовым) или действительным UUID
    const isTemporaryId = !product.id || 
                          product.id.toString().includes(Date.now().toString().slice(0, 5)) ||
                          !isValidUUID(product.id);
    
    if (!isTemporaryId) {
      // Обновляем существующий товар с действительным UUID
      console.log("Updating existing product with ID:", product.id);
      const { error, data } = await supabase
        .from("products")
        .update(productData)
        .eq("id", product.id)
        .select();

      if (error) {
        console.error("Ошибка при обновлении товара:", error);
        return { success: false, error: `Ошибка при обновлении товара: ${error.message}` };
      }
      
      console.log("Product update response:", data);
      return { success: true, data };
    } else {
      // Добавляем новый товар, удаляем id, чтобы Supabase сгенерировал новый
      const newProductData = { ...productData };
      delete newProductData.id;
      console.log("Adding new product, data:", newProductData);
      
      const { error, data } = await supabase
        .from("products")
        .insert(newProductData)
        .select();

      if (error) {
        console.error("Ошибка при добавлении нового товара:", error);
        return { success: false, error: `Ошибка при добавлении товара: ${error.message}` };
      }
      
      console.log("Product insert response:", data);
      return { success: true, data };
    }
  } catch (err) {
    console.error("Ошибка при сохранении товара:", err);
    const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка";
    return { success: false, error: errorMessage };
  }
};

// Вспомогательная функция для проверки действительности UUID
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Функция для архивирования товара
export const archiveProductInSupabase = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .update({ archived: true })
      .eq("id", productId);

    if (error) {
      console.error("Ошибка при архивировании товара:", error);
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при архивировании товара:", err);
    throw err;
  }
};

// Функция для восстановления товара из архива
export const restoreProductInSupabase = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .update({ archived: false })
      .eq("id", productId);

    if (error) {
      console.error("Ошибка при восстановлении товара из архива:", error);
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при восстановлении товара из архива:", err);
    throw err;
  }
};

// Функция для удаления товара
export const removeProductFromSupabase = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Ошибка при удалении товара:", error);
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при удалении товара:", err);
    throw err;
  }
};

// Функция для получения товара по ID
export const getProductByIdFromSupabase = async (id: string): Promise<Product | undefined> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Ошибка при загрузке товара по ID:", error);
      throw error;
    }

    // Преобразуем данные из Supabase в тип Product
    return transformSupabaseToProduct(data);
  } catch (err) {
    console.error("Ошибка при загрузке товара по ID:", err);
    throw err;
  }
};

// Функция для получения товаров по категории
export const getProductsByCategoryFromSupabase = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .eq("archived", false);

    if (error) {
      console.error("Ошибка при загрузке товаров по категории:", error);
      throw error;
    }

    // Преобразуем данные из Supabase в тип Product
    return data.map(product => transformSupabaseToProduct(product));
  } catch (err) {
    console.error("Ошибка при загрузке товаров по категории:", err);
    throw err;
  }
};
