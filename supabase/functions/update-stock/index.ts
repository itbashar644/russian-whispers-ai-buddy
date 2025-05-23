
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Get request body
    const { productId, quantity, colorVariant } = await req.json();
    
    if (!productId || typeof quantity !== 'number' || quantity < 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Fetch the current product data
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (fetchError || !product) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Product not found: ${fetchError?.message || 'Unknown error'}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    // Update product data based on whether we're updating a color variant or the main product
    if (colorVariant && product.color_variants) {
      const colorVariants = product.color_variants;
      const variantIndex = colorVariants.findIndex((v: any) => v.color === colorVariant);
      
      if (variantIndex === -1) {
        return new Response(
          JSON.stringify({ success: false, error: `Color variant ${colorVariant} not found` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }
      
      // Calculate new quantity for the variant
      const currentQuantity = colorVariants[variantIndex].stockQuantity || 0;
      const newQuantity = Math.max(0, currentQuantity - quantity);
      colorVariants[variantIndex].stockQuantity = newQuantity;
      
      // Update inStock status based on whether any variant has stock
      const hasAnyVariantStock = colorVariants.some((v: any) => (v.stockQuantity || 0) > 0);
      
      // Update the product with the modified color variants and inStock status
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          color_variants: colorVariants,
          in_stock: hasAnyVariantStock  // Обновление флага in_stock на основе наличия товаров
        })
        .eq('id', productId);
      
      if (updateError) {
        return new Response(
          JSON.stringify({ success: false, error: `Update failed: ${updateError.message}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    } else {
      // Update main product stock
      const currentQuantity = product.stock_quantity || 0;
      const newQuantity = Math.max(0, currentQuantity - quantity);
      
      // Update the product's stock quantity and inStock flag
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          stock_quantity: newQuantity,
          in_stock: newQuantity > 0  // Обновление флага in_stock на основе наличия товаров
        })
        .eq('id', productId);
      
      if (updateError) {
        return new Response(
          JSON.stringify({ success: false, error: `Update failed: ${updateError.message}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
