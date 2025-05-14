
import { Product, ColorVariant } from "@/types/product";
import { Json } from "@/integrations/supabase/types";

// Функция для преобразования типов данных для Supabase
export const transformProductToSupabase = (product: Product) => {
  return {
    id: product.id, // Ensure ID is included when updating
    title: product.title,
    description: product.description,
    price: product.price,
    discount_price: product.discountPrice,
    category: product.category,
    image_url: product.imageUrl,
    additional_images: product.additionalImages as unknown as Json,
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
    video_url: product.videoUrl,
    video_type: product.videoType,
    material: product.material
  };
};

// Функция для преобразования данных из Supabase в тип Product
export const transformSupabaseToProduct = (data: any): Product => {
  if (!data) {
    throw new Error("No data received from Supabase");
  }
  
  return {
    id: data.id,
    title: data.title || "",
    description: data.description || "",
    price: data.price || 0,
    discountPrice: data.discount_price,
    category: data.category || "",
    imageUrl: data.image_url || "/placeholder.svg",
    additionalImages: data.additional_images as string[] || [],
    rating: data.rating || 5,
    inStock: data.in_stock !== undefined ? data.in_stock : true,
    colors: data.colors as string[] || [],
    sizes: data.sizes as string[] || [],
    countryOfOrigin: data.country_of_origin || "",
    specifications: data.specifications as Record<string, string> || {},
    isNew: data.is_new || false,
    isBestseller: data.is_bestseller || false,
    articleNumber: data.article_number || "",
    barcode: data.barcode || "",
    ozonUrl: data.ozon_url,
    wildberriesUrl: data.wildberries_url,
    avitoUrl: data.avito_url,
    archived: data.archived || false,
    stockQuantity: data.stock_quantity,
    colorVariants: data.color_variants as ColorVariant[] || [],
    videoUrl: data.video_url,
    videoType: data.video_type,
    material: data.material || ""
  };
};
