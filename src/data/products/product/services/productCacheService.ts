
import { refreshCacheIfNeeded } from "../../cache/productCache";

/**
 * Invalidates product cache
 */
export const invalidateCache = async (): Promise<void> => {
  console.log("Invalidating product cache");
  await refreshCacheIfNeeded(true);
  console.log("Product cache invalidated");
};

/**
 * Loads products into cache
 */
export const loadAllProducts = async (): Promise<void> => {
  console.log("Loading all products into cache");
  await refreshCacheIfNeeded(true);
  console.log("All products loaded into cache");
};
