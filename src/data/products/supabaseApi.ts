import { supabase } from "@/integrations/supabase/client";
import { Category } from "./categoryData";
import { Product, ColorVariant } from "@/types/product";
import { getFromStorage } from "./utils";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/integrations/supabase/types";

// Функция для преобразования типов данных для Supabase
const transformProductToSupabase = (product: Product) => {
  return {
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
    video_type: product.videoType
  };
};

// Функция для преобразования данных из Supabase в тип Product
const transformSupabaseToProduct = (data: any): Product => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    price: data.price,
    discountPrice: data.discount_price,
    category: data.category,
    imageUrl: data.image_url,
    additionalImages: data.additional_images as string[] || [],
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
    videoUrl: data.video_url,
    videoType: data.video_type
  };
};

// Функция для импорта всех категорий в Supabase
export const importCategoriesIntoSupabase = async (categories: Category[]): Promise<boolean> => {
  try {
    // Проверяем, есть ли уже категории в базе
    const { count } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });
    
    if (count && count > 0) {
      console.log("Категории уже существуют в базе данных, импорт не требуется");
      return true;
    }

    // Импортируем все категории
    const { error } = await supabase
      .from("categories")
      .insert(
        categories.map(cat => ({
          name: cat.name,
          image_url: cat.imageUrl
        }))
      );

    if (error) {
      console.error("Ошибка при импорте категорий:", error);
      return false;
    }
    
    console.log("Категории успешно импортированы в базу данных");
    return true;
  } catch (err) {
    console.error("Ошибк�� при импорте категорий:", err);
    return false;
  }
};

// Функция для импорта всех товаров в Supabase
export const importProductsIntoSupabase = async (products: Product[]): Promise<boolean> => {
  try {
    // Проверяем, есть ли уже товары в базе
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });
    
    if (count && count > 0) {
      console.log("Товары уже существуют в базе данных, импорт не требуется");
      return true;
    }

    // Импортируем товары порциями, чтобы избежать проблем с размером запроса
    const batchSize = 50;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      // Преобразуем данные товаров в формат для Supabase
      const transformedBatch = batch.map(product => transformProductToSupabase(product));
      
      const { error } = await supabase
        .from("products")
        .insert(transformedBatch);

      if (error) {
        console.error("Ошибка при импорте товаров (партия", i/batchSize + 1, "):", error);
        return false;
      }
    }
    
    console.log("Товары успешно импортированы в базу данных");
    return true;
  } catch (err) {
    console.error("Ошибка при импорте товаров:", err);
    return false;
  }
};

// Функция для получения всех категорий из Supabase
export const fetchCategoriesFromSupabase = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*");

    if (error) {
      console.error("Ошибка при загрузке категорий:", error);
      return [];
    }

    return data.map(category => ({
      name: category.name,
      imageUrl: category.image_url
    }));
  } catch (err) {
    console.error("Ошибка при загрузке категорий:", err);
    return [];
  }
};

// Функция для получения всех продуктов из Supabase
export const fetchProductsFromSupabase = async (includeArchived: boolean = false): Promise<Product[]> => {
  try {
    let query = supabase
      .from("products")
      .select("*");
    
    if (!includeArchived) {
      query = query.eq("archived", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Ошибка при загрузке товаров:", error);
      return [];
    }

    // Преобразуем данные из Supabase в тип Product
    return data.map(product => transformSupabaseToProduct(product));
  } catch (err) {
    console.error("Ошибка при загрузке товаров:", err);
    return [];
  }
};

// Функция для создания или обновления товара
export const addOrUpdateProductInSupabase = async (product: Product): Promise<boolean> => {
  try {
    // Преобразуем данные товара в формат для Supabase
    const productData = transformProductToSupabase(product);

    if (product.id && product.id.length > 10) { // предполагаем, что действительные UUID длиннее 10 символов
      // Обновляем существующий товар
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", product.id);

      if (error) {
        console.error("Ошибка при обновлении товара:", error);
        return false;
      }
    } else {
      // Добавляем новый товар
      const { error } = await supabase
        .from("products")
        .insert(productData);

      if (error) {
        console.error("Ошибка при добавлении нового товара:", error);
        return false;
      }
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при сохранении товара:", err);
    return false;
  }
};

// Функция для архивирования товара
export const archiveProductInSupabase = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .update({ archived: true })
      .eq("id", productId);

    if (error) {
      console.error("Ошибка при архивировании товара:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при архивировании товара:", err);
    return false;
  }
};

// Функция для восстановления товара из архива
export const restoreProductInSupabase = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .update({ archived: false })
      .eq("id", productId);

    if (error) {
      console.error("Ошибка при восстановлении товара из архива:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при восстановлении товара из архива:", err);
    return false;
  }
};

// Функция для удаления товара
export const removeProductFromSupabase = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Ошибка при удалении товара:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при удалении товара:", err);
    return false;
  }
};

// Функция для добавления новой категории
export const addCategoryToSupabase = async (name: string, imageUrl: string = "/placeholder.svg"): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("categories")
      .insert({
        name,
        image_url: imageUrl
      });

    if (error) {
      console.error("Ошибка при добавлении категории:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при добавлении категории:", err);
    return false;
  }
};

// Функция для обновления изображения категории
export const updateCategoryImageInSupabase = async (name: string, imageUrl: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("categories")
      .update({ image_url: imageUrl })
      .eq("name", name);

    if (error) {
      console.error("Ошибка при обновлении изображения категории:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при обновлении изображения категории:", err);
    return false;
  }
};

// Функция для удаления категории
export const removeCategoryFromSupabase = async (name: string): Promise<boolean> => {
  try {
    // Проверяем, есть ли товары в этой категории
    const { data: products, error: countError } = await supabase
      .from("products")
      .select("id")
      .eq("category", name);

    if (countError) {
      console.error("Ошибка при проверке товаров в категории:", countError);
      return false;
    }

    if (products && products.length > 0) {
      console.error("Невозможно удалить категорию, так как в ней есть товары");
      return false;
    }

    // Удаляем категорию
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("name", name);

    if (error) {
      console.error("Ошибка при удалении категории:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Ошибка при удалении категории:", err);
    return false;
  }
};

// Функция для обновления категории товаров при удалении категории
export const updateProductsCategoryInSupabase = async (oldCategory: string, newCategory: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("products")
      .update({ category: newCategory })
      .eq("category", oldCategory);

    if (error) {
      console.error("Ошибка при обновлении категории товаров:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Ошибка при обновлении категории товаров:", err);
    return false;
  }
};

// Функция для получения товаров по категории
export const getProductsByCategoryFromSupabase = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .eq("archived", false);

    if (error) {
      console.error("Ошибка при загрузке товаров по категории:", error);
      return [];
    }

    // Преобразуем данные из Supabase в тип Product
    return data.map(product => transformSupabaseToProduct(product));
  } catch (err) {
    console.error("Ошибка при загрузке товаров по категории:", err);
    return [];
  }
};

// Функция для получения товара по ID
export const getProductByIdFromSupabase = async (id: string): Promise<Product | undefined> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Ошибка при загрузке товара по ID:", error);
      return undefined;
    }

    // Преобразуем данные из Supabase в тип Product
    return transformSupabaseToProduct(data);
  } catch (err) {
    console.error("Ошибка при загрузке товара по ID:", err);
    return undefined;
  }
};

// Функция для миграции данных из localStorage при первом запуске
export const migrateDataToSupabaseIfNeeded = async (): Promise<boolean> => {
  try {
    // Проверяем, нужно ли делать импорт (если данных нет в базе)
    const { count: categoriesCount } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });
    
    const { count: productsCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });
    
    // Если данные уже есть в базе, то миграция не требуется
    if ((categoriesCount && categoriesCount > 0) || (productsCount && productsCount > 0)) {
      console.log("Данные уже есть в базе данных, миграция не требуется");
      return true;
    }

    // Получаем данные из localStorage
    const localCategories = getFromStorage<Category[]>('catalog_categories', []);
    const localProducts = getFromStorage<Product[]>('catalog_products', []);

    if (!localCategories.length && !localProducts.length) {
      console.log("Нет данных для миграции в localStorage");
      return false;
    }

    // Импортируем категории
    const categoriesImportResult = await importCategoriesIntoSupabase(localCategories);
    if (!categoriesImportResult) {
      console.error("Не удалось импортировать категории");
      return false;
    }

    // Импортируем товары
    const productsImportResult = await importProductsIntoSupabase(localProducts);
    if (!productsImportResult) {
      console.error("Не удалось импортировать товары");
      return false;
    }

    console.log("Миграция данных в Supabase успешно завершена");
    return true;
  } catch (err) {
    console.error("Ошибка при миграции данных в Supabase:", err);
    return false;
  }
};
