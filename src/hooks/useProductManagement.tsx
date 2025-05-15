
import { useState } from "react";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { 
  addOrUpdateProductInSupabase,
  removeProductFromSupabase,
  archiveProductInSupabase,
  restoreProductInSupabase,
  addCategoryToSupabase
} from "@/data/products/supabaseApi";

interface ProductManagementProps {
  refreshProductsList: () => Promise<void>;
  setShowForm: (show: boolean) => void;
  setEditingProduct: (product: Product | null) => void;
}

export function useProductManagement({
  refreshProductsList,
  setShowForm,
  setEditingProduct
}: ProductManagementProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle saving a product (new or updated)
  const handleSaveProduct = async (formData: Partial<Product>) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepared product object with proper formatting
      let productToSave: Product;
      
      if ('id' in formData && formData.id) {
        // Updating existing product
        productToSave = formData as Product;
      } else {
        // Adding new product - don't include ID field, let Supabase generate it
        productToSave = {
          id: "", // Empty ID, will be replaced by Supabase with a proper UUID
          title: formData.title || "",
          description: formData.description || "",
          price: formData.price || 0,
          discountPrice: formData.discountPrice,
          category: formData.category || "",
          imageUrl: formData.imageUrl || "/placeholder.svg",
          additionalImages: formData.additionalImages || [],
          rating: formData.rating || 5,
          inStock: formData.inStock !== undefined ? formData.inStock : true,
          colors: formData.colors || [],
          sizes: formData.sizes || [],
          material: formData.material || "",
          isNew: formData.isNew || false,
          isBestseller: formData.isBestseller || false,
          countryOfOrigin: formData.countryOfOrigin || "Россия",
          specifications: formData.specifications || {},
          articleNumber: formData.articleNumber || "",
          barcode: formData.barcode || "",
          ozonUrl: formData.ozonUrl || undefined,
          wildberriesUrl: formData.wildberriesUrl || undefined,
          avitoUrl: formData.avitoUrl || undefined,
          videoUrl: formData.videoUrl || undefined,
          videoType: formData.videoUrl ? formData.videoType : undefined,
          archived: false,
          stockQuantity: formData.stockQuantity || 0,
          colorVariants: formData.colorVariants || [],
        };
      }

      console.log("Saving product:", productToSave);
      const result = await addOrUpdateProductInSupabase(productToSave);
      
      if (result.success) {
        await refreshProductsList();
        toast.success(formData.id ? "Товар обновлен" : "Товар добавлен", {
          description: `Товар "${productToSave.title}" был успешно ${formData.id ? "обновлен" : "добавлен"}`,
        });
        setShowForm(false);
        setEditingProduct(null);

        // Check if we need to add a new category
        if (productToSave.category && !await isCategoryExists(productToSave.category)) {
          await addCategoryToSupabase(productToSave.category);
        }
      } else {
        throw new Error(result.error || "Не удалось сохранить товар");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Ошибка", {
        description: "Произошла ошибка при сохранении товара: " + (error instanceof Error ? error.message : "Неизвестная ошибка"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to check if category exists
  const isCategoryExists = async (category: string): Promise<boolean> => {
    try {
      const categories = await fetchCategories();
      return categories.includes(category);
    } catch {
      return false;
    }
  };

  // Helper to fetch categories
  const fetchCategories = async (): Promise<string[]> => {
    try {
      const { data } = await supabase.from('categories').select('name');
      return data ? data.map(c => c.name) : [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  // Handle archiving a product
  const handleArchiveProduct = async (productId: string) => {
    const success = await archiveProductInSupabase(productId);
    
    if (success) {
      await refreshProductsList();
      toast.info("Товар архивирован", {
        description: "Товар был перемещен в архив",
      });
    } else {
      toast.error("Ошибка архивации", {
        description: "Не удалось архивировать товар",
      });
    }
  };

  // Handle restoring a product from archive
  const handleRestoreProduct = async (productId: string) => {
    const success = await restoreProductInSupabase(productId);
    
    if (success) {
      await refreshProductsList();
      toast.success("Товар восстановлен", {
        description: "Товар был возвращен из архива",
      });
    } else {
      toast.error("Ошибка восстановления", {
        description: "Не удалось восстановить товар",
      });
    }
  };

  // Handle permanently deleting a product
  const handleDeleteProduct = async (productId: string) => {
    const success = await removeProductFromSupabase(productId);
    
    if (success) {
      await refreshProductsList();
      toast("Товар удален", {
        description: "Товар был удален навсегда",
      });
    } else {
      toast.error("Ошибка удаления", {
        description: "Не удалось удалить товар",
      });
    }
  };

  return {
    handleSaveProduct,
    handleArchiveProduct,
    handleRestoreProduct,
    handleDeleteProduct,
    isSubmitting
  };
}
