
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Json } from "@/integrations/supabase/types";
import { transformSupabaseToProduct } from "./productTransforms";

// Interface to represent the raw product data from Supabase
interface ProductRow {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price: number | null;
  category: string;
  image_url: string;
  additional_images: Json;
  rating: number;
  in_stock: boolean;
  colors: Json;
  sizes: Json;
  country_of_origin: string;
  specifications: Json;
  is_new: boolean;
  is_bestseller: boolean;
  article_number: string | null;
  barcode: string | null;
  ozon_url: string | null;
  wildberries_url: string | null;
  avito_url: string | null;
  archived: boolean;
  stock_quantity: number | null;
  color_variants: Json;
  video_url: string | null;
  video_type: string | null;
  material: string | null;
  model_name: string | null;
}

/**
 * Fetches products with the same model name
 * @param {string} modelName - The model name to search for
 * @returns {Promise<Product[]>} List of products with the same model name
 */
export const getRelatedModelProducts = async (modelName: string): Promise<Product[]> => {
  if (!modelName) return [];
  
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("model_name", modelName)
      .order("archived", { ascending: true });
      
    if (error) {
      console.error("Error fetching related model products:", error);
      throw error;
    }
    
    if (!data || data.length === 0) return [];
    
    // Transform raw data to Product objects
    return (data as ProductRow[]).map(transformSupabaseToProduct);
  } catch (err) {
    console.error("Error in getRelatedModelProducts:", err);
    return [];
  }
};

/**
 * Fetches the main product for a given model name
 * @param {string} modelName - The model name to search for
 * @returns {Promise<Product | null>} The main (non-archived) product or null
 */
export const getMainProductForModel = async (modelName: string): Promise<Product | null> => {
  if (!modelName) return null;
  
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("model_name", modelName)
      .eq("archived", false)
      .limit(1)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned, which is not an error in this context
        return null;
      }
      console.error("Error fetching main product for model:", error);
      throw error;
    }
    
    if (!data) return null;
    
    // Transform raw data to Product object
    return transformSupabaseToProduct(data as ProductRow);
  } catch (err) {
    console.error("Error in getMainProductForModel:", err);
    return null;
  }
};

// Export an API object with the functions
export const relatedProductsApi = {
  getRelatedModelProducts,
  getMainProductForModel
};
