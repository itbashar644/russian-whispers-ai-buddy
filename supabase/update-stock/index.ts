
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  return null;
}

function getServiceClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  return createClient(supabaseUrl, supabaseKey);
}

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid method' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  try {
    const { productId, quantity, colorVariant } = await req.json();

    if (!productId || !quantity) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabase = getServiceClient();

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error || !product) {
      return new Response(
        JSON.stringify({ success: false, error: 'Product not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (colorVariant && Array.isArray(product.color_variants)) {
      const variants = product.color_variants as any[];
      const index = variants.findIndex(v => v.color === colorVariant);
      if (index === -1) {
        return new Response(
          JSON.stringify({ success: false, error: 'Variant not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      const variant = variants[index];
      const newQty = Math.max(0, (variant.stockQuantity ?? 0) - quantity);
      variants[index] = { ...variant, stockQuantity: newQty };
      const hasStock = variants.some(v => (v.stockQuantity ?? 0) > 0);

      const { error: updateError } = await supabase
        .from('products')
        .update({ color_variants: variants, in_stock: hasStock })
        .eq('id', productId);

      if (updateError) {
        return new Response(
          JSON.stringify({ success: false, error: updateError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    } else {
      const currentQty = product.stock_quantity ?? 0;
      const newQty = Math.max(0, currentQty - quantity);

      const { error: updateError } = await supabase
        .from('products')
        .update({ stock_quantity: newQty, in_stock: newQty > 0 })
        .eq('id', productId);

      if (updateError) {
        return new Response(
          JSON.stringify({ success: false, error: updateError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
