
import { Product } from "@/types/product";
import { addOrUpdateProductInSupabase } from "../../supabaseApi";
import { refreshCacheIfNeeded } from "../../cache/productCache";
import { invalidateCache } from "./productCacheService";

// Import the getProductById directly from productServiceBase to avoid circular dependency
import { getProductById as getBaseProductById } from "../productServiceBase";

/**
 * Check if a product is in stock
 */
export const checkProductStock = async (productId: string, colorVariant?: string): Promise<boolean> => {
  try {
    console.log(`Checking stock for product ${productId}, color: ${colorVariant || 'none'}`);
    const product = await getBaseProductById(productId);
    
    if (!product) {
      console.log(`Stock check: Product ${productId} not found`);
      return false;
    }
    
    // Check specific color variant stock if specified
    if (colorVariant && product.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === colorVariant);
      if (variant) {
        // Проверяем наличие stockQuantity и его значение
        const hasStock = variant.stockQuantity !== undefined ? variant.stockQuantity > 0 : false;
        console.log(`Stock check for ${productId}, color ${colorVariant}: ${hasStock ? 'In stock' : 'Out of stock'}`);
        return hasStock;
      }
      return false;
    }
    
    // Check main product stock - must be based on actual quantity
    if (product.stockQuantity !== undefined) {
      const hasStock = product.stockQuantity > 0;
      console.log(`Stock check for ${productId}: ${hasStock ? 'In stock' : 'Out of stock'}, Quantity: ${product.stockQuantity}`);
      return hasStock;
    }
    
    // Fallback to inStock boolean if stockQuantity is not defined
    return product.inStock || false;
  } catch (error) {
    console.error("Error checking product stock:", error);
    return false;
  }
};

/**
 * Decrease product stock
 */
export const decreaseProductStock = async (productId: string, quantity = 1, colorVariant?: string): Promise<boolean> => {
  try {
    console.log(`Attempting to decrease stock for product ${productId}, quantity ${quantity}, color ${colorVariant || 'none'}`);
    const product = await getBaseProductById(productId);
    
    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      return false;
    }
    
    // Handle color variants
    if (colorVariant && product.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === colorVariant);
      if (variant) {
        console.log(`Found color variant ${colorVariant}, current stock: ${variant.stockQuantity}`);
        if (variant.stockQuantity !== undefined) {
          variant.stockQuantity = Math.max(0, variant.stockQuantity - quantity);
          console.log(`Updated variant stock to: ${variant.stockQuantity}`);
        } else {
          variant.stockQuantity = 0;
          console.log(`Variant had no stock quantity, setting to 0`);
        }
        
        // Update product's inStock status based on stock quantities
        const hasStock = product.colorVariants.some(v => (v.stockQuantity || 0) > 0);
        product.inStock = hasStock;
        
        // Update product with modified color variant
        const result = await addOrUpdateProductInSupabase({
          ...product,
          colorVariants: product.colorVariants
        });
        
        // Force refresh cache after stock update
        await invalidateCache();
        
        console.log(`Stock update result for variant: ${result.success ? 'Success' : 'Failed'}`);
        return result.success;
      }
    }
    
    // Handle main product stock
    if (product.stockQuantity !== undefined) {
      console.log(`Updating main product stock. Current: ${product.stockQuantity}`);
      product.stockQuantity = Math.max(0, product.stockQuantity - quantity);
      // Set inStock based on actual quantity
      product.inStock = product.stockQuantity > 0;
      
      console.log("Updating product stock:", productId, "New quantity:", product.stockQuantity, "In stock:", product.inStock);
      
      // Update product with new stock quantity
      const result = await addOrUpdateProductInSupabase(product);
      
      // Force refresh cache after stock update
      await invalidateCache();
      
      console.log("Stock update result:", result);
      
      return result.success;
    } else {
      console.log(`Product ${productId} has no stock quantity defined`);
      return false;
    }
  } catch (error) {
    console.error("Error decreasing product stock:", error);
    return false;
  }
};

/**
 * Update product stock directly (set to specific amount)
 */
export const updateProductStock = async (productId: string, newQuantity: number, colorVariant?: string): Promise<boolean> => {
  try {
    console.log(`Attempting to update stock for product ${productId} to ${newQuantity}, color ${colorVariant || 'none'}`);
    const product = await getBaseProductById(productId);
    
    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      return false;
    }
    
    // Handle color variants
    if (colorVariant && product.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === colorVariant);
      if (variant) {
        console.log(`Found color variant ${colorVariant}, current stock: ${variant.stockQuantity}`);
        variant.stockQuantity = Math.max(0, newQuantity);
        console.log(`Updated variant stock to: ${variant.stockQuantity}`);
        
        // Update inStock status for the variant based on actual quantity
        const hasAnyVariantStock = product.colorVariants.some(v => (v.stockQuantity || 0) > 0);
        product.inStock = hasAnyVariantStock;
        
        // Update product with modified color variant
        const result = await addOrUpdateProductInSupabase({
          ...product,
          colorVariants: product.colorVariants
        });
        
        // Force refresh cache after stock update
        await invalidateCache();
        
        console.log(`Stock update result for variant: ${result.success ? 'Success' : 'Failed'}`);
        return result.success;
      }
    }
    
    // Handle main product stock
    console.log(`Updating main product stock. Current: ${product.stockQuantity}`);
    product.stockQuantity = Math.max(0, newQuantity);
    // Always set inStock based on actual quantity
    product.inStock = product.stockQuantity > 0;
    
    console.log("Setting product stock:", productId, "New quantity:", product.stockQuantity, "In stock:", product.inStock);
    
    // Update product with new stock quantity
    const result = await addOrUpdateProductInSupabase(product);
    
    // Force refresh cache after stock update
    await invalidateCache();
    
    console.log("Stock update result:", result);
    
    return result.success;
  } catch (error) {
    console.error("Error updating product stock:", error);
    return false;
  }
};
