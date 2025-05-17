
import { Product, ColorVariant } from "@/types/product";
import { Json } from "@/integrations/supabase/types";

// Функция преобразует Product в формат, подходящий для supabase
export const transformProductToSupabase = (product: Product): Record<string, any> => {
  const transformedData: Record<string, any> = {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    discount_price: product.discountPrice,
    category: product.category,
    image_url: product.imageUrl,
    additional_images: product.additionalImages as unknown as Json, // Type cast for compatibility
    video_url: product.videoUrl,
    video_type: product.videoType,
    rating: product.rating,
    in_stock: product.inStock,
    colors: product.colors as unknown as Json, // Type cast
    sizes: product.sizes as unknown as Json, // Type cast
    country_of_origin: product.countryOfOrigin,
    specifications: product.specifications as unknown as Json, // Type cast
    is_new: product.isNew,
    is_bestseller: product.isBestseller,
    article_number: product.articleNumber,
    barcode: product.barcode,
    ozon_url: product.ozonUrl,
    wildberries_url: product.wildberriesUrl,
    avito_url: product.avitoUrl,
    archived: product.archived,
    stock_quantity: product.stockQuantity,
    color_variants: product.colorVariants as unknown as Json, // Type cast
    material: product.material,
    model_name: product.modelName,
    variant_name: product.variantName,
  };

  // Remove undefined properties
  Object.keys(transformedData).forEach(key => {
    if (transformedData[key] === undefined) {
      delete transformedData[key];
    }
  });

  return transformedData;
};

// Функция преобразует данные из supabase в тип Product
export const transformSupabaseToProduct = (data: any): Product => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    price: data.price,
    discountPrice: data.discount_price,
    category: data.category,
    imageUrl: data.image_url,
    additionalImages: data.additional_images as string[] || [],
    videoUrl: data.video_url,
    videoType: data.video_type as 'mp4' | 'vk' | 'youtube' | undefined,
    rating: data.rating,
    inStock: data.in_stock,
    colors: data.colors as string[] || [],
    sizes: data.sizes as string[] || [],
    countryOfOrigin: data.country_of_origin,
    specifications: data.specifications as Record<string, string> || {},
    isNew: data.is_new,
    isBestseller: data.is_bestseller,
    articleNumber: data.article_number,
    barcode: data.barcode,
    ozonUrl: data.ozon_url,
    wildberriesUrl: data.wildberries_url,
    avitoUrl: data.avito_url,
    archived: data.archived,
    stockQuantity: data.stock_quantity,
    colorVariants: data.color_variants as ColorVariant[] || [],
    material: data.material,
    modelName: data.model_name,
    variantName: data.variant_name,
  };
};
