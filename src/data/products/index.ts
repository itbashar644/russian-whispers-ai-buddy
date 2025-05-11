
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
  Category,
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
  Category,
  // Export with the new name
  getCategoryProducts
};
