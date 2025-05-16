
import { Product } from "@/types/product";
import { getProductsCache, refreshCacheIfNeeded } from "../cache/productCache";
import { productMergeApi } from "../supabase/productMergeApi";
import { getProductByIdFromSupabase, fetchProductsFromSupabase } from "../supabaseApi";
import { getProductById as getProductByIdBase } from "./productServiceBase";

// Import the services
import * as ProductCacheService from "./services/productCacheService";
import * as ProductColorService from "./services/productColorService";
import * as ProductFilterService from "./services/productFilterService";
import * as ProductStockService from "./services/productStockService";

// Export the services - avoid using ProductStockService.checkProductStock directly
// This fixes the circular dependency issue
export const invalidateCache = ProductCacheService.invalidateCache;
export const loadAllProducts = ProductCacheService.loadAllProducts;

export const linkProductsByColor = ProductColorService.linkProductsByColor;
export const getRelatedColorProducts = ProductColorService.getRelatedColorProducts;

export const getAllProductsCached = ProductFilterService.getAllProductsCached;
export const getProductsByCategory = ProductFilterService.getProductsByCategory;
export const getActiveProducts = ProductFilterService.getActiveProducts;
export const getBestsellers = ProductFilterService.getBestsellers;
export const getNewProducts = ProductFilterService.getNewProducts;
export const getRelatedProducts = ProductFilterService.getRelatedProducts;

export const checkProductStock = ProductStockService.checkProductStock;
export const decreaseProductStock = ProductStockService.decreaseProductStock;

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
      console.log("Product not found in cache, fetching from Supabase:", id);
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
