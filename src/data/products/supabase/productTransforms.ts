
import { Product, ColorVariant } from "@/types/product";
import { Json } from "@/integrations/supabase/types";

// Функция для преобразования типов данных для Supabase
export const transformProductToSupabase = (product: Product) => {
  try {
    // Handle undefined arrays gracefully
    const colors = Array.isArray(product.colors) ? product.colors : [];
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    const additionalImages = Array.isArray(product.additionalImages) ? product.additionalImages : [];
    const colorVariants = Array.isArray(product.colorVariants) ? product.colorVariants : [];
    
    // Ensure specifications is an object
    const specifications = product.specifications && typeof product.specifications === 'object' 
      ? product.specifications 
      : {};

    return {
      id: product.id, // Ensure ID is included when updating
      title: product.title || "",
      description: product.description || "",
      price: typeof product.price === 'number' ? product.price : 0,
      discount_price: product.discountPrice,
      category: product.category || "",
      image_url: product.imageUrl || "/placeholder.svg",
      additional_images: additionalImages as unknown as Json,
      rating: typeof product.rating === 'number' ? product.rating : 5,
      in_stock: product.inStock !== undefined ? product.inStock : true,
      colors: colors as unknown as Json,
      sizes: sizes as unknown as Json,
      country_of_origin: product.countryOfOrigin || "Россия",
      specifications: specifications as unknown as Json,
      is_new: product.isNew || false,
      is_bestseller: product.isBestseller || false,
      article_number: product.articleNumber || "",
      barcode: product.barcode || "",
      ozon_url: product.ozonUrl || null,
      wildberries_url: product.wildberriesUrl || null,
      avito_url: product.avitoUrl || null,
      archived: product.archived || false,
      stock_quantity: typeof product.stockQuantity === 'number' ? product.stockQuantity : 0,
      color_variants: colorVariants as unknown as Json,
      video_url: product.videoUrl || null,
      video_type: product.videoType || null,
      material: product.material || "",
      model_name: product.modelName || null  // Add model_name field
    };
  } catch (error) {
    console.error("Error transforming product data for Supabase:", error);
    throw new Error("Ошибка преобразования данных товара: " + (error instanceof Error ? error.message : "Неизвестная ошибка"));
  }
};

// Функция для преобразования данных из Supabase в тип Product
export const transformSupabaseToProduct = (data: any): Product => {
  if (!data) {
    throw new Error("No data received from Supabase");
  }
  
  try {
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
      material: data.material || "",
      modelName: data.model_name  // Map model_name field
    };
  } catch (error) {
    console.error("Error transforming Supabase data to Product:", error, data);
    throw new Error("Ошибка преобразования данных из Supabase: " + (error instanceof Error ? error.message : "Неизвестная ошибка"));
  }
};
