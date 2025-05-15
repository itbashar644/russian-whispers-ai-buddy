
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

/**
 * Finds products that are related by model name
 * @param modelName Model name to search for
 * @param currentProductId Optional ID of current product to exclude from results
 * @returns Array of related products
 */
export const findRelatedProductsByModel = async (modelName: string, currentProductId?: string): Promise<Product[]> => {
  if (!modelName) return [];
  
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('model_name', modelName)
      .eq('archived', false);
    
    // Exclude current product if ID is provided
    if (currentProductId) {
      query = query.neq('id', currentProductId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching related products by model:', error);
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Create a simple array to store our results
    const results: Product[] = [];
    
    // Process each item individually to avoid type recursion
    for (const item of data) {
      try {
        // Manually map the essential properties to break any type recursion
        const product: Product = {
          id: item.id,
          title: item.title || "",
          description: item.description || "",
          price: item.price || 0,
          discountPrice: item.discount_price,
          category: item.category || "",
          imageUrl: item.image_url || "/placeholder.svg",
          rating: item.rating || 5,
          inStock: item.in_stock !== undefined ? item.in_stock : true,
          countryOfOrigin: item.country_of_origin || "",
          isNew: item.is_new || false,
          isBestseller: item.is_bestseller || false,
          archived: item.archived || false,
          modelName: item.model_name || "",
          colors: (Array.isArray(item.colors) ? item.colors.map(c => String(c)) : []) as string[],
          sizes: (Array.isArray(item.sizes) ? item.sizes.map(s => String(s)) : []) as string[],
          specifications: (typeof item.specifications === 'object' && item.specifications 
            ? Object.entries(item.specifications).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
              }, {} as Record<string, string>)
            : {}) as Record<string, string>,
          additionalImages: (Array.isArray(item.additional_images) 
            ? item.additional_images.map(img => String(img)) 
            : []) as string[]
        };
        
        results.push(product);
      } catch (err) {
        console.error('Error transforming product:', err);
        // Continue with the next item even if one fails
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error in findRelatedProductsByModel:', error);
    return [];
  }
};
