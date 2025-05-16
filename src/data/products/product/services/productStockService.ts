import { Product } from "@/types/product";
import { getProductById as getProductByIdBase } from "../productServiceBase";
import { addOrUpdateProduct } from "../productServiceBase";

/**
 * Decreases the stock quantity of a product
 */
export const decreaseProductStock = async (
  productId: string,
  quantity: number = 1,
  colorVariant: string | null = null
): Promise<boolean> => {
  try {
    // Get the product first to check current stock
    const product = await getProductByIdBase(productId);
    
    if (!product) {
      console.error("Product not found:", productId);
      return false;
    }
    
    // If there's a color variant specified, update that specific variant's stock
    if (colorVariant && product.colorVariants?.length) {
      const variantIndex = product.colorVariants.findIndex(
        v => v.color === colorVariant
      );
      
      if (variantIndex === -1) {
        console.error("Color variant not found:", colorVariant);
        return false;
      }
      
      const currentStock = product.colorVariants[variantIndex].stockQuantity || 0;
      
      if (currentStock < quantity) {
        console.error("Not enough stock for variant:", colorVariant);
        return false;
      }
      
      // Update the variant's stock
      product.colorVariants[variantIndex].stockQuantity = currentStock - quantity;
      
      // Check if we need to update the overall product stock status
      const hasAnyStock = product.colorVariants.some(v => (v.stockQuantity || 0) > 0);
      product.inStock = hasAnyStock;
      
    } else {
      // Update the main product stock
      const currentStock = product.stockQuantity || 0;
      
      if (currentStock < quantity) {
        console.error("Not enough stock for product:", productId);
        return false;
      }
      
      product.stockQuantity = currentStock - quantity;
      product.inStock = product.stockQuantity > 0;
    }
    
    // Save the updated product
    const result = await addOrUpdateProduct(product);
    return result;
  } catch (error) {
    console.error("Error decreasing product stock:", error);
    return false;
  }
};

/**
 * Checks if a product is in stock
 */
export const checkProductStock = async (
  productId: string,
  colorVariant: string | null = null
): Promise<boolean> => {
  try {
    const product = await getProductByIdBase(productId);
    
    if (!product) {
      return false;
    }
    
    // Check specific color variant stock if requested
    if (colorVariant && product.colorVariants?.length) {
      const variant = product.colorVariants.find(v => v.color === colorVariant);
      return variant?.stockQuantity !== undefined && variant.stockQuantity > 0;
    }
    
    // Otherwise check general product stock
    return product.inStock && (product.stockQuantity !== undefined ? product.stockQuantity > 0 : false);
  } catch (error) {
    console.error("Error checking product stock:", error);
    return false;
  }
};
