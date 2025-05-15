import { Product } from "@/types/product";
import {
  getAllProducts,
  getProductByIdCached,
  getProductsByCategoryCached,
  invalidateProductCache,
  loadProducts,
} from "../cache/productCache";
import { productMergeApi } from "../supabase/productMergeApi";

/**
 * Gets all products from cache
 */
export const getAllProductsCached = async (): Promise<Product[]> => {
  return await getAllProducts();
};

/**
 * Gets products by category from cache
 */
export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  return await getProductsByCategoryCached(category);
};

/**
 * Gets a product by ID from cache
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const product = await getProductByIdCached(id);
    
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
 * Invalidates product cache
 */
export const invalidateCache = async (): Promise<void> => {
  await invalidateProductCache();
};

/**
 * Loads products into cache
 */
export const loadAllProducts = async (): Promise<void> => {
  await loadProducts();
};
