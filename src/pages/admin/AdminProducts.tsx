import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash, Search, X } from "lucide-react";
import { 
  products, 
  addOrUpdateProduct, 
  removeProduct, 
  getAllCategories, 
  addCategory 
} from "@/data/products";
import { Product } from "@/types/product";
import ProductImportExport from "@/components/admin/ProductImportExport";

const AdminProducts = () => {
  const [productsList, setProductsList] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // For form add/edit product
  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    description: "",
    price: 0,
    category: "",
    imageUrl: "/placeholder.svg",
    additionalImages: [], // Initialize empty array for additional images
    rating: 5,
    inStock: true,
    countryOfOrigin: "Россия",
    articleNumber: "",
    barcode: "",
    colors: [],
    videoUrl: "", 
    videoType: "mp4",
  });

  // Add state for new image URL
  const [newImageUrl, setNewImageUrl] = useState("");

  // Add state for new color
  const [newColor, setNewColor] = useState("");

  // Load categories on mount
  useEffect(() => {
    setCategories(getAllCategories());
  }, []);

  // Update the productsList when the global products array changes
  useEffect(() => {
    setProductsList([...products]);
  }, [products]);

  // Add this function to refresh products list
  const refreshProductsList = () => {
    setProductsList([...products]);
    setCategories(getAllCategories()); // Обновляем список категорий
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "discountPrice" || name === "rating"
        ? parseFloat(value)
        : value,
    });
  };

  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    if (name === "category" && value === "new") {
      // Show input for new category
      setShowNewCategoryInput(true);
      setNewCategory("");
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add function to handle adding colors
  const handleAddColor = () => {
    if (newColor.trim() && !formData.colors?.includes(newColor.trim())) {
      setFormData({
        ...formData,
        colors: [...(formData.colors || []), newColor.trim()],
      });
      setNewColor("");
    }
  };

  // Add function to handle adding additional images
  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        additionalImages: [...(formData.additionalImages || []), newImageUrl.trim()],
      });
      setNewImageUrl("");
    }
  };

  // Add function to handle removing images
  const handleRemoveImage = (imageToRemove: string) => {
    setFormData({
      ...formData,
      additionalImages: formData.additionalImages?.filter(image => image !== imageToRemove),
    });
  };

  // Add function to handle removing colors
  const handleRemoveColor = (colorToRemove: string) => {
    setFormData({
      ...formData,
      colors: formData.colors?.filter(color => color !== colorToRemove),
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

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

  // Add this function to handle image validation
  const validateImageUrl = (url: string): boolean => {
    if (!url) return true; // Empty URL is considered valid (will use default)
    
    // Basic URL validation
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Function to validate all image URLs
  const validateAllImageUrls = (mainImageUrl: string, additionalImages: string[] = []): boolean => {
    if (mainImageUrl && mainImageUrl !== "/placeholder.svg" && !validateImageUrl(mainImageUrl)) {
      return false;
    }
    
    if (additionalImages && additionalImages.length > 0) {
      for (const url of additionalImages) {
        if (!validateImageUrl(url)) {
          return false;
        }
      }
    }
    
    return true;
  };

  const handleSaveProduct = () => {
    let finalCategory = formData.category || "";
    
    // Use the new category if provided
    if (showNewCategoryInput && newCategory.trim()) {
      finalCategory = newCategory.trim();
      
      // Add new category to the global list
      addCategory(finalCategory);
      
      // Refresh categories list
      setCategories(getAllCategories());
    }
    
    if (!formData.title || !formData.description || !finalCategory) {
      toast("Ошибка", {
        description: "Пожалуйста, заполните все обязательные поля",
      });
      return;
    }

    // Validate image URLs
    if (!validateAllImageUrls(formData.imageUrl || "", formData.additionalImages)) {
      toast("Ошибка URL изображений", {
        description: "Пожалуйста, укажите корректные URL изображений",
      });
      return;
    }

    if (editingProduct) {
      // Editing existing product
      const updatedProduct: Product = {
        ...editingProduct,
        ...formData,
        category: finalCategory,
      } as Product;
      
      addOrUpdateProduct(updatedProduct);
      setProductsList([...products]);

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
        category: finalCategory,
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
      };

      addOrUpdateProduct(newProduct);
      setProductsList([...products]);

      toast("Товар добавлен", {
        description: `Товар "${newProduct.title}" был успешно добавлен`,
      });
    }

    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      price: 0,
      category: "",
      imageUrl: "/placeholder.svg",
      additionalImages: [], // Reset additional images
      rating: 5,
      inStock: true,
      countryOfOrigin: "Россия",
      articleNumber: "",
      barcode: "",
      videoUrl: "",
      videoType: "mp4",
    });
    setNewCategory("");
    setShowNewCategoryInput(false);
    setShowForm(false);
  };

  const handleDeleteProduct = () => {
    if (deleteProductId) {
      removeProduct(deleteProductId);
      setProductsList([...products]);
      
      toast("Товар удален", {
        description: "Товар был успешно удален из каталога",
      });
      
      setDeleteProductId(null);
    }
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      price: 0,
      category: "",
      imageUrl: "/placeholder.svg",
      additionalImages: [], // Reset additional images
      rating: 5,
      inStock: true,
      countryOfOrigin: "Россия",
      articleNumber: "",
      barcode: "",
      videoUrl: "",
      videoType: "mp4",
    });
    setNewCategory("");
    setShowNewCategoryInput(false);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление товарами</h2>
        
        <Button onClick={handleAddNewProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить товар
        </Button>
      </div>

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
          
          <div className="grid gap-4 py-4 mb-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Название *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="articleNumber" className="text-right">
                Артикул
              </Label>
              <Input
                id="articleNumber"
                name="articleNumber"
                value={formData.articleNumber || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="barcode" className="text-right">
                Штрих-код
              </Label>
              <Input
                id="barcode"
                name="barcode"
                value={formData.barcode || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Категория *
              </Label>
              {showNewCategoryInput ? (
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="newCategory"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Введите новую категорию"
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategory("");
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              ) : (
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => handleSelectChange(value, "category")}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">Новая категория</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Цена *
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountPrice" className="text-right">
                Цена со скидкой
              </Label>
              <Input
                id="discountPrice"
                name="discountPrice"
                type="number"
                value={formData.discountPrice || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">
                Описание *
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Основное изображение
              </Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ""}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="col-span-3"
              />
            </div>
            
            {/* Add section for additional images */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">
                Дополнительные изображения
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="URL изображения"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddImage}
                    variant="secondary"
                  >
                    Добавить
                  </Button>
                </div>
                
                {formData.additionalImages && formData.additionalImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.additionalImages.map((imgUrl, index) => (
                      <div 
                        key={index}
                        className="relative group"
                      >
                        <div className="w-24 h-24 border rounded overflow-hidden">
                          <img 
                            src={imgUrl} 
                            alt={`Дополнительное изображение ${index + 1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(imgUrl)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material" className="text-right">
                Материал
              </Label>
              <Input
                id="material"
                name="material"
                value={formData.material || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="countryOfOrigin" className="text-right">
                Страна происхождения
              </Label>
              <Input
                id="countryOfOrigin"
                name="countryOfOrigin"
                value={formData.countryOfOrigin || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">Опции</div>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={formData.inStock || false}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(!!checked, "inStock")
                    }
                  />
                  <Label htmlFor="inStock">В наличии</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isNew"
                    checked={formData.isNew || false}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(!!checked, "isNew")
                    }
                  />
                  <Label htmlFor="isNew">Новинка</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isBestseller"
                    checked={formData.isBestseller || false}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(!!checked, "isBestseller")
                    }
                  />
                  <Label htmlFor="isBestseller">Бестселлер</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <h3 className="text-sm font-medium">Ссылки на маркетплейсы</h3>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ozonUrl" className="text-right">
                  Ссылка на Ozon
                </Label>
                <Input
                  id="ozonUrl"
                  name="ozonUrl"
                  placeholder="https://www.ozon.ru/product/..."
                  value={formData.ozonUrl || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="wildberriesUrl" className="text-right">
                  Ссылка на Wildberries
                </Label>
                <Input
                  id="wildberriesUrl"
                  name="wildberriesUrl"
                  placeholder="https://www.wildberries.ru/catalog/..."
                  value={formData.wildberriesUrl || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="avitoUrl" className="text-right">
                  Ссылка на Авито
                </Label>
                <Input
                  id="avitoUrl"
                  name="avitoUrl"
                  placeholder="https://www.avito.ru/..."
                  value={formData.avitoUrl || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            
            {/* Секция для URL видео с выбором типа видео */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <h3 className="text-sm font-medium">Видео товара</h3>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="videoType" className="text-right">
                  Тип видео
                </Label>
                <Select
                  value={formData.videoType || "mp4"}
                  onValueChange={(value) => handleSelectChange(value, "videoType")}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите тип видео" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">MP4 (прямая ссылка)</SelectItem>
                    <SelectItem value="vk">ВКонтакте</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="videoUrl" className="text-right">
                  URL видео
                </Label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl || ""}
                  onChange={handleInputChange}
                  placeholder={
                    formData.videoType === "vk"
                      ? "https://vkvideo.ru/video-123456_789012 или с video_ext.php"
                      : formData.videoType === "youtube"
                      ? "https://youtube.com/watch?v=AbCdEfG или https://youtu.be/AbCdEfG"
                      : "https://example.com/video.mp4"
                  }
                  className="col-span-3"
                />
              </div>
              
              <div className="col-span-4 text-xs text-muted-foreground pl-4 md:pl-[calc(25%+1rem)]">
                {formData.videoType === "vk" ? (
                  <p>Принимаются ссылки на видео ВКонтакте в форматах: vkvideo.ru/video-ID_ID, vk.com/video-ID_ID или с video_ext.php</p>
                ) : formData.videoType === "youtube" ? (
                  <p>Принимаются ссылки на видео YouTube в форматах: youtube.com/watch?v=ID или youtu.be/ID</p>
                ) : (
                  <p>Укажите прямую ссылку на MP4-видеофайл</p>
                )}
              </div>
            </div>
            
            {/* Предпросмотр изображения, если URL зад��н */}
            {formData.imageUrl && formData.imageUrl !== "/placeholder.svg" && (
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="text-right">
                  Предпросмотр основного изображения
                </div>
                <div className="col-span-3 border rounded p-2">
                  <img 
                    src={formData.imageUrl} 
                    alt="Предпросмотр" 
                    className="max-h-[200px] object-contain mx-auto" 
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                      toast("Ошибка загрузки изображения", {
                        description: "Проверьте корректность URL-адреса",
                      });
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Add colors input */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">
                Цвета
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Название цвета"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddColor}
                    variant="secondary"
                  >
                    Добавить
                  </Button>
                </div>
                
                {formData.colors && formData.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.colors.map((color) => (
                      <div 
                        key={color}
                        className="flex items-center bg-muted rounded-md px-3 py-1 text-sm"
                      >
                        <span>{color}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveColor(color)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={handleSaveProduct}>
              {editingProduct ? "Сохранить изменения" : "Добавить товар"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>
            Отфильтруйте товары по категории или воспользуйтесь поиском
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию, артикулу или штрих-коду"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="w-full md:w-1/3">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список товаров</CardTitle>
          <CardDescription>
            Всего товаров: {filteredProducts.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Артикул</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Цена (₽)</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Товары не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>{product.articleNumber || "-"}</TableCell>
                      <TableCell>
                        <div className="font-medium">{product.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                          {product.description}
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        {product.discountPrice ? (
                          <div>
                            <span className="font-medium">{product.discountPrice.toLocaleString()}</span>{" "}
                            <span className="text-muted-foreground line-through text-sm">
                              {product.price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          product.price.toLocaleString()
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {product.inStock ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              В наличии
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                              Нет в наличии
                            </span>
                          )}
                          {product.isNew && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              Новинка
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-500"
                                onClick={() => setDeleteProductId(product.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Вы уверены?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Это действие нельзя будет отменить. Товар будет удален из каталога.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteProduct}>
                                  Удалить
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;
