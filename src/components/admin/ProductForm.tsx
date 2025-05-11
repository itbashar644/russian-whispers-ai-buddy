import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Product } from "@/types/product";
import ImageUploader from "./ImageUploader";
import MultipleImageUploader from "./MultipleImageUploader";
import { Box, Plus, Trash } from "lucide-react";

interface ProductFormProps {
  product: Partial<Product>;
  categories: string[];
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    ...product,
    stockQuantity: product.stockQuantity || 0,
  });

  const [newCategory, setNewCategory] = useState<string>("");
  const [newSpecKey, setNewSpecKey] = useState<string>("");
  const [newSpecValue, setNewSpecValue] = useState<string>("");
  const [newColor, setNewColor] = useState<string>("");
  const [newSize, setNewSize] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "price" || name === "discountPrice" || name === "stockQuantity") {
      // Ensure values are converted to numbers
      setFormData({
        ...formData,
        [name]: value === "" ? undefined : Number(value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title) {
      toast.error("Название товара обязательно");
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      toast.error("Укажите корректную цену товара");
      return;
    }
    
    if (!formData.category) {
      toast.error("Категория товара обязательна");
      return;
    }

    // Update inStock based on stockQuantity
    const updatedData = {
      ...formData,
      inStock: (formData.stockQuantity !== undefined && formData.stockQuantity > 0)
    };
    
    onSave(updatedData);
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, imageUrl: url });
  };

  const handleAdditionalImagesUpload = (urls: string[]) => {
    setFormData({ ...formData, additionalImages: urls });
  };

  const handleAddSpecification = () => {
    if (!newSpecKey || !newSpecValue) return;
    
    setFormData({
      ...formData,
      specifications: {
        ...(formData.specifications || {}),
        [newSpecKey]: newSpecValue,
      },
    });
    
    setNewSpecKey("");
    setNewSpecValue("");
  };

  const handleRemoveSpecification = (key: string) => {
    if (!formData.specifications) return;
    
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    
    setFormData({
      ...formData,
      specifications: newSpecs,
    });
  };

  const handleAddColor = () => {
    if (!newColor) return;
    
    setFormData({
      ...formData,
      colors: [...(formData.colors || []), newColor],
    });
    
    setNewColor("");
  };

  const handleRemoveColor = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors?.filter((c) => c !== color),
    });
  };

  const handleAddSize = () => {
    if (!newSize) return;
    
    setFormData({
      ...formData,
      sizes: [...(formData.sizes || []), newSize],
    });
    
    setNewSize("");
  };

  const handleRemoveSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes?.filter((s) => s !== size),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Название товара *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Описание товара</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <Label htmlFor="category">Категория товара *</Label>
          <Select
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            defaultValue={formData.category || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
              <SelectItem value="new">
                <div className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить новую категорию
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {formData.category === "new" && (
            <div className="mt-2 flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Название новой категории"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setFormData({ ...formData, category: newCategory });
                }}
              >
                Подтвердить
              </Button>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="price">Цена товара *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price === undefined ? "" : formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="discountPrice">Цена со скидкой</Label>
          <Input
            id="discountPrice"
            name="discountPrice"
            type="number"
            value={formData.discountPrice === undefined ? "" : formData.discountPrice}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="imageUrl">Изображение товара</Label>
          {formData.imageUrl && (
            <div className="mb-2 h-20 w-20 overflow-hidden border rounded-md">
              <img
                src={formData.imageUrl}
                alt={formData.title || "Product Image"}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          )}
          <ImageUploader
            initialImageUrl={formData.imageUrl}
            onImageUploaded={handleImageUpload}
          />
        </div>

        <div>
          <Label htmlFor="additionalImages">Дополнительные изображения</Label>
          <MultipleImageUploader
            initialImageUrls={formData.additionalImages}
            onImageUploaded={handleAdditionalImagesUpload}
          />
        </div>

        <div>
          <Label htmlFor="videoUrl">Ссылка на видео</Label>
          <Input
            id="videoUrl"
            name="videoUrl"
            type="text"
            value={formData.videoUrl || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="videoType">Тип видео</Label>
          <Select
            onValueChange={(value) => setFormData({ ...formData, videoType: value })}
            defaultValue={formData.videoType || "mp4"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите тип видео" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp4">MP4</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="vk">VK</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Stock Quantity Section */}
        <div>
          <Label htmlFor="stockQuantity">Количество в наличии</Label>
          <Input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity === undefined ? 0 : formData.stockQuantity}
            onChange={handleChange}
            min="0"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Если значение больше 0, товар будет помечен как "в наличии"
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isNew"
            checked={formData.isNew || false}
            onCheckedChange={(checked) => handleCheckboxChange("isNew", checked)}
          />
          <Label htmlFor="isNew">Новинка</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isBestseller"
            checked={formData.isBestseller || false}
            onCheckedChange={(checked) => handleCheckboxChange("isBestseller", checked)}
          />
          <Label htmlFor="isBestseller">Бестселлер</Label>
        </div>

        <div>
          <Label htmlFor="countryOfOrigin">Страна производитель</Label>
          <Input
            id="countryOfOrigin"
            name="countryOfOrigin"
            type="text"
            value={formData.countryOfOrigin || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="articleNumber">Артикул</Label>
          <Input
            id="articleNumber"
            name="articleNumber"
            type="text"
            value={formData.articleNumber || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="barcode">Штрихкод</Label>
          <Input
            id="barcode"
            name="barcode"
            type="text"
            value={formData.barcode || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="ozonUrl">Ozon URL</Label>
          <Input
            id="ozonUrl"
            name="ozonUrl"
            type="text"
            value={formData.ozonUrl || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="wildberriesUrl">Wildberries URL</Label>
          <Input
            id="wildberriesUrl"
            name="wildberriesUrl"
            type="text"
            value={formData.wildberriesUrl || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="avitoUrl">Avito URL</Label>
          <Input
            id="avitoUrl"
            name="avitoUrl"
            type="text"
            value={formData.avitoUrl || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Характеристики</Label>
          {formData.specifications &&
            Object.entries(formData.specifications).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2 mb-2">
                <Input
                  type="text"
                  value={key}
                  readOnly
                  className="w-1/2 cursor-not-allowed"
                />
                <Input
                  type="text"
                  value={value}
                  readOnly
                  className="w-1/2 cursor-not-allowed"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveSpecification(key)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Название характеристики"
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Значение характеристики"
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
            />
            <Button type="button" size="sm" onClick={handleAddSpecification}>
              Добавить
            </Button>
          </div>
        </div>

        <div>
          <Label>Цвета</Label>
          {formData.colors &&
            formData.colors.map((color) => (
              <div key={color} className="flex items-center space-x-2 mb-2">
                <Input
                  type="text"
                  value={color}
                  readOnly
                  className="cursor-not-allowed"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveColor(color)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Новый цвет"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
            />
            <Button type="button" size="sm" onClick={handleAddColor}>
              Добавить
            </Button>
          </div>
        </div>

        <div>
          <Label>Размеры</Label>
          {formData.sizes &&
            formData.sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2 mb-2">
                <Input
                  type="text"
                  value={size}
                  readOnly
                  className="cursor-not-allowed"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveSize(size)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Новый размер"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
            />
            <Button type="button" size="sm" onClick={handleAddSize}>
              Добавить
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={formData.stockQuantity !== undefined ? formData.stockQuantity > 0 : formData.inStock || false}
            onCheckedChange={(checked) => {
              if (checked) {
                setFormData({ ...formData, stockQuantity: formData.stockQuantity || 1 });
              } else {
                setFormData({ ...formData, stockQuantity: 0 });
              }
            }}
            disabled
          />
          <Label htmlFor="inStock" className="text-muted-foreground">
            В наличии (определяется автоматически по количеству)
          </Label>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit">Сохранить</Button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
