
import { Product } from "@/types/product";
import { productMergeApi } from "../../supabase/productMergeApi";
import { getProductById as getProductByIdBase } from "../productServiceBase";
import { refreshCacheIfNeeded } from "../../cache/productCache";

/**
 * Link products by color (same model, different colors)
 * @param productIds Array of product IDs to link
 * @returns Boolean indicating success
 */
export const linkProductsByColor = async (productIds: string[]): Promise<boolean> => {
  try {
    if (!productIds || productIds.length < 2) {
      return false;
    }
    
    // Generate a model name if products don't have one
    const modelName = `model_${Date.now()}`;
    
    // Update each product with the same model name
    for (const id of productIds) {
      const product = await getProductByIdBase(id);
      if (product) {
        product.modelName = modelName;
        // Use the Supabase API to update the product
        await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });
      }
    }
    
    // Invalidate cache to reflect changes
    await refreshCacheIfNeeded(true);
    
    return true;
  } catch (error) {
    console.error("Error linking products by color:", error);
    return false;
  }
};

/**
 * Gets related products by color for a product
 * @param productId ID of the product
 * @returns Array of related color products
 */
export const getRelatedColorProducts = async (productId: string): Promise<Product[]> => {
  try {
    // Use the import to avoid circular dependencies
    const product = await import("../productServiceSpecialized").then(module => module.getProductById(productId));
    
    if (!product || !product.modelName) {
      return [];
    }
    
    // Get all products with the same model name
    const relatedProducts = await productMergeApi.getProductsByModelName(product.modelName);
    
    // Filter out the current product
    return relatedProducts.filter(p => p.id !== productId);
  } catch (error) {
    console.error("Error getting related color products:", error);
    return [];
  }
};
