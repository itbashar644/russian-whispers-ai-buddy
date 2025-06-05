
import { supabase } from "@/integrations/supabase/client";
import { updateProductStock } from "@/data/products/product/services/productStockService";

/**
 * Update product stock quantity directly
 */
export const updateProductStockApi = async (
  productId: string, 
  stockQuantity: number, 
  colorVariant?: string
): Promise<{success: boolean, message?: string, error?: string}> => {
  try {
    // Verify admin role first (example - implement proper auth check)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }
    
    // Update the stock directly using our stock service
    const success = await updateProductStock(productId, stockQuantity, colorVariant);
    
    if (success) {
      return {
        success: true,
        message: "Stock updated successfully"
      };
    } else {
      return {
        success: false,
        error: "Failed to update stock"
      };
    }
  } catch (error) {
    console.error("Error updating product stock:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

/**
 * API endpoint for updating product stock (to be used by frontend)
 */
export const updateProductStockApiEndpoint = async (
  productId: string, 
  stockQuantity: number, 
  colorVariant?: string
): Promise<{success: boolean, message?: string, error?: string, stockQuantity?: number}> => {
  try {
    const result = await updateProductStockApi(productId, stockQuantity, colorVariant);
    
    return {
      ...result,
      stockQuantity: result.success ? stockQuantity : undefined
    };
  } catch (error) {
    console.error("Error in updateProductStockApiEndpoint:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};
