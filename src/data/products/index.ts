
// Export from productData with the original name
export * from "./productData";

// Export from categoryData but rename the conflicting function
import { 
  getAllCategories, 
  getCategoryObjects,
  addCategory, 
  removeCategory, 
  updateProductsCategory,
  updateCategoryImage,
  // Import the type separately
  type Category,
  // Rename this import to avoid conflict
  getProductsByCategory as getCategoryProducts
} from "./categoryData";

// Re-export everything from categoryData except the conflicting function
export { 
  getAllCategories, 
  getCategoryObjects,
  addCategory, 
  removeCategory, 
  updateProductsCategory,
  updateCategoryImage,
  // Export with the new name
  getCategoryProducts
};

// Re-export the type properly
export type { Category };
