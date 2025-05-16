
import { Product } from "@/types/product";
import { addOrUpdateProductInSupabase } from "../../supabaseApi";
import { refreshCacheIfNeeded } from "../../cache/productCache";

/**
 * Check if a product is in stock
 */
export const checkProductStock = async (productId: string, colorVariant?: string): Promise<boolean> => {
  const product = await import("../productServiceSpecialized").then(module => module.getProductById(productId));
  
  if (!product) {
    return false;
  }
  
  if (colorVariant && product.colorVariants) {
    const variant = product.colorVariants.find(v => v.color === colorVariant);
    return variant ? (variant.stockQuantity || 0) > 0 : false;
  }
  
  return product.inStock && (product.stockQuantity || 0) > 0;
};

/**
 * Decrease product stock
 */
export const decreaseProductStock = async (productId: string, quantity = 1, colorVariant?: string): Promise<boolean> => {
  try {
    const product = await import("../productServiceSpecialized").then(module => module.getProductById(productId));
    
    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      return false;
    }
    
    // Handle color variants
    if (colorVariant && product.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === colorVariant);
      if (variant) {
        if (variant.stockQuantity !== undefined) {
          variant.stockQuantity = Math.max(0, variant.stockQuantity - quantity);
        } else {
          variant.stockQuantity = 0;
        }
        
        // Update product with modified color variant
        const result = await addOrUpdateProductInSupabase({
          ...product,
          colorVariants: product.colorVariants
        });
        
        // Force refresh cache after stock update
        await refreshCacheIfNeeded(true);
        
        return result.success;
      }
    }
    
    // Handle main product stock
    if (product.stockQuantity !== undefined) {
      product.stockQuantity = Math.max(0, product.stockQuantity - quantity);
      product.inStock = product.stockQuantity > 0;
      
      console.log("Updating product stock:", productId, "New quantity:", product.stockQuantity, "In stock:", product.inStock);
      
      // Update product with new stock quantity
      const result = await addOrUpdateProductInSupabase(product);
      
      // Force refresh cache after stock update
      await refreshCacheIfNeeded(true);
      
      console.log("Stock update result:", result);
      
      return result.success;
    }
    
    return false;
  } catch (error) {
    console.error("Error decreasing product stock:", error);
    return false;
  }
};
