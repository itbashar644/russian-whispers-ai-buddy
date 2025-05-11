
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { Product } from "@/types/product";
import { toast } from "sonner";
import ImageUploader from "@/components/admin/ImageUploader";
import MultipleImageUploader from "@/components/admin/MultipleImageUploader";

interface ProductFormProps {
  product: Partial<Product>;
  categories: string[];
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const ProductForm = ({ product, categories, onSave, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<Partial<Product>>(product);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newColor, setNewColor] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "discountPrice" || name === "rating" || name === "stockQuantity"
        ? parseFloat(value)
        : value,
    });
    
    // Автоматически обновляем статус наличия в зависимости от stockQuantity
    if (name === "stockQuantity") {
      const stockQuantity = parseFloat(value);
      if (!isNaN(stockQuantity)) {
        setFormData(prev => ({
          ...prev,
          inStock: stockQuantity > 0
        }));
      }
    }
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

  const handleAddColor = () => {
    if (newColor.trim() && !formData.colors?.includes(newColor.trim())) {
      setFormData({
        ...formData,
        colors: [...(formData.colors || []), newColor.trim()],
      });
      setNewColor("");
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setFormData({
      ...formData,
      colors: formData.colors?.filter(color => color !== colorToRemove),
    });
  };

  const handleMainImageUploaded = (url: string) => {
    setFormData({
      ...formData,
      imageUrl: url,
    });
  };

  const handleAdditionalImagesChange = (urls: string[]) => {
    setFormData({
      ...formData,
      additionalImages: urls,
    });
  };

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

  const handleSubmit = () => {
    let finalFormData = { ...formData };
    
    // Use the new category if provided
    if (showNewCategoryInput && newCategory.trim()) {
      finalFormData.category = newCategory.trim();
    }
    
    if (!finalFormData.title || !finalFormData.description || !finalFormData.category) {
      toast("Ошибка", {
        description: "Пожалуйста, заполните все обязательные поля",
      });
      return;
    }

    // Validate image URLs
    if (!validateAllImageUrls(finalFormData.imageUrl || "", finalFormData.additionalImages)) {
      toast("Ошибка URL изображений", {
        description: "Пожалуйста, укажите корректные URL изображений",
      });
      return;
    }

    // Ensure inStock is correctly set based on stockQuantity
    if (finalFormData.stockQuantity !== undefined) {
      finalFormData.inStock = finalFormData.stockQuantity > 0;
    }

    onSave(finalFormData);
  };

  return (
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
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="stockQuantity" className="text-right">
          Количество на складе
        </Label>
        <Input
          id="stockQuantity"
          name="stockQuantity"
          type="number"
          min="0"
          value={formData.stockQuantity !== undefined ? formData.stockQuantity : ""}
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
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right">
          Основное изображение
        </Label>
        <div className="col-span-3">
          <ImageUploader
            initialImageUrl={formData.imageUrl}
            onImageUploaded={handleMainImageUploaded}
            onRemoveImage={() => setFormData({...formData, imageUrl: "/placeholder.svg"})}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right">
          Дополнительные изображения
        </Label>
        <div className="col-span-3">
          <MultipleImageUploader
            initialImageUrls={formData.additionalImages}
            onImagesChange={handleAdditionalImagesChange}
          />
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
              disabled={formData.stockQuantity !== undefined}
            />
            <Label htmlFor="inStock" className={formData.stockQuantity !== undefined ? "text-muted-foreground" : ""}>
              В наличии {formData.stockQuantity !== undefined && "(определяется по количеству)"}
            </Label>
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

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button onClick={handleSubmit}>
          {product.id ? "Сохранить изменения" : "Добавить товар"}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
