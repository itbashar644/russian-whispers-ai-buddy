
import { supabase } from "@/integrations/supabase/client";
import { Product, ColorVariant } from "@/types/product";
import { Json } from "@/integrations/supabase/types";

/**
 * Transform a Supabase product record into our Product type
 */
export const transformSupabaseToProduct = (item: any): Product => {
  // Parse colors JSON data
  let colors: string[] | undefined = undefined;
  if (item.colors) {
    colors = Array.isArray(item.colors) ? item.colors : undefined;
  }

  // Parse sizes JSON data
  let sizes: string[] | undefined = undefined;
  if (item.sizes) {
    sizes = Array.isArray(item.sizes) ? item.sizes : undefined;
  }

  // Parse color variants
  let colorVariants: ColorVariant[] | undefined = undefined;
  if (item.color_variants) {
    colorVariants = Array.isArray(item.color_variants) 
      ? item.color_variants
      : undefined;
  }

  // Parse specifications
  let specifications: Record<string, string> | undefined = undefined;
  if (item.specifications && typeof item.specifications === 'object') {
    specifications = item.specifications;
  }

  // Parse additional_images
  let additionalImages: string[] | undefined = undefined;
  if (item.additional_images) {
    additionalImages = Array.isArray(item.additional_images) 
      ? item.additional_images
      : undefined;
  }

  // Create the product object
  const product: Product = {
    id: item.id,
    title: item.title,
    description: item.description,
    price: parseFloat(item.price),
    discountPrice: item.discount_price ? parseFloat(item.discount_price) : undefined,
    category: item.category,
    imageUrl: item.image_url || "/placeholder.svg",
    additionalImages: additionalImages,
    videoUrl: item.video_url,
    videoType: item.video_type,
    rating: parseFloat(item.rating || "5"),
    inStock: item.in_stock,
    colors: colors,
    sizes: sizes,
    countryOfOrigin: item.country_of_origin,
    specifications: specifications,
    isNew: item.is_new || false,
    isBestseller: item.is_bestseller || false,
    articleNumber: item.article_number,
    barcode: item.barcode,
    ozonUrl: item.ozon_url,
    wildberriesUrl: item.wildberries_url,
    avitoUrl: item.avito_url,
    material: item.material,
    archived: item.archived || false,
    stockQuantity: typeof item.stock_quantity === 'number' ? item.stock_quantity : undefined,
    colorVariants: colorVariants,
    modelName: item.model_name,
    variantName: item.variant_name
  };

  return product;
};

/**
 * Transform our Product type to a Supabase record
 */
export const transformProductToSupabase = (product: Product): Record<string, any> => {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    discount_price: product.discountPrice,
    category: product.category,
    image_url: product.imageUrl,
    additional_images: product.additionalImages as unknown as Json,
    video_url: product.videoUrl,
    video_type: product.videoType,
    rating: product.rating,
    in_stock: product.inStock,
    colors: product.colors as unknown as Json,
    sizes: product.sizes as unknown as Json,
    country_of_origin: product.countryOfOrigin,
    specifications: product.specifications as unknown as Json,
    is_new: product.isNew,
    is_bestseller: product.isBestseller,
    article_number: product.articleNumber,
    barcode: product.barcode,
    ozon_url: product.ozonUrl,
    wildberries_url: product.wildberriesUrl,
    avito_url: product.avitoUrl,
    archived: product.archived,
    stock_quantity: product.stockQuantity,
    color_variants: product.colorVariants as unknown as Json,
    material: product.material,
    model_name: product.modelName,
    variant_name: product.variantName
  };
};
