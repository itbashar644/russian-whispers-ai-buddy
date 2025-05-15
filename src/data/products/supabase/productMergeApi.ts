
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { transformProductToSupabase, transformSupabaseToProduct } from "./productTransforms";
import { Json } from "@/integrations/supabase/types";

/**
 * Merges products by model name by keeping the first product as the main one
 * and archiving the rest
 */
export const mergeProductsByModelName = async (productIds: string[]): Promise<boolean> => {
  try {
    if (productIds.length < 2) {
      console.error("Для объединения требуется минимум два товара");
      return false;
    }

    // Get all the products
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    if (fetchError) {
      console.error("Ошибка при получении товаров для объединения:", fetchError);
      return false;
    }

    if (!products || products.length < 2) {
      console.error("Не найдено достаточно товаров для объединения");
      return false;
    }

    // Take first product as the main one
    const mainProduct = products[0];
    const modelName = mainProduct.model_name || `merged-${Date.now()}`;

    // Update the main product with the model name if it doesn't have one
    if (!mainProduct.model_name) {
      const { error: updateError } = await supabase
        .from("products")
        .update({ model_name: modelName })
        .eq("id", mainProduct.id);

      if (updateError) {
        console.error("Ошибка при обновлении основного товара:", updateError);
        return false;
      }
    }

    // Update all other products with the same model name and archive them
    const otherProductIds = productIds.slice(1);
    const { error: archiveError } = await supabase
      .from("products")
      .update({ model_name: modelName, archived: true })
      .in("id", otherProductIds);

    if (archiveError) {
      console.error("Ошибка при архивировании объединяемых товаров:", archiveError);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Ошибка при объединении товаров:", err);
    return false;
  }
};

/**
 * Gets products with the same model name
 */
export const getProductsByModelName = async (modelName: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("model_name", modelName)
      .order("archived", { ascending: true });

    if (error) {
      console.error("Ошибка при получении товаров по модели:", error);
      throw error;
    }

    // Transform the raw database data to Product type using our transformer
    return (data || []).map(item => transformSupabaseToProduct(item));
  } catch (err) {
    console.error("Ошибка при получении товаров по модели:", err);
    throw err;
  }
};

/**
 * Bulk delete products
 */
export const bulkDeleteProducts = async (productIds: string[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .in("id", productIds);

    if (error) {
      console.error("Ошибка при удалении товаров:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Ошибка при удалении товаров:", err);
    return false;
  }
};

/**
 * Bulk archive products
 */
export const bulkArchiveProducts = async (productIds: string[], archive: boolean = true): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .update({ archived: archive })
      .in("id", productIds);

    if (error) {
      console.error(`Ошибка при ${archive ? 'архивации' : 'восстановлении'} товаров:`, error);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Ошибка при ${archive ? 'архивации' : 'восстановлении'} товаров:`, err);
    return false;
  }
};

// Export a simple reference to the API functions
export const productMergeApi = {
  mergeProductsByModelName,
  getProductsByModelName,
  bulkDeleteProducts,
  bulkArchiveProducts
};
