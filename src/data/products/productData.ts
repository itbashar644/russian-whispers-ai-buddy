
// Re-export from cache/productCache
export * from './cache/productCache';

// Re-export from product/productServiceBase
export * from './product/productServiceBase';

// Add utility functions for product stock
export function checkProductStock(productId: string, quantity: number = 1, color?: string): boolean {
  // For now, a simple implementation that always returns true
  // In a real application, this would check against the actual stock
  return true;
}

export function decreaseProductStock(productId: string, quantity: number = 1, color?: string): boolean {
  // For now, a simple implementation that always returns true
  // In a real application, this would decrease the stock in the database
  return true;
}

// Re-export specialized functions with unique names
export {
  getAllProductsCached,
  getActiveProducts,
  getBestsellers,
  getNewProducts,
  getRelatedProducts,
  getRelatedColorProducts,
  linkProductsByColor,
  invalidateCache,
  loadAllProducts,
  // Re-export getProductById from specialized service (will override the base one)
  getProductById,
  // Re-export specialized getProductsByCategory (will override the base one)
  getProductsByCategory
} from './product/productServiceSpecialized';

// Re-export from supabase/productMergeApi
export * from './supabase/productMergeApi';

// Export the getProductPrice function from utils 
export { getProductPrice } from '@/lib/utils';
