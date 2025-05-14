
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
      throw error;
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
export const addOrUpdateProductInSupabase = async (product: Product): Promise<boolean> => {
  try {
    // Преобразуем данные товара в формат для Supabase
    const productData = transformProductToSupabase(product);
    console.log("Transformed product data for Supabase:", productData);

    if (product.id && product.id.length > 10) { // предполагаем, что действительные UUID длиннее 10 символов
      // Обновляем существующий товар
      console.log("Updating existing product with ID:", product.id);
      const { error, data } = await supabase
        .from("products")
        .update(productData)
        .eq("id", product.id)
        .select();

      if (error) {
        console.error("Ошибка при обновлении товара:", error);
        throw error;
      }
      
      console.log("Product update response:", data);
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
        throw error;
      }
      
      console.log("Product insert response:", data);
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при сохранении товара:", err);
    throw err;
  }
};

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
