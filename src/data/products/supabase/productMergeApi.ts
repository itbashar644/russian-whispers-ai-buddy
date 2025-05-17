
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { transformProductToSupabase, transformSupabaseToProduct } from "./productTransforms";
import { Json } from "@/integrations/supabase/types";

/**
 * Merges products by model name by keeping the first product as the main one
 * and updating the other products to have the same model name without archiving them
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

    // Update all other products with the same model name WITHOUT archiving them
    const otherProductIds = productIds.slice(1);
    const { error: updateError } = await supabase
      .from("products")
      .update({ model_name: modelName })
      .in("id", otherProductIds);

    if (updateError) {
      console.error("Ошибка при обновлении объединяемых товаров:", updateError);
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
 * Combines merged products into a single product with color variants
 * This is useful for displaying merged products as a single product with color options
 */
export const combineProductVariants = (products: Product[]): Product => {
  if (!products || products.length === 0) {
    throw new Error("No products provided to combine");
  }
  
  // Use the first (main) product as the base
  const mainProduct = { ...products[0] };
  
  // If there are additional products, treat them as color variants
  if (products.length > 1) {
    const colorVariants = products.slice(1).map(product => {
      // Extract the color if available, or use title as a fallback
      const colorName = product.colors && product.colors.length > 0 
        ? product.colors[0] 
        : product.title.split(' ').pop() || 'Вариант';
      
      return {
        color: colorName,
        price: product.price,
        discountPrice: product.discountPrice,
        articleNumber: product.articleNumber,
        barcode: product.barcode,
        stockQuantity: product.stockQuantity,
        imageUrl: product.imageUrl,
        ozonUrl: product.ozonUrl,
        wildberriesUrl: product.wildberriesUrl,
        avitoUrl: product.avitoUrl,
        productId: product.id // Add product ID to reference the original product
      };
    });
    
    // Add all variants to the main product
    mainProduct.colorVariants = [
      ...(mainProduct.colorVariants || []),
      ...colorVariants
    ];
    
    // Ensure mainProduct.colors includes all colors from variants
    const allColors = new Set<string>();
    
    // Add main product color
    if (mainProduct.colors && mainProduct.colors.length > 0) {
      mainProduct.colors.forEach(color => allColors.add(color));
    }
    
    // Add variant colors
    colorVariants.forEach(variant => {
      allColors.add(variant.color);
    });
    
    mainProduct.colors = Array.from(allColors);
  }
  
  return mainProduct;
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
  combineProductVariants,
  bulkDeleteProducts,
  bulkArchiveProducts
};
