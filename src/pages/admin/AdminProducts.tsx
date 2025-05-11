
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { 
  products, 
  addOrUpdateProduct, 
  removeProduct, 
  getAllCategories, 
  addCategory, 
  archiveProduct,
  restoreProduct,
  getActiveProducts,
  getArchivedProducts
} from "@/data/products";
import { Product } from "@/types/product";
import ProductImportExport from "@/components/admin/ProductImportExport";
import ProductFilters from "@/components/admin/ProductFilters";
import ProductList from "@/components/admin/ProductList";
import ProductForm from "@/components/admin/ProductForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminProducts = () => {
  const [productsList, setProductsList] = useState<Product[]>(products);
  const [activeTab, setActiveTab] = useState<string>("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

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

  // Load categories on mount
  useEffect(() => {
    setCategories(getAllCategories());
  }, []);

  // Update the productsList when the global products array or activeTab changes
  useEffect(() => {
    if (activeTab === "active") {
      setProductsList(getActiveProducts());
    } else {
      setProductsList(getArchivedProducts());
    }
  }, [products, activeTab]);

  // Function to refresh products list
  const refreshProductsList = () => {
    if (activeTab === "active") {
      setProductsList(getActiveProducts());
    } else {
      setProductsList(getArchivedProducts());
    }
    setCategories(getAllCategories());
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleArchiveProduct = (productId: string) => {
    archiveProduct(productId);
    refreshProductsList();
    
    toast.info("Товар архивирован", {
      description: "Товар был перемещен в архив",
    });
  };

  const handleRestoreProduct = (productId: string) => {
    restoreProduct(productId);
    refreshProductsList();
    
    toast.success("Товар восстановлен", {
      description: "Товар был возвращен из архива",
    });
  };

  const handleDeleteProduct = (productId: string) => {
    removeProduct(productId);
    refreshProductsList();
    
    toast("Товар удален", {
      description: "Товар был удален навсегда",
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm("");
    setCategoryFilter("all");
  };

  const handleSaveProduct = (formData: Partial<Product>) => {
    if (editingProduct) {
      // Editing existing product
      const updatedProduct: Product = {
        ...editingProduct,
        ...formData,
      } as Product;
      
      addOrUpdateProduct(updatedProduct);
      refreshProductsList();

      toast("Товар обновлен", {
        description: `Товар "${updatedProduct.title}" был успешно обновлен`,
      });
    } else {
      // Adding new product
      const newProduct: Product = {
        id: `${Date.now()}`,
        title: formData.title || "",
        description: formData.description || "",
        price: formData.price || 0,
        discountPrice: formData.discountPrice,
        category: formData.category || "",
        imageUrl: formData.imageUrl || "/placeholder.svg",
        additionalImages: formData.additionalImages,
        rating: formData.rating || 5,
        inStock: formData.inStock !== undefined ? formData.inStock : true,
        colors: formData.colors,
        sizes: formData.sizes,
        material: formData.material,
        isNew: formData.isNew,
        isBestseller: formData.isBestseller,
        countryOfOrigin: formData.countryOfOrigin || "Россия",
        specifications: formData.specifications,
        articleNumber: formData.articleNumber || "",
        barcode: formData.barcode || "",
        ozonUrl: formData.ozonUrl || undefined,
        wildberriesUrl: formData.wildberriesUrl || undefined,
        avitoUrl: formData.avitoUrl || undefined,
        videoUrl: formData.videoUrl || undefined,
        videoType: formData.videoUrl ? formData.videoType : undefined,
        archived: false,
      };

      addOrUpdateProduct(newProduct);
      refreshProductsList();

      toast("Товар добавлен", {
        description: `Товар "${newProduct.title}" был успешно добавлен`,
      });
    }

    setEditingProduct(null);
    setShowForm(false);

    // Check if we need to add a new category
    if (formData.category && !categories.includes(formData.category)) {
      addCategory(formData.category);
      setCategories(getAllCategories());
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
        
        <Button onClick={handleAddNewProduct} disabled={activeTab === "archived"}>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Импорт/Экспорт</span>
              </CardTitle>
              <CardDescription>
                Массовое управление товарами через Excel-файлы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductImportExport 
                products={productsList} 
                onImportComplete={refreshProductsList}
              />
            </CardContent>
          </Card>

          <ProductFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
          />
          
          <ProductList
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleArchiveProduct}
            deleteButtonText="Архивировать"
            deleteButtonColor="orange"
            mode="active"
          />
        </TabsContent>
        <TabsContent value="archived">
          <ProductFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
          />
          
          <ProductList
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleRestoreProduct}
            deleteButtonText="Восстановить"
            deleteButtonColor="green"
            onPermanentDelete={handleDeleteProduct}
            mode="archived"
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
