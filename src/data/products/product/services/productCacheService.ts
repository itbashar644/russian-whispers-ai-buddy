
import { refreshCacheIfNeeded } from "../../cache/productCache";

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
