import { Product } from "@/types/product";
import { fetchProductsFromSupabase } from "../supabaseApi";

// Cache variables
let productsCache: Product[] = [];
let productsCacheLoaded = false;
let lastCacheUpdateTime = 0;
const CACHE_TTL = 5000; // 5 seconds in milliseconds - reduced for more frequent updates

// Function to check and update cache
export const refreshCacheIfNeeded = async (forceRefresh = false): Promise<void> => {
  const now = Date.now();
  
  // Update cache if it's expired or force refresh is requested
  if (forceRefresh || !productsCacheLoaded || now - lastCacheUpdateTime > CACHE_TTL) {
    try {
      console.log("Refreshing products cache", forceRefresh ? "(forced)" : "");
      // Load all active products
      productsCache = await fetchProductsFromSupabase(false);
      productsCacheLoaded = true;
      lastCacheUpdateTime = now;
      console.log("Product cache updated from Supabase:", productsCache.length, "products");
    } catch (error) {
      console.error("Error updating product cache:", error);
      // Keep existing cache in case of error
      if (!productsCacheLoaded) {
        productsCache = [];
      }
      throw error; // Propagate the error to let callers know something went wrong
    }
  }
};

// Get products cache
export const getProductsCache = (): Product[] => {
  return [...productsCache];
};

// Initialize product cache when module is imported
refreshCacheIfNeeded(true).catch(err => {
  console.error("Failed to initialize product cache:", err);
});

// Export products via variable for compatibility with existing code
export let products: Product[] = [];
(async () => {
  try {
    await refreshCacheIfNeeded(true);
    products = getProductsCache();
  } catch (error) {
    console.error("Error initializing products variable:", error);
  }
})();
