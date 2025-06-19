
import { Product } from "@/types/product";
import { getProductsCache, refreshCacheIfNeeded } from "../../cache/productCache";

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
 * Gets bestseller products
 */
export const getBestsellers = async (limit = 8): Promise<Product[]> => {
  await refreshCacheIfNeeded();
  const allProducts = getProductsCache();
  
  console.log("=== BESTSELLERS DEBUG ===");
  console.log("Getting bestsellers from", allProducts.length, "total products");
  
  // Детальная диагностика каждого товара
  allProducts.forEach(product => {
    console.log(`Product "${product.title}":`, {
      isBestseller: product.isBestseller,
      isBestsellerType: typeof product.isBestseller,
      archived: product.archived,
      archivedType: typeof product.archived
    });
  });
  
  const bestsellers = allProducts.filter(product => {
    const isBestseller = product.isBestseller === true;
    const isNotArchived = !product.archived;
    const result = isBestseller && isNotArchived;
    
    if (isBestseller) {
      console.log("Found bestseller:", product.title, "isBestseller:", product.isBestseller, "archived:", product.archived, "willBeIncluded:", result);
    }
    
    return result;
  });
  
  console.log("Total bestsellers found:", bestsellers.length);
  console.log("Bestsellers list:", bestsellers.map(p => ({ 
    title: p.title, 
    isBestseller: p.isBestseller,
    archived: p.archived 
  })));
  console.log("=== END BESTSELLERS DEBUG ===");
  
  return bestsellers.slice(0, limit);
};

/**
 * Gets new products
 */
export const getNewProducts = async (limit = 8): Promise<Product[]> => {
  await refreshCacheIfNeeded();
  const allProducts = getProductsCache();
  
  console.log("=== NEW PRODUCTS DEBUG ===");
  console.log("Getting new products from", allProducts.length, "total products");
  
  // Детальная диагностика каждого товара
  allProducts.forEach(product => {
    console.log(`Product "${product.title}":`, {
      isNew: product.isNew,
      isNewType: typeof product.isNew,
      archived: product.archived,
      archivedType: typeof product.archived
    });
  });
  
  const newProducts = allProducts.filter(product => {
    const isNew = product.isNew === true;
    const isNotArchived = !product.archived;
    const result = isNew && isNotArchived;
    
    if (isNew) {
      console.log("Found new product:", product.title, "isNew:", product.isNew, "archived:", product.archived, "willBeIncluded:", result);
    }
    
    return result;
  });
  
  console.log("Total new products found:", newProducts.length);
  console.log("New products list:", newProducts.map(p => ({ 
    title: p.title, 
    isNew: p.isNew,
    archived: p.archived 
  })));
  console.log("=== END NEW PRODUCTS DEBUG ===");
  
  return newProducts.slice(0, limit);
};

/**
 * Gets related products for a product (same category, excluding the product itself)
 * @param productId ID of the product
 * @param limit Maximum number of related products to return
 * @returns Array of related products
 */
export const getRelatedProducts = async (productId: string, limit = 4): Promise<Product[]> => {
  try {
    // Use the import to avoid circular dependencies
    const product = await import("../productServiceSpecialized").then(module => module.getProductById(productId));
    
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
