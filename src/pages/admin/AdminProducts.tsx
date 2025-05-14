
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { 
  addOrUpdateProductInSupabase, 
  removeProductFromSupabase, 
  fetchCategoriesFromSupabase, 
  addCategoryToSupabase, 
  archiveProductInSupabase,
  restoreProductInSupabase,
  fetchProductsFromSupabase
} from "@/data/products/supabaseApi";
import { Product } from "@/types/product";
import ProductForm from "@/components/admin/ProductForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductTabContent from "@/components/admin/products/ProductTabContent";

const AdminProducts = () => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<string>("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default product state for new products
  const defaultProduct: Partial<Product> = {
    title: "",
    description: "",
    price: 0,
    category: "",
    imageUrl: "/placeholder.svg",
    additionalImages: [],
    rating: 5,
    inStock: true,
    countryOfOrigin: "Россия",
    articleNumber: "",
    barcode: "",
    colors: [],
    videoUrl: "",
    videoType: "mp4",
    archived: false,
  };

  // Load categories and products on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Загружаем категории
        const categoriesData = await fetchCategoriesFromSupabase();
        setCategories(categoriesData.map(cat => cat.name));
        
        // Загружаем товары в зависимости от активной вкладки
        await refreshProductsList();
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        toast.error("Не удалось загрузить данные", {
          description: "Пожалуйста, попробуйте обновить страницу."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [activeTab]);

  // Function to refresh products list
  const refreshProductsList = async () => {
    try {
      const allProducts = await fetchProductsFromSupabase(true);
      
      if (activeTab === "active") {
        const activeProducts = allProducts.filter(product => !product.archived);
        setProductsList(activeProducts);
      } else {
        const archivedProducts = allProducts.filter(product => product.archived);
        setProductsList(archivedProducts);
      }
      
      // Refresh categories too
      const categoriesData = await fetchCategoriesFromSupabase();
      setCategories(categoriesData.map(cat => cat.name));
    } catch (error) {
      console.error("Ошибка обновления списка товаров:", error);
      toast.error("Ошибка загрузки данных", {
        description: error instanceof Error ? error.message : "Неизвестная ошибка"
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm("");
    setCategoryFilter("all");
  };

  const handleSaveProduct = async (formData: Partial<Product>) => {
    try {
      if (editingProduct) {
        // Editing existing product
        const updatedProduct: Product = {
          ...editingProduct,
          ...formData,
        } as Product;
        
        console.log("Saving updated product:", updatedProduct);
        const result = await addOrUpdateProductInSupabase(updatedProduct);
        
        if (result.success) {
          await refreshProductsList();
          toast.success("Товар обновлен", {
            description: `Товар "${updatedProduct.title}" был успешно обновлен`,
          });
          setShowForm(false); // Close the form after successful save
        } else {
          throw new Error(result.error || "Не удалось обновить товар");
        }
      } else {
        // Adding new product - don't include ID field, let Supabase generate it
        const newProduct: Product = {
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

        console.log("Saving new product:", newProduct);
        const result = await addOrUpdateProductInSupabase(newProduct);
        
        if (result.success) {
          await refreshProductsList();
          toast.success("Товар добавлен", {
            description: `Товар "${newProduct.title}" был успешно добавлен`,
          });
          setShowForm(false); // Close the form after successful save
        } else {
          throw new Error(result.error || "Не удалось добавить товар");
        }
      }

      setEditingProduct(null);

      // Check if we need to add a new category
      if (formData.category && !categories.includes(formData.category)) {
        const success = await addCategoryToSupabase(formData.category);
        if (success) {
          const categoriesData = await fetchCategoriesFromSupabase();
          setCategories(categoriesData.map(cat => cat.name));
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Ошибка", {
        description: "Произошла ошибка при сохранении товара: " + (error instanceof Error ? error.message : "Неизвестная ошибка"),
      });
    }
  };

  // Filter products based on search term and category
  const filteredProducts = productsList.filter((product) => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.articleNumber && product.articleNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление товарами</h2>
        
        <Button onClick={handleAddNewProduct} disabled={activeTab === "archived" || isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить товар
        </Button>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="active">Активные товары</TabsTrigger>
          <TabsTrigger value="archived">Архив</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <ProductTabContent
            products={filteredProducts}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
            onEdit={handleEditProduct}
            onDelete={handleArchiveProduct}
            onImportComplete={refreshProductsList}
            isLoading={isLoading}
            mode="active"
            deleteButtonText="Архивировать"
            deleteButtonColor="orange"
          />
        </TabsContent>
        
        <TabsContent value="archived">
          <ProductTabContent
            products={filteredProducts}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
            onEdit={handleEditProduct}
            onDelete={handleRestoreProduct}
            onPermanentDelete={handleDeleteProduct}
            onImportComplete={refreshProductsList}
            isLoading={isLoading}
            mode="archived"
            deleteButtonText="Восстановить"
            deleteButtonColor="green"
          />
        </TabsContent>
      </Tabs>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Редактировать товар" : "Добавить новый товар"}
            </DialogTitle>
            <DialogDescription>
              Заполните форму ниже. Поля, отмеченные звездочкой (*), обязательны для заполнения.
            </DialogDescription>
          </DialogHeader>
          
          <ProductForm 
            product={editingProduct || defaultProduct}
            categories={categories}
            onSave={handleSaveProduct}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
