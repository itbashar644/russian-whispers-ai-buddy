
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
      return [];
    }

    // Преобразуем данные из Supabase в тип Product
    return data.map(product => transformSupabaseToProduct(product));
  } catch (err) {
    console.error("Ошибка при загрузке товаров:", err);
    return [];
  }
};

// Функция для создания или обновления товара
export const addOrUpdateProductInSupabase = async (product: Product): Promise<boolean> => {
  try {
    // Преобразуем данные товара в формат для Supabase
    const productData = transformProductToSupabase(product);

    if (product.id && product.id.length > 10) { // предполагаем, что действительные UUID длиннее 10 символов
      // Обновляем существующий товар
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", product.id);

      if (error) {
        console.error("Ошибка при обновлении товара:", error);
        return false;
      }
    } else {
      // Добавляем новый товар
      const { error } = await supabase
        .from("products")
        .insert(productData);

      if (error) {
        console.error("Ошибка при добавлении нового товара:", error);
        return false;
      }
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при сохранении товара:", err);
    return false;
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
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при архивировании товара:", err);
    return false;
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
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при восстановлении товара из архива:", err);
    return false;
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
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при удалении товара:", err);
    return false;
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
      return undefined;
    }

    // Преобразуем данные из Supabase в тип Product
    return transformSupabaseToProduct(data);
  } catch (err) {
    console.error("Ошибка при загрузке товара по ID:", err);
    return undefined;
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
      return [];
    }

    // Преобразуем данные из Supabase в тип Product
    return data.map(product => transformSupabaseToProduct(product));
  } catch (err) {
    console.error("Ошибка при загрузке товаров по категории:", err);
    return [];
  }
};
