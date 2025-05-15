
import { Product } from "@/types/product";
import {
  getProductsCache,
  refreshCacheIfNeeded,
} from "../cache/productCache";
import { productMergeApi } from "../supabase/productMergeApi";
import { getProductByIdFromSupabase, fetchProductsFromSupabase } from "../supabaseApi";
import { getProductById as getProductByIdBase } from "./productServiceBase";

/**
 * Gets all products from cache
 */
export const getAllProductsCached = async (): Promise<Product[]> => {
  await refreshCacheIfNeeded();
  return getProductsCache();
};

/**
 * Gets products by category from cache
 */
export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  await refreshCacheIfNeeded();
  return getProductsCache().filter(product => 
    product.category === category && !product.archived
  );
};

/**
 * Gets active products (not archived)
 */
export const getActiveProducts = async (): Promise<Product[]> => {
  await refreshCacheIfNeeded();
  return getProductsCache().filter(product => !product.archived);
};

/**
 * Gets a product by ID from cache or Supabase
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    // First try to get from cache
    const cachedProducts = getProductsCache();
    let product = cachedProducts.find(p => p.id === id) || null;
    
    // If not in cache, get directly from Supabase
    if (!product) {
      product = await getProductByIdFromSupabase(id) || null;
    }
    
    if (!product) {
      return null;
    }
    
    // If the product has a model name, get all products with the same model name
    if (product.modelName) {
      try {
        const modelProducts = await productMergeApi.getProductsByModelName(product.modelName);
        
        if (modelProducts && modelProducts.length > 1) {
          // Combine all products with the same model name into a single product with variants
          const combinedProduct = productMergeApi.combineProductVariants(modelProducts);
          return combinedProduct;
        }
      } catch (error) {
        console.error("Error fetching model products:", error);
      }
    }
    
    return product;
  } catch (error) {
    console.error("Error in getProductById:", error);
    return null;
  }
};

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
    const product = await getProductById(productId);
    
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

/**
 * Gets related products for a product (same category, excluding the product itself)
 * @param productId ID of the product
 * @param limit Maximum number of related products to return
 * @returns Array of related products
 */
export const getRelatedProducts = async (productId: string, limit = 4): Promise<Product[]> => {
  try {
    const product = await getProductById(productId);
    
    if (!product) {
      return [];
    }
    
    // Get all products in the same category
    const categoryProducts = (await getProductsByCategory(product.category))
      .filter(p => p.id !== productId && !p.archived);
    
    // Return a random selection of products from the same category
    return categoryProducts.sort(() => 0.5 - Math.random()).slice(0, limit);
  } catch (error) {
    console.error("Error getting related products:", error);
    return [];
  }
};

/**
 * Gets bestseller products
 */
export const getBestsellers = async (limit = 8): Promise<Product[]> => {
  await refreshCacheIfNeeded();
  return getProductsCache()
    .filter(product => product.isBestseller && !product.archived)
    .slice(0, limit);
};

/**
 * Gets new products
 */
export const getNewProducts = async (limit = 8): Promise<Product[]> => {
  await refreshCacheIfNeeded();
  return getProductsCache()
    .filter(product => product.isNew && !product.archived)
    .slice(0, limit);
};

/**
 * Check if a product is in stock
 */
export const checkProductStock = async (productId: string, colorVariant?: string): Promise<boolean> => {
  const product = await getProductById(productId);
  
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
    // Implementation would update stock in database
    // This is a placeholder that would need to be implemented with actual database updates
    console.log(`Decreasing stock for product ${productId} by ${quantity} units`);
    return true;
  } catch (error) {
    console.error("Error decreasing product stock:", error);
    return false;
  }
};

/**
 * Invalidates product cache
 */
export const invalidateCache = async (): Promise<void> => {
  await refreshCacheIfNeeded(true);
};

/**
 * Loads products into cache
 */
export const loadAllProducts = async (): Promise<void> => {
  await refreshCacheIfNeeded(true);
};
