
import { Product } from "@/types/product";
import { 
  fetchProductsFromSupabase, 
  getProductByIdFromSupabase, 
  getProductsByCategoryFromSupabase, 
  addOrUpdateProductInSupabase, 
  archiveProductInSupabase, 
  restoreProductInSupabase, 
  removeProductFromSupabase 
} from "../supabaseApi";
import { refreshCacheIfNeeded, getProductsCache } from "../cache/productCache";
import { generateRandomRating } from "../utils";

// Export products through getter for compatibility with existing code
export const getProducts = async (includeArchived = false): Promise<Product[]> => {
  try {
    if (includeArchived) {
      // If archived products are needed, load directly from database
      return await fetchProductsFromSupabase(true);
    }
    
    // Always update cache when requesting products
    await refreshCacheIfNeeded();
    
    return getProductsCache();
  } catch (error) {
    console.error("Error getting products:", error);
    // Return empty array instead of throwing exception
    return [];
  }
};

// Function to add or update product
export const addOrUpdateProduct = async (product: Product): Promise<boolean> => {
  try {
    // If rating is not specified, generate random in range from 4.7 to 4.9
    if (!product.rating) {
      product.rating = generateRandomRating();
    }
    
    // Calculate inStock status based on stock quantity
    if (product.stockQuantity !== undefined) {
      product.inStock = product.stockQuantity > 0;
    } else {
      product.inStock = false;
    }
    
    // Update colorVariants stock status
    if (product.colorVariants && product.colorVariants.length > 0) {
      // Check if at least one color has stock
      const hasColorStock = product.colorVariants.some(variant => 
        variant.stockQuantity !== undefined && variant.stockQuantity > 0
      );
      
      // If at least one color has stock, the product is in stock
      if (hasColorStock) {
        product.inStock = true;
      }
    }
    
    // Save product to Supabase
    const result = await addOrUpdateProductInSupabase(product);
    
    if (result.success) {
      // Force refresh cache
      await refreshCacheIfNeeded(true);
    }
    
    return result.success;
  } catch (error) {
    console.error("Error adding/updating product:", error);
    return false;
  }
};

// Function to archive product
export const archiveProduct = async (productId: string): Promise<boolean> => {
  try {
    const success = await archiveProductInSupabase(productId);
    
    if (success) {
      // Force refresh cache
      await refreshCacheIfNeeded(true);
    }
    
    return success;
  } catch (error) {
    console.error("Error archiving product:", error);
    return false;
  }
};

// Function to restore product from archive
export const restoreProduct = async (productId: string): Promise<boolean> => {
  try {
    const success = await restoreProductInSupabase(productId);
    
    if (success) {
      // Force refresh cache
      await refreshCacheIfNeeded(true);
    }
    
    return success;
  } catch (error) {
    console.error("Error restoring product from archive:", error);
    return false;
  }
};

// Function to remove product
export const removeProduct = async (productId: string): Promise<boolean> => {
  try {
    const success = await removeProductFromSupabase(productId);
    
    if (success) {
      // Force refresh cache
      await refreshCacheIfNeeded(true);
    }
    
    return success;
  } catch (error) {
    console.error("Error removing product:", error);
    return false;
  }
};

// Function to get product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    return await getProductByIdFromSupabase(id);
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return undefined;
  }
};

// Function to get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    if (!category) {
      // Return all active products
      await refreshCacheIfNeeded();
      return getProductsCache();
    }
    
    return await getProductsByCategoryFromSupabase(category);
  } catch (error) {
    console.error("Error getting products by category:", error);
    return [];
  }
};
