
import { Product } from "@/types/product";

// Трансформация товара из формата Supabase в тип Product
export const transformSupabaseToProduct = (supabaseProduct: any): Product => {
  console.log("Transforming product from Supabase:", supabaseProduct.title, supabaseProduct);
  
  // Безопасное извлечение дополнительных изображений
  let additionalImages: string[] = [];
  if (supabaseProduct.additional_images) {
    if (Array.isArray(supabaseProduct.additional_images)) {
      additionalImages = supabaseProduct.additional_images.filter(img => img && typeof img === 'string');
    } else if (typeof supabaseProduct.additional_images === 'string') {
      try {
        const parsed = JSON.parse(supabaseProduct.additional_images);
        if (Array.isArray(parsed)) {
          additionalImages = parsed.filter(img => img && typeof img === 'string');
        }
      } catch (e) {
        console.warn("Failed to parse additional_images:", supabaseProduct.additional_images);
      }
    }
  }

  // Безопасное извлечение цветов
  let colors: string[] = [];
  if (supabaseProduct.colors) {
    if (Array.isArray(supabaseProduct.colors)) {
      colors = supabaseProduct.colors.filter(color => color && typeof color === 'string');
    } else if (typeof supabaseProduct.colors === 'string') {
      try {
        const parsed = JSON.parse(supabaseProduct.colors);
        if (Array.isArray(parsed)) {
          colors = parsed.filter(color => color && typeof color === 'string');
        }
      } catch (e) {
        console.warn("Failed to parse colors:", supabaseProduct.colors);
      }
    }
  }

  // Безопасное извлечение размеров
  let sizes: string[] = [];
  if (supabaseProduct.sizes) {
    if (Array.isArray(supabaseProduct.sizes)) {
      sizes = supabaseProduct.sizes.filter(size => size && typeof size === 'string');
    } else if (typeof supabaseProduct.sizes === 'string') {
      try {
        const parsed = JSON.parse(supabaseProduct.sizes);
        if (Array.isArray(parsed)) {
          sizes = parsed.filter(size => size && typeof size === 'string');
        }
      } catch (e) {
        console.warn("Failed to parse sizes:", supabaseProduct.sizes);
      }
    }
  }

  // Безопасное извлечение характеристик
  let specifications: Record<string, string> = {};
  if (supabaseProduct.specifications) {
    if (typeof supabaseProduct.specifications === 'object' && supabaseProduct.specifications !== null) {
      specifications = supabaseProduct.specifications;
    } else if (typeof supabaseProduct.specifications === 'string') {
      try {
        const parsed = JSON.parse(supabaseProduct.specifications);
        if (typeof parsed === 'object' && parsed !== null) {
          specifications = parsed;
        }
      } catch (e) {
        console.warn("Failed to parse specifications:", supabaseProduct.specifications);
      }
    }
  }

  // Безопасное извлечение цветовых вариантов
  let colorVariants: any[] = [];
  if (supabaseProduct.color_variants) {
    if (Array.isArray(supabaseProduct.color_variants)) {
      colorVariants = supabaseProduct.color_variants;
    } else if (typeof supabaseProduct.color_variants === 'string') {
      try {
        const parsed = JSON.parse(supabaseProduct.color_variants);
        if (Array.isArray(parsed)) {
          colorVariants = parsed;
        }
      } catch (e) {
        console.warn("Failed to parse color_variants:", supabaseProduct.color_variants);
      }
    }
  }

  const product: Product = {
    id: supabaseProduct.id,
    title: supabaseProduct.title || '',
    description: supabaseProduct.description || '',
    price: Number(supabaseProduct.price) || 0,
    discountPrice: supabaseProduct.discount_price ? Number(supabaseProduct.discount_price) : undefined,
    category: supabaseProduct.category || '',
    imageUrl: supabaseProduct.image_url || '/placeholder.svg',
    additionalImages: additionalImages,
    videoUrl: supabaseProduct.video_url || undefined,
    videoType: supabaseProduct.video_type as 'mp4' | 'vk' | 'youtube' || undefined,
    rating: Number(supabaseProduct.rating) || 4.8,
    inStock: Boolean(supabaseProduct.in_stock),
    colors: colors,
    sizes: sizes,
    countryOfOrigin: supabaseProduct.country_of_origin || 'Россия',
    specifications: specifications,
    isNew: Boolean(supabaseProduct.is_new),
    isBestseller: Boolean(supabaseProduct.is_bestseller),
    articleNumber: supabaseProduct.article_number || undefined,
    barcode: supabaseProduct.barcode || undefined,
    ozonUrl: supabaseProduct.ozon_url || undefined,
    wildberriesUrl: supabaseProduct.wildberries_url || undefined,
    avitoUrl: supabaseProduct.avito_url || undefined,
    archived: Boolean(supabaseProduct.archived),
    stockQuantity: supabaseProduct.stock_quantity ? Number(supabaseProduct.stock_quantity) : undefined,
    colorVariants: colorVariants,
    material: supabaseProduct.material || undefined,
    modelName: supabaseProduct.model_name || undefined,
  };

  console.log("Transformed product:", {
    title: product.title,
    additionalImages: product.additionalImages,
    isNew: product.isNew,
    isBestseller: product.isBestseller,
    colors: product.colors
  });

  return product;
};

// Трансформация товара из типа Product в формат для Supabase
export const transformProductToSupabase = (product: Product): any => {
  console.log("Transforming product to Supabase:", product.title, product);
  
  const supabaseProduct = {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    discount_price: product.discountPrice || null,
    category: product.category,
    image_url: product.imageUrl,
    additional_images: product.additionalImages || [],
    video_url: product.videoUrl || null,
    video_type: product.videoType || null,
    rating: product.rating,
    in_stock: product.inStock,
    colors: product.colors || [],
    sizes: product.sizes || [],
    country_of_origin: product.countryOfOrigin,
    specifications: product.specifications || {},
    is_new: product.isNew || false,
    is_bestseller: product.isBestseller || false,
    article_number: product.articleNumber || null,
    barcode: product.barcode || null,
    ozon_url: product.ozonUrl || null,
    wildberries_url: product.wildberriesUrl || null,
    avito_url: product.avitoUrl || null,
    archived: product.archived || false,
    stock_quantity: product.stockQuantity || null,
    color_variants: product.colorVariants || [],
    material: product.material || null,
    model_name: product.modelName || null,
  };

  console.log("Transformed to Supabase format:", {
    title: supabaseProduct.title,
    additional_images: supabaseProduct.additional_images,
    is_new: supabaseProduct.is_new,
    is_bestseller: supabaseProduct.is_bestseller
  });

  return supabaseProduct;
};
